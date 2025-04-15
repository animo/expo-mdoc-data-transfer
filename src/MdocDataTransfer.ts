import {
  MdocDataTransferEvent,
  type OnRequestReceivedEventPayload,
  type OnResponseSendPayload,
} from './MdocDataTransferEvent'
import { mDocNativeModule, mDocNativeModuleEventEmitter } from './MdocDataTransferModule'

export let instance: MdocDataTransfer | undefined = undefined
export const mdocDataTransfer = {
  instance: async (serviceName: string, trustedCertificates: Array<string> = []) => {
    if (instance) return instance
    const i = await MdocDataTransfer.initialize(serviceName, trustedCertificates)
    return i
  },
}

class MdocDataTransfer {
  public isNfcEnabled = false

  public static async initialize(serviceName: string, trustedCertificates: Array<string> = []) {
    await mDocNativeModule.initialize(serviceName, trustedCertificates)
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
    mDocNativeModule.shutdown()
    instance = undefined
  }

  public enableNfc() {
    if (this.isNfcEnabled) return
    mDocNativeModule.enableNfc()
    this.isNfcEnabled = true
  }
}
