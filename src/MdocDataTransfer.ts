import {
  MdocDataTransferEvent,
  type OnRequestReceivedEventPayload,
  type OnResponseSendPayload,
} from './MdocDataTransferEvent'
import { mDocNativeModule, mDocNativeModuleEventEmitter } from './MdocDataTransferModule'

export let instance: MdocDataTransfer | undefined = undefined
export const mdocDataTransfer = {
  instance: (serviceName: string) => {
    if (instance) return instance
    return MdocDataTransfer.initialize(serviceName)
  },
}

class MdocDataTransfer {
  public isNfcEnabled = false

  public static initialize(serviceName: string) {
    const error = mDocNativeModule.initialize(serviceName)

    if (typeof error === 'string' && error.length > 0) {
      throw new Error(error)
    }

    instance = new MdocDataTransfer()
    return instance
  }

  public async startQrEngagement() {
    return await mDocNativeModule.startQrEngagement()
  }

  public async waitForDeviceRequest() {
    return await new Promise<OnRequestReceivedEventPayload<Uint8Array>>((resolve) =>
      mDocNativeModuleEventEmitter.addListener(
        MdocDataTransferEvent.OnRequestReceived,
        (payload: OnRequestReceivedEventPayload) => {
          resolve({
            deviceRequest: new Uint8Array(payload.deviceRequest),
            sessionTranscript: new Uint8Array(payload.sessionTranscript),
          })
        }
      )
    )
  }

  public async sendDeviceResponse(deviceResponse: Uint8Array) {
    const p = new Promise<OnResponseSendPayload>((resolve) =>
      mDocNativeModuleEventEmitter.addListener(MdocDataTransferEvent.OnResponseSent, resolve)
    )

    mDocNativeModule.sendDeviceResponse(deviceResponse.join(':'))

    await p
  }

  public shutdown() {
    this.isNfcEnabled = false
    const error = mDocNativeModule.shutdown()

    if (typeof error === 'string' && error.length > 0) {
      throw new Error(error)
    }

    instance = undefined
  }

  public enableNfc() {
    if (this.isNfcEnabled) return
    mDocNativeModule.enableNfc()
    this.isNfcEnabled = true
  }
}
