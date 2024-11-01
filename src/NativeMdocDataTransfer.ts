import { requireNativeModule } from 'expo-modules-core'
import type { TurboModule } from 'react-native'
import { TurboModuleRegistry } from 'react-native'

export type MdocNativeModule = {
  initialize: () => void
  startQrEngagement: () => Promise<string>
  sendDeviceResponse: (devceResponse: string) => void
  shutdown: () => void
}

export interface Spec extends TurboModule {
  initialize: () => void
  startQrEngagement: () => Promise<string>
  sendDeviceResponse: (devceResponse: string) => void
  shutdown: () => void
}

export function requireTurboModule() {
  return TurboModuleRegistry.getEnforcing<Spec>('MdocDataTransfer')
}

export function requireExpoModule() {
  return requireNativeModule<MdocNativeModule>('MdocDataTransfer')
}
