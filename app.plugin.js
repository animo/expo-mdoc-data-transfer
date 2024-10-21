const { withGradleProperties, withAppBuildGradle } = require('@expo/config-plugins')

const withAndroid = (config) => {
  const configWithGradleProperties = withGradleProperties(config, (c) => {
    const disabledJetifier = {
      type: 'property',
      key: 'android.enableJetifier',
      value: 'false',
    }
    c.modResults.push(disabledJetifier)
    return c
  })

  const configWithAppBuildGradle = withAppBuildGradle(configWithGradleProperties, (c) => {
    if (c.modResults.contents.includes('resources.excludes.add("META-INF/versions/9/OSGI-INF/MANIFEST.MF")')) return c

    c.modResults.contents += `
android {
   packagingOptions {
       resources.excludes.add("META-INF/versions/9/OSGI-INF/MANIFEST.MF")
   }
}
    `
    return c
  })

  return configWithAppBuildGradle
}

module.exports = withAndroid
