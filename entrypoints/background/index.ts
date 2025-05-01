import { handleTaskSubmit } from './actions/handle-task-submit'
import { onMessage } from './messages'
import { handleStartSession } from './messages/handle-start-session'
import { handleStopSession } from './messages/handle-stop-session'

export default defineBackground({
  main: () => {
    // const jobs = defineJobScheduler()

    void handleTaskSubmit()

    onMessage('handleStartSession', async () => handleStartSession())
    onMessage('handleStopSession', async () => handleStopSession())
  },
})
