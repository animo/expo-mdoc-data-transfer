import { Platform } from 'react-native'
import { requireExpoModule, requireReactNativeModule } from './MdocDataTransferLoader'

const shouldUseExpo = Platform.OS === 'android'

export const mDocNativeModule = shouldUseExpo ? requireExpoModule() : requireReactNativeModule()
