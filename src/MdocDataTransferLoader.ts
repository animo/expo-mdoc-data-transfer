import { requireNativeModule } from 'expo-modules-core'
import {
  NativeEventEmitter,
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

type MdocDataTransferModuleWithEvents = NativeEventEmitter & MdocDataTransferModule

export const requireExpoModule = () => requireNativeModule<MdocDataTransferModuleWithEvents>('MdocDataTransfer')

export const requireReactNativeModule = () => {
  const nativeModule = ReactNativeNativeModules.MdocDataTransfer as ReactNativeNativeModule

  return {
    ...new NativeEventEmitter(nativeModule),
    ...nativeModule,
  } as unknown as MdocDataTransferModuleWithEvents
}
