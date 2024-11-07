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

  public async waitForDeviceRequest() {
    return await new Promise<OnRequestReceivedEventPayload<Uint8Array>>((resolve) =>
      mDocNativeModuleEventEmitter.addListener<OnRequestReceivedEventPayload>(
        MdocDataTransferEvent.OnRequestReceived,
        (payload) =>
          resolve({
            deviceRequest: new Uint8Array(payload.deviceRequest),
            sessionTranscript: new Uint8Array(payload.sessionTranscript),
          })
      )
    )
  }

  public async sendDeviceResponse(deviceResponse: Uint8Array) {
    const p = new Promise((resolve) =>
      mDocNativeModuleEventEmitter.addListener<OnResponseSendPayload>(MdocDataTransferEvent.OnResponseSent, resolve)
    )
    mDocNativeModule.sendDeviceResponse(deviceResponse.join(':'))
    await p
  }

  public async shutdown() {
    mDocNativeModule.shutdown()
    instance = undefined
  }
}
