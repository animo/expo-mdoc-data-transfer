import { type ConfigPlugin, withInfoPlist, withPlugins, withPodfile } from '@expo/config-plugins'
import type { ExpoConfig } from '@expo/config-types'
import type { Props } from '.'

const withIosPodfile: ConfigPlugin<Props> = (expoConfig: ExpoConfig, props) =>
  withPodfile(expoConfig, (c) => {
    if (!props.ios?.buildStatic) return c
    const staticLibraries = `mdoc_data_transfer_static_libraries=[${props.ios.buildStatic.map((i) => `"${i}"`).join(', ')}]`
    if (c.modResults.contents.includes('mdoc_data_transfer_static_libraries')) {
      c.modResults.contents = c.modResults.contents.replace(/mdoc_data_transfer_static_libraries=.*/, staticLibraries)
    } else {
      c.modResults.contents += staticLibraries
    }

    if (c.modResults.contents.includes('Pod::BuildType.static_library')) return c

    c.modResults.contents += `
pre_install do |installer|
  installer.pod_targets.each do |pod|
    if mdoc_data_transfer_static_libraries.include?(pod.name)
      def pod.build_type;
        Pod::BuildType.static_library
      end
    end
  end
end
  `
    return c
  })

const withIosBluetoothUsage: ConfigPlugin<Props> = (config, props) => {
  return withInfoPlist(config, (c) => {
    const defaultDescription = 'This app uses Bluetooth to connect to external devices for credential sharing.'

    const usageDescription = props?.ios?.bluetoothDescription || defaultDescription

    if (c.ios?.infoPlist) {
      c.ios.infoPlist.NSBluetoothAlwaysUsageDescription = usageDescription
    }

    return c
  })
}

export const withIos: ConfigPlugin<Props> = (config, props) =>
  withPlugins(config, [
    [withIosPodfile, props],
    [withIosBluetoothUsage, props],
  ])
