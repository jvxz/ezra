import { defineExtensionMessaging } from '@webext-core/messaging'

export class MsgResponse<T = unknown> {
  constructor(public readonly success: boolean, public readonly message: string, public readonly data?: T) {}
}
interface ProtocolMap {
  handleStartSession: () => Promise<MsgResponse>
  handleStopSession: () => Promise<MsgResponse>
}

// eslint-disable-next-line ts/unbound-method
export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>()

