import type { Task } from '@/lib/storage/tasks'
import type { JobScheduler } from '@webext-core/job-scheduler'
import { taskStorage } from '@/lib/storage/tasks'
import { calcEarnings, calcEfficiency } from '@/lib/utils'
import { type } from 'arktype'
import { Data, Duration, Effect } from 'effect'
import { create } from 'mutative'
import { statusStorage } from '../storage/status'

class TaskStartError extends Data.TaggedError('TaskStartError')<{
  cause?: unknown
  message?: string
}> {}

export const taskStartValidator = type({
  id: 'string',
  description: 'string',
  aet: 'number',
})

export type TaskStartParams = typeof taskStartValidator.t

function program(data: TaskStartParams, jobs: JobScheduler) {
  return Effect.gen(function* () {
    const status = yield* Effect.tryPromise({
      try: async () => statusStorage.getValue(),
      catch: e => new TaskStartError({
        cause: e,
        message: 'Failed to get current task',
      }),
    })

    if (status.task) {
      return new TaskStartError({
        message: 'Task already active',
      })
    }

    if (!status.session) {
      return new TaskStartError({
        message: 'Session not active',
      })
    }

    const draft: Task = {
      id: data.id,
      description: data.description,
      start: Date.now(),
      duration: 0,
      efficiency: 0,
      earnings: 0,
      aet: data.aet,
    }

    yield* Effect.tryPromise({
      try: async () => taskStorage.setValue(draft),
      catch: e => new TaskStartError({
        cause: e,
        message: 'Failed to set task',
      }),
    })

    yield* Effect.tryPromise({
      try: async () => browser.action.setBadgeText({
        text: getRemainingTime(draft.duration, draft.aet),
      }),
      catch: e => new TaskStartError({
        cause: e,
        message: 'Failed to set badge text',
      }),
    })

    yield* Effect.tryPromise({
      try: async () => handleTaskTimer(jobs),
      catch: e => new TaskStartError({
        cause: e,
        message: 'Failed to start task timer',
      }),
    })

    yield* Effect.tryPromise({
      try: async () => statusStorage.setValue(create(status, (draft) => {
        draft.task = true
      })),
      catch: e => new TaskStartError({
        cause: JSON.stringify(e),
        message: 'Failed to set status storage',
      }),
    })

    yield* Effect.tryPromise({
      try: async () => {
        await browser.action.setBadgeBackgroundColor({
          color: '#000000',
        })

        await browser.action.setBadgeTextColor({
          color: '#fff',
        })
      },
      catch: e => new TaskStartError({
        cause: e,
        message: 'Failed to set badge background color',
      }),
    })

    return draft
  })
}

// TODO: prevent constant storage updates
async function handleTaskTimer(jobs: JobScheduler) {
  await jobs.scheduleJob({
    id: 'task-timer',
    type: 'interval',
    duration: 1000,
    execute: async () => {
      const task = await taskStorage.getValue()
      if (!task) return

      await taskStorage.setValue(create(task, (draft) => {
        draft.duration = draft.duration + 1
        draft.efficiency = calcEfficiency(draft.duration, draft.aet)
        draft.earnings = calcEarnings(draft.duration, 15)
      }))

      await browser.action.setBadgeText({
        text: `${getRemainingTime(task.duration + 1, task.aet)}`,
      })
    },

  })
}

export async function handleTaskStart(data: TaskStartParams, jobs: JobScheduler) {
  return program(data, jobs).pipe(Effect.runPromise)
}

function getRemainingTime(rawDur: number, rawAet: number) {
  const aet = Duration.minutes(rawAet)
  const dur = Duration.seconds(rawDur)

  const isNeg = Duration.subtract(aet, dur).pipe(Duration.toMillis) === 0

  const res = isNeg ? Duration.subtract(dur, aet) : Duration.subtract(aet, dur)

  const parts = Duration.parts(res)

  if (parts.minutes >= 10) return `${isNeg ? '-' : ''}${parts.minutes}m`
  if (parts.minutes === 0) return `${isNeg ? '-' : ''}${parts.seconds}s`

  return `${isNeg ? '-' : ''}${parts.minutes}:${parts.seconds.toString().padStart(2, '0')}`
}
