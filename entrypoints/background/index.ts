import { appRouter } from '@/lib/messages/trpc'
import { useStatusStore } from '@/lib/store/status'
import { defineJobScheduler } from '@webext-core/job-scheduler'
import { createChromeHandler } from 'trpc-browser/adapter'
import { handleTaskRelease } from './actions/handle-task-release'
import { handleTaskSubmit } from './actions/handle-task-submit'

function createContext() {
  return {
    jobs: defineJobScheduler(),
  }
}

export type Context = ReturnType<typeof createContext>

export default defineBackground({
  main: () => {
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
