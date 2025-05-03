import type { JobScheduler } from '@webext-core/job-scheduler'
import { sessionStorage } from '@/lib/storage/sessions'
import { taskStorage } from '@/lib/storage/tasks'
import { gen } from '@/src/lib/utils'
import { Data, Effect } from 'effect'
import { create } from 'mutative'
import { MsgResponse } from '.'
import { statusStorage } from '../storage/status'

class TaskStopError extends Data.TaggedError('TaskStopError')<{
  cause?: unknown
  message?: string
}> {}

export type TaskStopAction = 'submit' | 'release'

function program(action: TaskStopAction, jobs: JobScheduler) {
  return Effect.gen(function* (_) {
    const status = yield* _(Effect.tryPromise({
      try: async () => statusStorage.getValue(),
      catch: e => new TaskStopError({
        cause: e,
        message: 'Failed to get status storage',
      }),
    }))

    if (!status.task) return new MsgResponse(false, 'Task not active')
    if (!status.session) return new MsgResponse(false, 'Session not active')

    const currentTask = yield* Effect.tryPromise({
      try: async () => taskStorage.getValue(),
      catch: e => new TaskStopError({
        cause: e,
        message: 'Failed to get current task',
      }),
    })

    if (!currentTask) return new MsgResponse(false, 'Task not active')

    const currentSession = yield* Effect.tryPromise({
      try: async () => sessionStorage.getValue(),
      catch: e => new TaskStopError({
        cause: e,
        message: 'Failed to get current session',
      }),
    })

    if (!currentSession) return new MsgResponse(false, 'Session not active')

    if (action === 'submit') {
      const updatedSession = yield* _(
        Effect.succeed(create(currentTask, (draft) => {
          draft.duration = Date.now() - draft.start
        })),
        Effect.map(task =>
          create(currentSession, (draft) => {
            draft.tasks.push(task)
          })),
      )

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

    return new MsgResponse(true, 'Task stopped')
  })
}

export async function handleTaskStop(action: TaskStopAction, jobs: JobScheduler) {
  return gen(program(action, jobs))
}
