import type { Session } from '@/lib/storage/sessions'
import { sessionStorage } from '@/lib/storage/sessions'
import { gen } from '@/src/lib/utils'
import { Data, Effect } from 'effect'
import { create } from 'mutative'
import { MsgResponse } from '.'
import { statusStorage } from '../storage/status'

class StartSessionError extends Data.TaggedError('StartSessionError')<{
  cause?: string
  message?: string
}> {}

const program = Effect.gen(function* () {
  const status = yield* Effect.tryPromise({
    try: async () => statusStorage.getValue(),
    catch: e => new StartSessionError({
      cause: JSON.stringify(e),
      message: 'Failed to get status storage',
    }),
  })

  if (status.session) return new MsgResponse(false, 'Session already active')

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
    duration: 0,
    earnings: 0,
    efficiency: 0,
    tasks: [],
  }

  yield* Effect.tryPromise({
    try: async () => sessionStorage.setValue(draft),
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
