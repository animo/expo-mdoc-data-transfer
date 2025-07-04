import { Buffer } from 'buffer'
import {
  MdocDataTransferEvent,
  type OnRequestReceivedEventPayload,
  type OnResponseSendPayload,
} from './MdocDataTransferEvent'
import { mDocNativeModule } from './MdocDataTransferModule'

export let instance: MdocDataTransfer | undefined = undefined
export const mdocDataTransfer = {
  instance: async (serviceName: string) => {
    if (instance) return instance
    return await MdocDataTransfer.initialize(serviceName)
  },
}

class MdocDataTransfer {
  public isNfcEnabled = false

  public static async initialize(serviceName: string) {
    await mDocNativeModule.nativeModule.initialize(serviceName)
    instance = new MdocDataTransfer()
    return instance
  }

  public async startQrEngagement() {
    return await mDocNativeModule.nativeModule.startQrEngagement()
  }

  public async waitForDeviceRequest() {
    return await new Promise<OnRequestReceivedEventPayload<Uint8Array>>((resolve) =>
      mDocNativeModule.eventEmitter.addListener(
        MdocDataTransferEvent.OnRequestReceived,
        (payload: OnRequestReceivedEventPayload) => {
          resolve({
            deviceRequest: new Uint8Array(Buffer.from(payload.deviceRequest, 'base64')),
            sessionTranscript: new Uint8Array(Buffer.from(payload.sessionTranscript, 'base64')),
          })
        }
      )
    )
  }

  public async sendDeviceResponse(deviceResponse: Uint8Array) {
    const p = new Promise<OnResponseSendPayload>((resolve) =>
      mDocNativeModule.eventEmitter.addListener(MdocDataTransferEvent.OnResponseSent, resolve)
    )

    mDocNativeModule.nativeModule.sendDeviceResponse(Buffer.from(deviceResponse).toString('base64'))

    await p
  }

  public shutdown() {
    this.isNfcEnabled = false
    mDocNativeModule.nativeModule.shutdown()
    instance = undefined
  }

  public enableNfc() {
    if (this.isNfcEnabled) return
    mDocNativeModule.nativeModule.enableNfc()
    this.isNfcEnabled = true
  }
}
