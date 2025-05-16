import type { JobScheduler } from '@webext-core/job-scheduler'
import type { ConvexClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { taskDataStorage } from '@/lib/storage/tasks'
import { calcEfficiency } from '@/lib/utils'
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

function program(data: TaskStartParams, jobs: JobScheduler, convex: ConvexClient) {
  return Effect.gen(function* (_) {
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

    const currentSession = yield* _(Effect.tryPromise({
      try: async () => convex.query(api.sessions.pickCurrentSession, {
      }),
      catch: e => new TaskStartError({
        cause: e,
        message: 'Failed to get current session',
      }),
    }), Effect.flatMap(session => Effect.fromNullable(session)))

    const draft = {
      id: data.id,
      description: data.description,
      start: Date.now(),
      duration: 0,
      efficiency: calcEfficiency(0, data.aet),
      earnings: 0,
      aet: data.aet,
      sessionId: currentSession._id,
    }

    yield* Effect.tryPromise({
      try: async () => convex.mutation(api.tasks.create, draft),
      catch: e => new TaskStartError({
        cause: e,
        message: 'Failed to set task',
      }),
    })

    yield* Effect.tryPromise({
      try: async () => taskDataStorage.setValue({
        start: draft.start,
        aet: draft.aet,
      }),
      catch: e => new TaskStartError({
        cause: e,
        message: 'Failed to set task start time',
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
      const data = await taskDataStorage.getValue()
      if (!data) return

      const duration = Duration.millis(Date.now() - data.start).pipe(Duration.parts)

      await browser.action.setBadgeText({
        text: `${getRemainingTime(duration.seconds, data.aet)}`,
      })
    },

  })
}

export async function handleTaskStart(data: TaskStartParams, jobs: JobScheduler, convex: ConvexClient) {
  return program(data, jobs, convex).pipe(Effect.runPromise)
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
