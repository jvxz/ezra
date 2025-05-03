import type { TaskStartData } from '../../lib/messages'
import type { TaskStopAction } from '../../lib/messages/handle-task-stop'
import { handleGetLiveData } from '@/lib/messages/get-live-data'
import { defineJobScheduler } from '@webext-core/job-scheduler'
import { onMessage } from '../../lib/messages'
import { handleStartSession } from '../../lib/messages/handle-start-session'
import { handleStopSession } from '../../lib/messages/handle-stop-session'
import { handleTaskStart } from '../../lib/messages/handle-task-start'
import { handleTaskStop } from '../../lib/messages/handle-task-stop'
import { handleTaskSubmit } from './actions/handle-task-submit'

const temp: TaskStartData = {
  id: '1',
  description: 'test',
  aet: 100,
}

const tempAction: TaskStopAction = 'submit'

export default defineBackground({
  main: () => {
    const jobs = defineJobScheduler()

    void handleTaskSubmit()

    onMessage('handleStartSession', async () => handleStartSession())
    onMessage('handleStopSession', async () => handleStopSession())
    onMessage('handleTaskStart', async _msg => handleTaskStart(temp, jobs))
    onMessage('handleTaskStop', async () => handleTaskStop(tempAction, jobs))

    onMessage('getLiveData', async msg => handleGetLiveData(msg.data))
  },
})
