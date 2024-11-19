// import { withPlugins, withPodfile } from '@expo/config-plugins'
// import type { ExpoConfig } from '@expo/config-types'
// import type { Props } from '.'
//
// const withIosPodfile = (props: Props) => (expoConfig: ExpoConfig) =>
//   withPodfile(expoConfig, (c) => {
//     if (!props.ios?.buildStatic) return c
//     const staticLibraries = `mdoc_data_transfer_static_libraries=[${props.ios.buildStatic.map((i) => `"${i}"`).join(', ')}]`
//     if (c.modResults.contents.includes('mdoc_data_transfer_static_libraries')) {
//       c.modResults.contents = c.modResults.contents.replace(/mdoc_data_transfer_static_libraries=.*/, staticLibraries)
//     } else {
//       c.modResults.contents += staticLibraries
//     }
//
//     if (c.modResults.contents.includes('Pod::BuildType.static_library')) return c
//
//     c.modResults.contents += `
// pre_install do |installer|
//   installer.pod_targets.each do |pod|
//     if mdoc_data_transfer_static_libraries.include?(pod.name)
//       def pod.build_type;
//         Pod::BuildType.static_library
//       end
//     end
//   end
// end
//   `
//     return c
//   })
//
// export const withIos = (props: Props) => (config: ExpoConfig) => withPlugins(config, [withIosPodfile(props)])
