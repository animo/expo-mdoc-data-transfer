import { type TurboModule, TurboModuleRegistry } from 'react-native'

export interface Spec extends TurboModule {
  enableNfc: () => void

  initialize: () => void

  startQrEngagement: () => Promise<string>

  sendDeviceResponse: (devceResponse: string) => void

  shutdown: () => void
}

export const turboModuleMdocDataTransfer = () => TurboModuleRegistry.getEnforcing<Spec>('MdocDataTransfer')
