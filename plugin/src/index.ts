import { type ConfigPlugin, createRunOncePlugin, withPlugins } from '@expo/config-plugins'

import { withAndroid } from './withAndroid'

const withMdocDataTransfer: ConfigPlugin = (config) => withPlugins(config, [withAndroid])

export default createRunOncePlugin(withMdocDataTransfer, '@animo-id/mdoc-data-transfer')
