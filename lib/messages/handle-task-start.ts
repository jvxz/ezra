import type { Task } from '@/lib/storage/tasks'
import type { JobScheduler } from '@webext-core/job-scheduler'
import type { TaskStartData } from '.'
import { taskStorage } from '@/lib/storage/tasks'
import { gen } from '@/src/lib/utils'
import { Data, Effect } from 'effect'
import { create } from 'mutative'
import { MsgResponse } from '.'

class TaskStartError extends Data.TaggedError('TaskStartError')<{
  cause?: unknown
  message?: string
}> {}

function program(data: TaskStartData, jobs: JobScheduler) {
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

    yield* Effect.tryPromise({
      try: async () => handleTaskTimer(jobs),
      catch: e => new TaskStartError({
        cause: e,
        message: 'Failed to start task timer',
      }),
    })

    return new MsgResponse(true, 'Task started')
  })
}

let currTime = 0

async function handleTaskTimer(jobs: JobScheduler) {
  await jobs.scheduleJob({
    id: 'task-timer',
    type: 'interval',
    duration: 1000,
    execute: async () => {
      currTime += 1

      void browser.action.setBadgeText({
        text: `${currTime}`,
      })

      if (!(currTime % 5)) {
        const currentTask = await taskStorage.getValue()

        await taskStorage.setValue(create(currentTask, (draft) => {
          draft.data.duration = currTime
        }))
      }
    },

  })
}

export async function handleTaskStart(data: TaskStartData, jobs: JobScheduler) {
  return gen(program(data, jobs))
}
