import type { TaskStartData } from './messages'
import { defineJobScheduler } from '@webext-core/job-scheduler'
import { handleTaskSubmit } from './actions/handle-task-submit'
import { onMessage } from './messages'
import { handleStartSession } from './messages/handle-start-session'
import { handleStopSession } from './messages/handle-stop-session'
import { handleTaskStart } from './messages/handle-task-start'
import { handleTaskStop } from './messages/handle-task-stop'

const temp: TaskStartData = {
  id: '1',
  description: 'test',
  aet: 100,
}

export default defineBackground({
  main: () => {
    const jobs = defineJobScheduler()

    void handleTaskSubmit()

    onMessage('handleStartSession', async () => handleStartSession())
    onMessage('handleStopSession', async () => handleStopSession())
    onMessage('handleTaskStart', async _msg => handleTaskStart(temp, jobs))
    onMessage('handleTaskStop', async () => handleTaskStop(jobs))
  },
})
