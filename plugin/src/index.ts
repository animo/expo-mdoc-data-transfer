import { type ConfigPlugin, createRunOncePlugin, withPlugins } from '@expo/config-plugins'

import { withAndroid } from './withAndroid'

import { withIos } from './withIos'

const withMdocDataTransfer: ConfigPlugin = (config) => withPlugins(config, [withIos, withAndroid])

export default createRunOncePlugin(withMdocDataTransfer, '@animo-id/mdoc-data-transfer')
