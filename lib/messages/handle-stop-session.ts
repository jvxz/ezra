import { db } from '@/lib/db'
import { sessionStorage } from '@/lib/storage/sessions'
import { Data, Effect } from 'effect'
import { create } from 'mutative'
import { statusStorage } from '../storage/status'

class StopSessionError extends Data.TaggedError('StopSessionError')<{
  cause?: unknown
  message?: string
}> {}

const program = Effect.gen(function* (_) {
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

  const currentSession = yield* _(Effect.tryPromise({
    try: async () => sessionStorage.getValue(),
    catch: e => new StopSessionError({
      cause: e,
      message: 'Failed to get session storage',
    }),
  }), Effect.map((s) => {
    if (!s) return null
    s.end = Date.now()
    return s
  }))

  if (!currentSession) {
    return new StopSessionError({
      message: 'Could not get current session',
    })
  }

  yield* Effect.tryPromise({
    try: async () => db.sessions.add(currentSession),
    catch: e => new StopSessionError({
      cause: e,
      message: 'Failed to add session to DB. Session was not stopped',
    }),
  })

  yield* Effect.tryPromise({
    try: async () => sessionStorage.removeValue(),
    catch: e => new StopSessionError({
      cause: e,
      message: 'Failed to stop session',
    }),
  })

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

export async function handleStopSession() {
  return program.pipe(Effect.runPromise)
}
