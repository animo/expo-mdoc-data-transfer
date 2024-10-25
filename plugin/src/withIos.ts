import type { ConfigPlugin } from '@expo/config-plugins'

import fs from 'node:fs/promises'
import path from 'node:path'
import { withDangerousMod, withPlugins } from '@expo/config-plugins'
import { type MergeResults, mergeContents } from '@expo/config-plugins/build/utils/generateCode'

const swiftPackageManagerPackage = `
`

export function addPod(src: string): MergeResults {
  return mergeContents({
    tag: '@animo-id/mdoc-data-transfer',
    src,
    newSrc: swiftPackageManagerPackage,
    anchor: /use_native_modules/,
    offset: 0,
    comment: '#',
  })
}

const withIosPod: ConfigPlugin = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const filePath = path.join(config.modRequest.platformProjectRoot, 'Podfile')
      const contents = await fs.readFile(filePath, 'utf-8')
      const results = addPod(contents)

      if (!results.didMerge) {
        console.log(
          "ERROR: Cannot add source for mdoc-data-transfer to the project's ios/Podfile because it's malformed. Please report this with a copy of your project Podfile."
        )
        return config
      }

      await fs.writeFile(filePath, results.contents)
      return config
    },
  ])
}

export const withIos: ConfigPlugin = (config) => withPlugins(config, [withIosPod])
