import { handleTaskStop } from '@/lib/messages/handle-task-stop'
import { usePrefsStore } from '@/lib/store/prefs'

const RGX = /https:\/\/www.raterhub.com\/evaluation\/rater\/task\/commit/

export function handleTaskSubmit() {
  // browser.webRequest.onBeforeRequest.addListener(
  //   (details) => {
  //     if (details.method === 'GET' && details.url.includes('example')) {
  //       const rate = usePrefs.getState().rate
  //       console.log('rate', rate);

  //       void handleTaskStop('submit', rate)
  //     }
  //   },
  //   {
  //     urls: ['*://example.com/*'],
  //   },
  //   // ['requestBody'],
  // )
  browser.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (details.method === 'POST' && RGX.exec(details.url)) {
        const rate = usePrefsStore.getState().rate

        void handleTaskStop('submit', rate)
      }
    },
    {
      urls: ['*://*.raterhub.com/*'],
    },
    ['requestBody'],
  )
}
