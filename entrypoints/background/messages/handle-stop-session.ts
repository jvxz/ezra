import type { Session } from '@/lib/storage/sessions'
import { db } from '@/lib/db'
import { sessionStorage } from '@/lib/storage/sessions'
import { Data, Effect } from 'effect'
import { MsgResponse } from '.'

class StopSessionError extends Data.TaggedError('StopSessionError')<{
  cause?: unknown
  message?: string
}> {}

const program = Effect.gen(function* () {
  const currentSession = yield* Effect.tryPromise({
    try: async () => sessionStorage.getValue(),
    catch: e => new StopSessionError({
      cause: e,
      message: 'Failed to get session storage',
    }),
  })

  if (!currentSession.active) {
    return new MsgResponse(false, 'Session not active')
  }

  const draft: Session = {
    description: 'No tasks',
    duration: 0,
    earnings: 0,
    efficiency: 0,
    end: 0,
    id: '',
    start: 0,
    tasks: [],
  }

  yield* Effect.tryPromise({
    try: async () => db.sessions.add(currentSession.data),
    catch: e => new StopSessionError({
      cause: e,
      message: 'Failed to add session to DB. Session was not stopped',
    }),
  })

  yield* Effect.tryPromise({
    try: async () => sessionStorage.setValue({
      active: false,
      data: draft,
    }),
    catch: e => new StopSessionError({
      cause: e,
      message: 'Failed to stop session',
    }),
  })

  return new MsgResponse(true, 'Session stopped')
})

export async function handleStopSession() {
  return program
    .pipe(Effect.catchTags({
      StopSessionError: e => Effect.succeed(new MsgResponse(false, `${e.message}: ${String(e.cause)}`)),
    }))
    .pipe(Effect.runPromise)
}
