import { EventEmitter, requireNativeModule } from 'expo-modules-core'
import type { NativeModule } from 'react-native'

export type MdocNativeModule = {
  initialize: () => void
  startQrEngagement: () => Promise<string>
  sendDeviceResponse: (devceResponse: Uint8Array) => void
  shutdown: () => void
}

export const mDocNativeModule = requireNativeModule<MdocNativeModule>('MdocDataTransfer')
export const mDocNativeModuleEventEmitter = new EventEmitter(mDocNativeModule as unknown as NativeModule)

