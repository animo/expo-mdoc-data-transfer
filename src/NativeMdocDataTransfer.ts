import { requireNativeModule } from 'expo-modules-core'
import type { TurboModule } from 'react-native'
import { TurboModuleRegistry } from 'react-native'

export type MdocNativeModule = {
  initialize: () => Promise<void>
  startQrEngagement: () => Promise<string>
  sendDeviceResponse: (devceResponse: Uint8Array) => Promise<void>
  shutdown: () => Promise<void>
}

export function requireTurboModule() {
  return TurboModuleRegistry.getEnforcing<TurboModule & MdocNativeModule>('MdocDataTransfer')
}

export function requireExpoModule() {
  return requireNativeModule<MdocNativeModule>('MdocDataTransfer')
}
