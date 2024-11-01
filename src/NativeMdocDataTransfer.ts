import type { TurboModule } from 'react-native'
import { TurboModuleRegistry } from 'react-native'
import { requireNativeModule } from 'expo-modules-core'

type MdocNativeModule = {
  // To support old architecture we need to handle async methods
  hello: () => Promise<string> | string
}

// TODO: can this extend from the above module?
export interface Spec extends TurboModule {
  hello: () => string
}

export function requireTurboModule() {
  return TurboModuleRegistry.getEnforcing<Spec>('MdocDataTransfer')
}

export function requireExpoModule() {
  return requireNativeModule<MdocNativeModule>('MdocDataTransfer')
}
