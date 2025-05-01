import type { Session } from '@/lib/storage/sessions'
import { sessionStorage } from '@/lib/storage/sessions'
import { Data, Effect } from 'effect'
import { MsgResponse } from '.'

class StartSessionError extends Data.TaggedError('StartSessionError')<{
  cause?: string
  message?: string
}> {}

const program = Effect.gen(function* () {
  const currentSession = yield* Effect.tryPromise({
    try: async () => sessionStorage.getValue(),
    catch: e => new StartSessionError({
      cause: JSON.stringify(e),
      message: 'Failed to get session storage',
    }),
  })

  if (currentSession.active) {
    return new MsgResponse(false, 'Session already active')
  }

  const draft: Session = {
    description: 'No tasks',
    duration: 0,
    earnings: 0,
    efficiency: 0,
    end: 0,
    id: crypto.randomUUID(),
    start: 0,
    tasks: [],
  }

  yield* Effect.tryPromise({
    try: async () => sessionStorage.setValue({
      active: true,
      data: draft,
    }),
    catch: e => new StartSessionError({
      cause: JSON.stringify(e),
      message: 'Failed to start session',
    }),
  })

  return new MsgResponse(true, 'Session started')
})

export async function handleStartSession() {
  return program
    .pipe(Effect.catchTags({
      StartSessionError: e => Effect.succeed(new MsgResponse(false, `${e.message}: ${e.cause}`)),
    }))
    .pipe(Effect.runPromise)
}
