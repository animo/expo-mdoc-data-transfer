import { type ConfigPlugin, createRunOncePlugin, withPlugins } from '@expo/config-plugins'

import { withAndroid } from './withAndroid'

const withMdocTransportSdk: ConfigPlugin = (config) => {
  return withPlugins(config, [withAndroid])
}

export default createRunOncePlugin(withMdocTransportSdk, '@animo-id/expo-mdoc-data-transfer')
