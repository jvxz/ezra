import { createTrpc } from '@/lib/messages/trpc'
import { statusStorage } from '@/lib/storage/status'
import { create } from 'mutative'
import { handleTaskRelease } from './handle-task-release'

export async function handleBrowserStartup() {
  browser.runtime.onStartup.addListener(() => {
    void main()
  })
}

// TODO: allow recovery
async function main() {
  const trpc = createTrpc()

  const status = await statusStorage.getValue()

  if (status.task) {
    handleTaskRelease()
    await statusStorage.setValue(create(status, (draft) => {
      draft.task = false
    }))

    await trpc.stopTask.mutate({
      action: 'release',
    })
  }

  if (status.session) {
    await trpc.stopSession.mutate()

    await statusStorage.setValue(create(status, (draft) => {
      draft.session = false
    }))
  }
}
