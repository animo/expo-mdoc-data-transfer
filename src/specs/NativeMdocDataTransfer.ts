import { type TurboModule, TurboModuleRegistry } from 'react-native'

export interface Spec extends TurboModule {
  enableNfc: () => void

  // String indicates an error on iOS legacy architecture
  initialize: () => undefined | string

  startQrEngagement: () => Promise<string>

  sendDeviceResponse: (devceResponse: string) => void

  // String indicates an error on iOS legacy architecture
  shutdown: () => undefined | string
}

export const turboModuleMdocDataTransfer = () => TurboModuleRegistry.getEnforcing<Spec>('MdocDataTransfer')
