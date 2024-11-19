import { EventEmitter } from 'expo-modules-core'
import type { NativeModule } from 'react-native'
import { requireExpoModule } from './NativeMdocDataTransfer'

export const mDocNativeModule = requireExpoModule()
export const mDocNativeModuleEventEmitter = new EventEmitter(mDocNativeModule as unknown as NativeModule)
