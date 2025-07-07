export enum MdocDataTransferEvent {
  OnRequestReceived = 'onRequestReceived',
  OnResponseSent = 'onResponseSent',
  OnError = 'onError',
}

export type OnResponseSendPayload = null

export type OnRequestReceivedEventPayload<T = string> = {
  deviceRequest: T
  sessionTranscript: T
}

export type OnErrorPayload = {
  error: string
}
