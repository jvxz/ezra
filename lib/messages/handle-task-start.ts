import type { Task } from '@/lib/storage/tasks'
import type { JobScheduler } from '@webext-core/job-scheduler'
import type { TaskStartData } from '.'
import { taskDraft, taskStorage } from '@/lib/storage/tasks'
import { gen } from '@/src/lib/utils'
import { Data, Effect } from 'effect'
import { create } from 'mutative'
import { MsgResponse } from '.'
import { statusStorage } from '../storage/status'

class TaskStartError extends Data.TaggedError('TaskStartError')<{
  cause?: unknown
  message?: string
}> {}

function program(data: TaskStartData, jobs: JobScheduler) {
  return Effect.gen(function* () {
    const status = yield* Effect.tryPromise({
      try: async () => statusStorage.getValue(),
      catch: e => new TaskStartError({
        cause: e,
        message: 'Failed to get current task',
      }),
    })

    if (status.task) return new MsgResponse(false, 'Task already active')
    if (!status.session) return new MsgResponse(false, 'Session not active')

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

    return new MsgResponse(true, 'Task started')
  })
}

let currTime = 0

// TODO: prevent constant storage updates
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

      await taskStorage.setValue(create(taskDraft, (draft) => {
        draft.duration = currTime
      }))
    },

  })
}

// let currTime = 0

// async function handleTaskTimer(jobs: JobScheduler) {
//   await jobs.scheduleJob({
//     id: 'task-timer',
//     type: 'interval',
//     duration: 1000,
//     execute: async () => {
//       currTime += 1

//       void browser.action.setBadgeText({
//         text: `${currTime}`,
//       })

//       if (!(currTime % 5)) {
//         const currentTask = await taskStorage.getValue()

//         await taskStorage.setValue(create(currentTask, (draft) => {
//           draft.data.duration = currTime
//         }))
//       }
//     },

//   })
// }

export async function handleTaskStart(data: TaskStartData, jobs: JobScheduler) {
  return gen(program(data, jobs))
}
