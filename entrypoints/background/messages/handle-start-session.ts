import type { Session } from '@/lib/storage/sessions'
import { sessionStorage } from '@/lib/storage/sessions'
import { gen } from '@/src/lib/utils'
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
    id: crypto.randomUUID(),
    description: 'No tasks',
    start: Date.now(),
    end: 0,
    duration: 0,
    earnings: 0,
    efficiency: 0,
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
  return gen(program)
}
