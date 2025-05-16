import type { Context } from '@/entrypoints/background'
import type { Task } from '@/lib/storage/tasks'
import { createTRPCProxyClient } from '@trpc/client'
import { initTRPC } from '@trpc/server'
import { ArkErrors } from 'arktype'
import { chromeLink } from 'trpc-browser/link'
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
  getCurrentSessionData: t.procedure.query(async ({ ctx }) => getCurrentSessionData(ctx.convex, ctx.rate)),
  startSession: t.procedure.mutation(async ({ ctx }) => handleStartSession(ctx.convex)),
  stopSession: t.procedure.mutation(async ({ ctx }) => handleStopSession(ctx.convex)),
  startTask: t.procedure.input(taskStartValidator).mutation(async ({ input, ctx }) => {
    if (input instanceof ArkErrors) {
      throw new TypeError(input.summary)
    }

    return handleTaskStart(input, ctx.jobs, ctx.convex)
  }),
  stopTask: t.procedure.input(taskStopValidator).mutation(async ({ input, ctx }) => {
    if (input instanceof ArkErrors) {
      throw new TypeError(input.summary)
    }

    return handleTaskStop(input.action, ctx.rate, ctx.convex)
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
