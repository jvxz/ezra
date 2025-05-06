import { sessionStorage } from '@/lib/storage/sessions'
import { Data, Effect } from 'effect'
import { db } from '../db'

class GetLiveDataError extends Data.TaggedError('GetLiveDataError')<{
  cause?: string
  message?: string
}> {}

const program = Effect.gen(function* (_) {
  const currentSession = yield* Effect.tryPromise({
    try: async () => sessionStorage.getValue(),
    catch: e => new GetLiveDataError({
      cause: JSON.stringify(e),
      message: 'Failed to get sessions from local storage',
    }),
  })

  const allSessions = yield* _(Effect.tryPromise({
    try: async () => db.sessions.toArray(),
    catch: e => new GetLiveDataError({
      cause: JSON.stringify(e),
      message: 'Failed to get sessions from db',
    }),
  }), Effect.map((s) => {
    const dur = s.reduce((acc, curr) => acc + curr.duration, 0)
    const eff = s.reduce((acc, curr) => acc + curr.efficiency, 0) / s.length
    const earn = s.reduce((acc, curr) => acc + curr.earnings, 0)

    if (!currentSession) {
      return {
        duration: dur,
        efficiency: eff,
        earnings: earn,
        taskCount: s.length,
        isActive: false,
      }
    }

    return {
      duration: dur + currentSession.duration,
      efficiency: eff + currentSession.efficiency,
      earnings: earn + currentSession.earnings,
      taskCount: s.length + currentSession.tasks.length,
      isActive: true,
    }
  }))

  return allSessions
})

export async function handleGetLiveData() {
  return program.pipe(Effect.runPromise)
}
