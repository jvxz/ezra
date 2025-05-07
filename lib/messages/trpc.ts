import type { Context } from '@/entrypoints/background'
import type { Task } from '@/lib/storage/tasks'
import { createTRPCProxyClient } from '@trpc/client'
import { initTRPC } from '@trpc/server'
import { ArkErrors } from 'arktype'
import { chromeLink } from 'trpc-browser/link'
import { getAllSessionData } from './get-all-session-data'
import { getCurrentSessionData } from './get-current-session-data'
import { handleStartSession } from './handle-start-session'
import { handleStopSession } from './handle-stop-session'
import { handleTaskStart, taskStartValidator } from './handle-task-start'
import { handleTaskStop, taskStopValidator } from './handle-task-stop'

export type TaskStartData = Pick<Task, 'description' | 'aet' | 'id'>

const t = initTRPC.context<Context>().create({
  isServer: false,
  allowOutsideOfServer: true,
})

export const appRouter = t.router({
  getCurrentSessionData: t.procedure.query(async () => getCurrentSessionData()),
  getAllSessionData: t.procedure.query(async () => getAllSessionData()),
  startSession: t.procedure.query(async () => handleStartSession()),
  stopSession: t.procedure.query(async () => handleStopSession()),
  startTask: t.procedure.input(taskStartValidator).mutation(async ({ input, ctx }) => {
    if (input instanceof ArkErrors) {
      throw new TypeError(input.summary)
    }

    return handleTaskStart(input, ctx.jobs)
  }),
  stopTask: t.procedure.input(taskStopValidator).mutation(async ({ input }) => {
    if (input instanceof ArkErrors) {
      throw new TypeError(input.summary)
    }

    return handleTaskStop(input.action, input.rate)
  }),
  test: t.procedure.query(async () => {
    return 'attempting to connect...'
  }),
})

export type AppRouter = typeof appRouter

export function createTrpc() {
  const port = browser.runtime.connect()
  return createTRPCProxyClient<AppRouter>({
    links: [chromeLink({
      port,
    })],
  })
}
