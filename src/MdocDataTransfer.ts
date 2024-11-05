import {
  MdocDataTransferEvent,
  type OnRequestReceivedEventPayload,
  type OnResponseSendPayload,
} from './MdocDataTransferEvent'
import { mDocNativeModule, mDocNativeModuleEventEmitter } from './MdocDataTransferModule'

let instance: MdocDataTransfer | undefined = undefined
export const mdocDataTransfer = {
  instance: () => {
    if (instance) return instance
    return MdocDataTransfer.initialize()
  },
}

class MdocDataTransfer {
  public static initialize() {
    mDocNativeModule.initialize()
    instance = new MdocDataTransfer()
    return instance
  }

  public async startQrEngagement() {
    return await mDocNativeModule.startQrEngagement()
  }

  private onDeviceRequest(cb: (payload: OnRequestReceivedEventPayload<Uint8Array>) => Promise<void> | void) {
    return mDocNativeModuleEventEmitter.addListener<OnRequestReceivedEventPayload>(
      MdocDataTransferEvent.OnRequestReceived,
      (payload) =>
        cb({
          deviceRequest: new Uint8Array(payload.deviceRequest),
          sessionTranscript: new Uint8Array(payload.sessionTranscript),
        })
    )
  }

  private onResponseSent(cb: (payload: OnResponseSendPayload) => Promise<void> | void) {
    return mDocNativeModuleEventEmitter.addListener<OnResponseSendPayload>(MdocDataTransferEvent.OnRequestReceived, cb)
  }

  public async waitForDeviceRequest() {
    return await new Promise<OnRequestReceivedEventPayload<Uint8Array>>(this.onDeviceRequest)
  }

  public async sendDeviceResponse(deviceResponse: Uint8Array) {
    const p = new Promise(this.onResponseSent)
    mDocNativeModule.sendDeviceResponse(deviceResponse.join(':'))
    await p
  }

  public async shutdown() {
    mDocNativeModule.shutdown()
    instance = undefined
  }
}
