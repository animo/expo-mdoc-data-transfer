export enum MdocDataTransferEvent {
  OnRequestReceived = 'onRequestReceived',
  OnResponseSent = 'onResponseSent',
}

export type OnResponseSendPayload = null

export type OnRequestReceivedEventPayload<T = Array<number>> = {
  deviceRequest: T
  sessionTranscript: T
}
