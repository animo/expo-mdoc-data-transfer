export enum MdocDataTransferEvent {
  OnRequestReceived = 'onRequestReceived',
  OnResponseSent = 'onResponseSent',
}

export type OnResponseSendPayload = null

export type OnRequestReceivedEventPayload<T = string> = {
  deviceRequest: T
  sessionTranscript: T
}
