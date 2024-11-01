import { withPlugins, withPodfile } from '@expo/config-plugins'
import type { ExpoConfig } from '@expo/config-types'
import type { Props } from '.'

const withIosPodfile = (props: Props) => (expoConfig: ExpoConfig) =>
  withPodfile(expoConfig, (c) => {
    if (!props.ios?.buildStatic) return c
    if (c.modResults.contents.includes('Pod::BuildType.static_library')) return c
    const staticLibraries = props.ios.buildStatic.map((l) => `pod.name.eql?('${l}')`).join('||')
    c.modResults.contents += `
pre_install do |installer|
  installer.pod_targets.each do |pod|
    if ${staticLibraries}
      def pod.build_type;
        Pod::BuildType.static_library
      end
    end
  end
end
  `
    return c
  })

export const withIos = (props: Props) => (config: ExpoConfig) => withPlugins(config, [withIosPodfile(props)])
