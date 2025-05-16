import { env } from '@/env'
import { handleTaskStop } from '@/lib/messages/handle-task-stop'
import { ConvexClient } from 'convex/browser'

const convex = new ConvexClient(env.VITE_CONVEX_URL)

export function handleTaskRelease() {
  browser.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (details.method === 'POST' && /https:\/\/www.raterhub.com\/evaluation\/rater\/task\/release/.exec(details.url)) {
        // rate is not needed for task release
        void handleTaskStop('release', 0, convex)
      }
    },
    {
      urls: ['*://*.raterhub.com/*'],
    },
    ['requestBody'],
  )
}
