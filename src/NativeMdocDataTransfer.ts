import { requireNativeModule } from 'expo-modules-core'

export type MdocNativeModule = {
  initialize: () => void
  startQrEngagement: () => Promise<string>
  sendDeviceResponse: (devceResponse: string) => void
  shutdown: () => void
}

export function requireExpoModule() {
  return requireNativeModule<MdocNativeModule>('MdocDataTransfer')
}
