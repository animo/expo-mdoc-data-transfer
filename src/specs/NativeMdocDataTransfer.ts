export interface Spec {
  enableNfc: () => void

  // String indicates an error on iOS legacy architecture
  initialize: (serviceName: string) => undefined | string

  startQrEngagement: () => Promise<string>

  sendDeviceResponse: (devceResponse: string) => Promise<void>

  // String indicates an error on iOS legacy architecture
  shutdown: () => undefined | string
}
