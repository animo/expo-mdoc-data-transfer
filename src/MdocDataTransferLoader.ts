import { requireNativeModule, EventEmitter as ExpoEventEmitter } from 'expo-modules-core'
import {
  NativeEventEmitter as ReactNativeEventEmitter,
  type NativeModule as ReactNativeNativeModule,
  NativeModules as ReactNativeNativeModules,
} from 'react-native'

export interface MdocDataTransferModule {
  enableNfc: () => void
  initialize: (serviceName: string) => Promise<void>
  startQrEngagement: () => Promise<string>
  sendDeviceResponse: (devceResponse: string) => Promise<void>
  shutdown: () => undefined
}

type MdocDataTransferModuleWithEvents = {
  nativeModule: MdocDataTransferModule,
  eventEmitter: ReactNativeEventEmitter
}

export const requireExpoModule = () => { 
  const nativeModule = requireNativeModule('MdocDataTransfer')


  return {
    nativeModule,
    eventEmitter: nativeModule
  } as unknown as MdocDataTransferModuleWithEvents
}

export const requireReactNativeModule = () => {
  const nativeModule = ReactNativeNativeModules.MdocDataTransfer as ReactNativeNativeModule

  const eventEmitter = new ReactNativeEventEmitter(nativeModule)

  return {
    nativeModule,
    eventEmitter
  } as unknown as MdocDataTransferModuleWithEvents
}
