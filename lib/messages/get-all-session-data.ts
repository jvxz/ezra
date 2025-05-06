import type { Session } from '../storage/sessions'
import { Data, Effect } from 'effect'
import { db } from '../db'
import { sessionStorage } from '../storage/sessions'

class GetAllSessionDataError extends Data.TaggedError('GetAllSessionDataError')<{
  cause?: unknown
  message?: string
}> {}

const program = Effect.gen(function* () {
  const sessions = yield* Effect.tryPromise({
    try: async () => db.sessions.toArray(),
    catch: e => new GetAllSessionDataError({
      cause: JSON.stringify(e),
      message: 'Failed to get sessions from database',
    }),
  })

  const currentSession = yield* Effect.tryPromise({
    try: async () => sessionStorage.getValue(),
    catch: e => new GetAllSessionDataError({
      cause: JSON.stringify(e),
      message: 'Failed to get current session from local storage',
    }),
  })

  if (!currentSession) return sessions

  const res: Session[] = [...sessions, currentSession]

  return res
})

export async function getAllSessionData() {
  return program.pipe(Effect.runPromise)
}
