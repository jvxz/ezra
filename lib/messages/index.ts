import type { Task } from '@/lib/storage/tasks'
import { defineExtensionMessaging } from '@webext-core/messaging'

export class MsgResponse<T = unknown> {
  constructor(public readonly success: boolean, public readonly message: string, public readonly data?: T) {}
}

export type TaskStartData = Pick<Task, 'description' | 'aet' | 'id'>

interface ProtocolMap {
  handleStartSession: () => Promise<MsgResponse>
  handleStopSession: () => Promise<MsgResponse>
  handleTaskStart: (data: TaskStartData) => Promise<MsgResponse>
  handleTaskStop: () => Promise<MsgResponse>
}

// eslint-disable-next-line ts/unbound-method
export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>()

