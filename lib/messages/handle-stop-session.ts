import type { Session } from '@/lib/storage/sessions'
import { db } from '@/lib/db'
import { sessionStorage } from '@/lib/storage/sessions'
import { gen } from '@/src/lib/utils'
import { Data, Effect } from 'effect'
import { MsgResponse } from '.'

class StopSessionError extends Data.TaggedError('StopSessionError')<{
  cause?: unknown
  message?: string
}> {}

const program = Effect.gen(function* (_) {
  const currentSession = yield* _(Effect.tryPromise({
    try: async () => sessionStorage.getValue(),
    catch: e => new StopSessionError({
      cause: e,
      message: 'Failed to get session storage',
    }),
  }), Effect.map((s) => {
    s.data.end = Date.now()
    s.data.duration = s.data.end - s.data.start
    s.data.earnings = s.data.duration * 100
    s.data.efficiency = s.data.earnings / s.data.duration
    return s
  }))

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
  return gen(program)
}
