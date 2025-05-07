import { sessionStorage } from '@/lib/storage/sessions'
import { taskStorage } from '@/lib/storage/tasks'
import { calcEarnings, calcEfficiency } from '@/src/lib/utils'
import { defineJobScheduler } from '@webext-core/job-scheduler'
import { type } from 'arktype'
import { Data, Effect } from 'effect'
import { create } from 'mutative'
import { statusStorage } from '../storage/status'

class TaskStopError extends Data.TaggedError('TaskStopError')<{
  cause?: unknown
  message?: string
}> {}

export const taskStopValidator = type({
  action: '\'submit\' | \'release\'',
  rate: 'number',
})

export type TaskStopParams = typeof taskStopValidator.t

function program(action: TaskStopParams['action'], rate: TaskStopParams['rate']) {
  return Effect.gen(function* (_) {
    const jobs = defineJobScheduler()

    const status = yield* _(Effect.tryPromise({
      try: async () => statusStorage.getValue(),
      catch: e => new TaskStopError({
        cause: e,
        message: 'Failed to get status storage',
      }),
    }))

    if (!status.task) {
      throw new TaskStopError({
        message: 'Task not active',
      })
    }

    if (!status.session) {
      throw new TaskStopError({
        message: 'Session not active',
      })
    }

    const currentTask = yield* Effect.tryPromise({
      try: async () => taskStorage.getValue(),
      catch: e => new TaskStopError({
        cause: e,
        message: 'Failed to get current task',
      }),
    })

    if (!currentTask) {
      throw new TaskStopError({
        message: 'Task not active',
      })
    }

    const currentSession = yield* Effect.tryPromise({
      try: async () => sessionStorage.getValue(),
      catch: e => new TaskStopError({
        cause: e,
        message: 'Failed to get current session',
      }),
    })

    if (!currentSession) {
      throw new TaskStopError({
        message: 'Session not active',
      })
    }

    if (action === 'submit') {
      const updatedSession = create(currentSession, (draft) => {
        draft.description = `${draft.tasks.length + 1} tasks`
        draft.tasks.push(currentTask)
        draft.duration = draft.tasks.reduce((acc, curr) => acc + curr.duration, 0)
        draft.earnings = calcEarnings(draft.duration, rate)
        draft.efficiency = calcEfficiency(draft.duration, draft.tasks.reduce((a, c) => a + c.aet, 0))
      })

      yield* Effect.tryPromise({
        try: async () => sessionStorage.setValue(updatedSession),
        catch: e => new TaskStopError({
          cause: e,
          message: 'Failed to update session with task',
        }),
      })
    }

    yield* Effect.tryPromise({
      try: async () => taskStorage.removeValue(),
      catch: e => new TaskStopError({
        cause: e,
        message: 'Failed to reset task',
      }),
    })

    yield* Effect.tryPromise({
      try: async () => jobs.removeJob('task-timer'),
      catch: e => new TaskStopError({
        cause: e,
        message: 'Failed to unschedule task timer',
      }),
    })

    yield* Effect.tryPromise({
      try: async () => browser.action.setBadgeText({
        text: '',
      }),
      catch: e => new TaskStopError({
        cause: e,
        message: 'Failed to clear badge text',
      }),
    })

    yield* Effect.tryPromise({
      try: async () => statusStorage.setValue(create(status, (draft) => {
        draft.task = false
      })),
      catch: e => new TaskStopError({
        cause: JSON.stringify(e),
        message: 'Failed to set status storage',
      }),
    })

    return true
  })
}

export async function handleTaskStop(action: TaskStopParams['action'], rate: TaskStopParams['rate']) {
  return program(action, rate).pipe(Effect.runPromise)
}
