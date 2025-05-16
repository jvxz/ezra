import { env } from '@/env'
import { appRouter } from '@/lib/messages/trpc'
import { usePrefsStore } from '@/lib/store/prefs'
import { useStatusStore } from '@/lib/store/status'
import { defineJobScheduler } from '@webext-core/job-scheduler'
import { ConvexClient } from 'convex/browser'
import { createChromeHandler } from 'trpc-browser/adapter'
import { handleBrowserStartup } from './actions/handle-browser-startup'
import { handleTaskRelease } from './actions/handle-task-release'
import { handleTaskSubmit } from './actions/handle-task-submit'

function createContext() {
  const { rate } = usePrefsStore.getState()

  return {
    jobs: defineJobScheduler(),
    convex: new ConvexClient(env.VITE_CONVEX_URL),
    rate,
  }
}

export type Context = ReturnType<typeof createContext>

export default defineBackground({
  main: () => {
    void handleBrowserStartup()

    void handleTaskSubmit()
    void handleTaskRelease()

    createChromeHandler({
      router: appRouter,
      createContext,
      onError: ({ error }) => {
        browser.notifications.create({
          type: 'basic',
          iconUrl: 'icon.png',
          title: 'Error',
          message: error.message,
        })

        useStatusStore.getState().setStatus({
          message: error.message,
          timestamp: Date.now(),
          type: 'error',
        })
      },
    })
  },
})
