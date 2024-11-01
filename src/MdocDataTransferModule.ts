import { EventEmitter } from 'expo-modules-core'
import { type NativeModule, Platform } from 'react-native'
import { requireExpoModule, requireTurboModule } from './NativeMdocDataTransfer'

export const mDocNativeModule = Platform.OS === 'ios' ? requireTurboModule() : requireExpoModule()
export const mDocNativeModuleEventEmitter = new EventEmitter(mDocNativeModule as unknown as NativeModule)
