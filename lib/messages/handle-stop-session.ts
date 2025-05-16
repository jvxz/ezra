import type { ConvexClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { Data, Effect } from 'effect'
import { create } from 'mutative'
import { statusStorage } from '../storage/status'

class StopSessionError extends Data.TaggedError('StopSessionError')<{
  cause?: unknown
  message?: string
}> {}

function program(convex: ConvexClient) {
  return Effect.gen(function* (_) {
    const status = yield* _(Effect.tryPromise({
      try: async () => statusStorage.getValue(),
      catch: e => new StopSessionError({
        cause: e,
        message: 'Failed to get status storage',
      }),
    }))

    if (!status.session) {
      throw new StopSessionError({
        message: 'Session not active',
      })
    }

    // stop session
    yield* _(Effect.tryPromise({
      try: async () => convex.mutation(api.sessions.endCurrentSession, {
      }),
      catch: e => new StopSessionError({
        cause: e,
        message: 'Failed to get session storage',
      }),
    }))

    yield* Effect.tryPromise({
      try: async () => statusStorage.setValue(create(status, (draft) => {
        draft.session = false
      })),
      catch: e => new StopSessionError({
        cause: JSON.stringify(e),
        message: 'Failed to set status storage',
      }),
    })

    return true
  })
}

export async function handleStopSession(convex: ConvexClient) {
  return program(convex).pipe(Effect.runPromise)
}
