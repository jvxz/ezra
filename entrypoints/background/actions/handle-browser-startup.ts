import { handleStopSession } from '@/lib/messages/handle-stop-session'
import { sessionStorage } from '@/lib/storage/sessions'
import { statusStorage } from '@/lib/storage/status'
import { taskStorage } from '@/lib/storage/tasks'
import { create } from 'mutative'
import { handleTaskRelease } from './handle-task-release'

export async function handleBrowserStartup() {
  browser.runtime.onStartup.addListener(() => {
    void main()
  })
}

async function main() {
  const status = await statusStorage.getValue()

  const task = await taskStorage.getValue()

  const session = await sessionStorage.getValue()

  if (task) {
    handleTaskRelease()
    await statusStorage.setValue(create(status, (draft) => {
      draft.task = false
    }))
  }

  if (session) {
    await handleStopSession()
    await statusStorage.setValue(create(status, (draft) => {
      draft.session = false
    }))
  }
}
