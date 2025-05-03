import type { Task } from '@/lib/storage/tasks'
import type { JobScheduler } from '@webext-core/job-scheduler'
import { sessionStorage } from '@/lib/storage/sessions'
import { taskStorage } from '@/lib/storage/tasks'
import { gen } from '@/src/lib/utils'
import { Data, Effect } from 'effect'
import { create } from 'mutative'
import { MsgResponse } from '.'

class TaskStopError extends Data.TaggedError('TaskStopError')<{
  cause?: unknown
  message?: string
}> {}

const resettedTask: Task = {
  id: '',
  description: '',
  start: Date.now(),
  duration: 0,
  efficiency: 0,
  earnings: 0,
  aet: 0,
}

function program(jobs: JobScheduler) {
  return Effect.gen(function* (_) {
    const currentTask = yield* Effect.tryPromise({
      try: async () => taskStorage.getValue(),
      catch: e => new TaskStopError({
        cause: e,
        message: 'Failed to get current task',
      }),
    })

    const currentSession = yield* Effect.tryPromise({
      try: async () => sessionStorage.getValue(),
      catch: e => new TaskStopError({
        cause: e,
        message: 'Failed to get current session',
      }),
    })

    if (!currentTask.active) return new MsgResponse(false, 'Task not active')
    if (!currentSession.active) return new MsgResponse(false, 'Session not active')

    const updatedSession = yield* _(
      Effect.succeed(create(currentTask.data, (draft) => {
        draft.duration = Date.now() - draft.start
      })),
      Effect.map(task =>
        create(currentSession.data, (draft) => {
          draft.tasks.push(task)
        })),
    )

    yield* Effect.tryPromise({
      try: async () => sessionStorage.setValue({
        active: false,
        data: updatedSession,
      }),
      catch: e => new TaskStopError({
        cause: e,
        message: 'Failed to update session with task',
      }),
    })

    yield* Effect.tryPromise({
      try: async () => taskStorage.setValue({
        active: false,
        data: resettedTask,
      }),
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

    return new MsgResponse(true, 'Task stopped')
  })
}

export async function handleTaskStop(jobs: JobScheduler) {
  return gen(program(jobs))
}
