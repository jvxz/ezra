import type { Task } from '@/lib/storage/tasks'
import { createTrpc } from '@/lib/messages/trpc'
import { statusStorage } from '@/lib/storage/status'
import { Data, Effect } from 'effect'

const trpc = createTrpc()

const TASK_ID_REGEX = /taskIdList":\s*\["(\d+)"\]/
const AET_REGEX = /"estimatedTaskTime":\s*([\d.]+)/

class TaskStartError extends Data.TaggedError('TaskStartError')<{
  cause?: unknown
  message?: string
}> {}

export default defineContentScript({
  matches: ['https://www.raterhub.com/evaluation/rater/task/show?*'],
  // matches: ['*://*.example.com/*'],
  main() {
    const program = Effect.gen(function* (_) {
      console.warn('Starting task detection process')

      const status = yield* Effect.tryPromise({
        try: async () => statusStorage.getValue(),
        catch: e => new TaskStartError({
          cause: e,
          message: 'Failed to get current session',
        }),
      })
      console.warn('Current status retrieved:', status)

      if (status.task) {
        console.warn('Task already started, aborting')
        throw new TaskStartError({
          message: 'Task already started',
        })
      }

      if (!status.session) {
        console.warn('No active session found, aborting')
        return
      }

      console.warn('Active session found, proceeding with task detection')
      const dom = document.documentElement.outerHTML
      console.warn('DOM captured for parsing')

      const aet = yield* _(
        Effect.fromNullable(AET_REGEX.exec(dom)),
        Effect.map(aetMatch => Number.parseFloat(aetMatch[1])),
        Effect.orElseFail(() => new TaskStartError({
          message: 'AET not found',
        })),
      )
      console.warn('AET extracted:', aet)

      const taskId = yield* _(
        Effect.fromNullable(TASK_ID_REGEX.exec(dom)),
        Effect.map(match => match[1] ? match[1] : 'UNKNOWN'),
      )
      console.warn('Task ID extracted:', taskId)

      const description = yield* _(
        Effect.fromNullable(document.querySelector('.ewok-task-action-header')),
        Effect.map(ele => ele.children[1].textContent ?? ele.children[0].textContent ?? 'UNKNOWN'),
      )
      console.warn('Task description extracted:', description)

      const taskDraft: Task = {
        id: taskId,
        description,
        aet,
        start: Date.now(),
        duration: 0,
        earnings: 0,
        efficiency: 0,
      }
      console.warn('Task draft created:', taskDraft)

      yield* Effect.tryPromise({
        try: async () => trpc.startTask.mutate(taskDraft),
        catch: e => new TaskStartError({
          cause: e,
          message: 'Failed to start task',
        }),
      })
      console.warn('Task successfully started')
      return true
    })

    void program
      .pipe(Effect.catchAll((e) => {
        console.error('Task start error:', e)
        return Effect.succeed(false)
      }))
      .pipe(Effect.runPromise)

    trpc.test.query().then(result => console.warn('TRPC test result:', result)).catch(err => console.error('TRPC test error:', err))
  },
})
