import { handleTaskStop } from '@/lib/messages/handle-task-stop'

export function handleTaskRelease() {
  browser.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (details.method === 'POST' && /https:\/\/www.raterhub.com\/evaluation\/rater\/task\/release/.exec(details.url)) {
        // rate is not needed for task release
        void handleTaskStop('release', 0)
      }
    },
    {
      urls: ['*://*.raterhub.com/*'],
    },
    ['requestBody'],
  )
}
