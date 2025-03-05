export interface Spec {
  enableNfc: () => void

  // String indicates an error on iOS legacy architecture
  initialize: () => undefined | string

  startQrEngagement: () => Promise<string>

  sendDeviceResponse: (devceResponse: string) => void

  // String indicates an error on iOS legacy architecture
  shutdown: () => undefined | string
}
