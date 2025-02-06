import { type ConfigPlugin, withInfoPlist } from '@expo/config-plugins'

const BLUETOOTH_ALWAYS = 'Allow $(PRODUCT_NAME) to connect to bluetooth devices for data sharing'

export const withIos: ConfigPlugin<{
  bluetoothAlwaysPermission?: string | false
}> = (c, { bluetoothAlwaysPermission } = {}) => {
  return withInfoPlist(c, (config) => {
    if (bluetoothAlwaysPermission !== false) {
      config.modResults.NSBluetoothAlwaysUsageDescription =
        bluetoothAlwaysPermission || config.modResults.NSBluetoothAlwaysUsageDescription || BLUETOOTH_ALWAYS
    }
    return config
  })
}
