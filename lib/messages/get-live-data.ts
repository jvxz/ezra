import { sessionStorage } from '@/lib/storage/sessions'
import { gen } from '@/src/lib/utils'
import { Data, Effect } from 'effect'
import { MsgResponse } from '.'
import { db } from '../db'

class GetLiveDataError extends Data.TaggedError('GetLiveDataError')<{
  cause?: string
  message?: string
}> {}

function program(type: 'sessions' | 'tasks') {
  return Effect.gen(function* (_) {
    const idbSessions = yield* Effect.tryPromise({
      try: async () => db.sessions.toArray(),
      catch: e => new GetLiveDataError({
        cause: JSON.stringify(e),
        message: 'Failed to get sessions from db',
      }),
    })

    const lsSessions = yield* _(Effect.tryPromise({
      try: async () => sessionStorage.getValue(),
      catch: e => new GetLiveDataError({
        cause: JSON.stringify(e),
        message: 'Failed to get sessions from local storage',
      }),
    }))

    if (type === 'sessions') {
      return new MsgResponse(true, 'Live sessions fetched', lsSessions ? [...idbSessions, lsSessions] : idbSessions)
    }

    return new MsgResponse(true, 'Live tasks fetched', {
      tasks: lsSessions?.tasks ?? [],
    })
  })
}

export async function handleGetLiveData(type: 'sessions' | 'tasks') {
  return gen(program(type))
}
