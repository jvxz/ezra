import type { Session } from '@/lib/storage/sessions'
import type { ConvexClient } from 'convex/browser'
import { api } from '@/convex/_generated/api'
import { Data, Effect } from 'effect'
import { create } from 'mutative'
import { statusStorage } from '../storage/status'

class StartSessionError extends Data.TaggedError('StartSessionError')<{
  cause?: string
  message?: string
}> {}

function program(convex: ConvexClient) {
  return Effect.gen(function* () {
    const status = yield* Effect.tryPromise({
      try: async () => statusStorage.getValue(),
      catch: e => new StartSessionError({
        cause: JSON.stringify(e),
        message: 'Failed to get status storage',
      }),
    })

    if (status.session) {
      throw new StartSessionError({
        message: 'Session already active',
      })
    }

    yield* Effect.tryPromise({
      try: async () => statusStorage.setValue(create(status, (draft) => {
        draft.session = true
      })),
      catch: e => new StartSessionError({
        cause: JSON.stringify(e),
        message: 'Failed to set status storage',
      }),
    })

    const draft: Session = {
      id: crypto.randomUUID(),
      description: '0 tasks',
      start: Date.now(),
      end: 'Active',
    }

    yield* Effect.log('Starting session')

    yield* Effect.tryPromise({
      try: async () => convex.mutation(api.sessions.create, draft),
      catch: e => new StartSessionError({
        cause: JSON.stringify(e),
        message: 'Failed to start session',
      }),
    })

    return draft
  })
}

export async function handleStartSession(convex: ConvexClient) {
  return program(convex).pipe(Effect.runPromise)
}
