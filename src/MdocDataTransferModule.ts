import { EventEmitter as ExpoEventEmitter } from 'expo-modules-core'
import { type NativeModule, NativeModules, Platform, NativeEventEmitter as ReactNativeEventEmitter } from 'react-native'
import { requireExpoModule } from './NativeMdocDataTransfer'

import type { Spec } from './specs/NativeMdocDataTransfer'

const shouldUseExpo = Platform.OS === 'android'

export const mDocNativeModule = shouldUseExpo ? requireExpoModule() : (NativeModules.MdocDataTransfer as Spec)

export const mDocNativeModuleEventEmitter = shouldUseExpo
  ? new ExpoEventEmitter(mDocNativeModule as unknown as NativeModule)
  : new ReactNativeEventEmitter(mDocNativeModule as unknown as NativeModule)
