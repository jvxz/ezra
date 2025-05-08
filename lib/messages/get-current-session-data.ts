import { sessionStorage } from '@/lib/storage/sessions'
import { taskStorage } from '@/lib/storage/tasks'
import { calcEfficiency } from '@/lib/utils'
import { Data, Effect } from 'effect'

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

  if (!currentSession) return null

  const currentTask = yield* _(Effect.tryPromise({
    try: async () => taskStorage.getValue(),
    catch: e => new GetLiveDataError({
      cause: JSON.stringify(e),
      message: 'Failed to get tasks from local storage',
    }),
  }), Effect.map(t => t ?? {
    id: '',
    description: '',
    aet: 0,
    start: 0,
    duration: 0,
    efficiency: 0,
    earnings: 0,
  }))

  const dur = currentTask.duration + currentSession.duration
  const aet = currentTask.aet + currentSession.tasks.reduce((a, c) => a + c.aet, 0)
  const eff = calcEfficiency(dur, aet)
  const earn = currentTask.earnings + currentSession.earnings

  const data = {
    duration: dur,
    efficiency: eff,
    earnings: earn,
    taskCount: currentSession.tasks.length,
    isActive: currentSession.end === 'Active',
  }

  // const allSessions = yield* _(Effect.tryPromise({
  //   try: async () => db.sessions.toArray(),
  //   catch: e => new GetLiveDataError({
  //     cause: JSON.stringify(e),
  //     message: 'Failed to get sessions from db',
  //   }),
  // }), Effect.map((s) => {
  //   const dur = s.reduce((acc, curr) => acc + curr.duration, 0)
  //   const eff = s.reduce((acc, curr) => acc + curr.efficiency, 0) / s.length
  //   const earn = s.reduce((acc, curr) => acc + curr.earnings, 0)

  //   if (!currentSession) {
  //     return {
  //       duration: dur,
  //       efficiency: eff,
  //       earnings: earn,
  //       taskCount: s.length,
  //       isActive: false,
  //     }
  //   }

  //   return {
  //     duration: dur + currentSession.duration,
  //     efficiency: eff + currentSession.efficiency,
  //     earnings: earn + currentSession.earnings,
  //     taskCount: s.length + currentSession.tasks.length,
  //     isActive: true,
  //   }
  // }))

  return data
})

export async function getCurrentSessionData() {
  return program.pipe(Effect.runPromise)
}
