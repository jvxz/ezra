import type { Task } from '@/lib/storage/tasks'
import type { TaskStartData } from '.'
import { taskStorage } from '@/lib/storage/tasks'
import { gen } from '@/src/lib/utils'
import { Data, Effect } from 'effect'
import { MsgResponse } from '.'

class TaskStartError extends Data.TaggedError('TaskStartError')<{
  cause?: unknown
  message?: string
}> {}

function program(data: TaskStartData) {
  return Effect.gen(function* () {
    const currentTask = yield* Effect.tryPromise({
      try: async () => taskStorage.getValue(),
      catch: e => new TaskStartError({
        cause: e,
        message: 'Failed to get current task',
      }),
    })

    if (currentTask.active) {
      return new MsgResponse(false, 'Task already active')
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
      try: async () => taskStorage.setValue({
        active: true,
        data: draft,
      }),
      catch: e => new TaskStartError({
        cause: e,
        message: 'Failed to set task',
      }),
    })

    return new MsgResponse(true, 'Task started')
  })
}

export async function handleTaskStart(data: TaskStartData) {
  return gen(program(data))
}
