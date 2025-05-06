import { createTrpc } from '@/lib/messages/trpc'
import { usePrefs } from '@/lib/store/prefs'

const trpc = createTrpc()

export function handleTaskRelease() {
  browser.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (details.method === 'POST' && /https:\/\/www.raterhub.com\/evaluation\/rater\/task\/release/.exec(details.url)) {
        void trpc.stopTask.mutate({
          action: 'release',
          // rate is not needed for task release
          rate: 0,
        })
      }
    },
    {
      urls: ['*://*.raterhub.com/*'],
    },
    ['requestBody'],
  )
}
