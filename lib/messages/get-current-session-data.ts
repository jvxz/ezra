import type { ConvexClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { calcTaskTotals } from '@/lib/utils'
import { Data, Effect } from 'effect'

class GetLiveDataError extends Data.TaggedError('GetLiveDataError')<{
  cause?: string
  message?: string
}> {}

function program(convex: ConvexClient, rate: number) {
  return Effect.gen(function* (_) {
    const currentSession = yield* Effect.tryPromise({
      try: async () => convex.query(api.sessions.pickCurrentSessionWithTasks, {
      }),
      catch: e => new GetLiveDataError({
        cause: JSON.stringify(e),
        message: 'Failed to get sessions from local storage',
      }),
    })

    if (!currentSession.session) return null

    const currentTask = yield* Effect.tryPromise({
      try: async () => convex.query(api.tasks.pickCurrentTask, {
      }),
      catch: e => new GetLiveDataError({
        cause: JSON.stringify(e),
        message: 'Failed to get current task',
      }),
    })

    if (!currentTask) {
      const taskTotals = calcTaskTotals(currentSession.tasks, rate)

      return {
        sessionData: currentSession,
        taskData: taskTotals,
        currentTaskData: null,
      }
    }

    const taskTotals = calcTaskTotals([...currentSession.tasks, currentTask], rate)

    const data = {
      sessionData: currentSession,
      taskData: taskTotals,
      currentTaskData: currentTask,
    }

    return data
  })
}

export async function getCurrentSessionData(convex: ConvexClient, rate: number) {
  return program(convex, rate).pipe(Effect.runPromise)
}
