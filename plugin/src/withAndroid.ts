import type { ConfigPlugin } from '@expo/config-plugins'
import { withAndroidManifest, withPlugins } from '@expo/config-plugins'

const permissions = [
  'android.permission.INTERNET',
  'android.permission.BLUETOOTH',
  'android.permission.BLUETOOTH_ADMIN',
  'android.permission.BLUETOOTH_SCAN',
  'android.permission.BLUETOOTH_ADVERTISE',
  'android.permission.BLUETOOTH_CONNECT',
  'android.permission.ACCESS_BACKGROUND_LOCATION',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_COARSE_LOCATION',
]

const withAndroidPermissions: ConfigPlugin = (expoConfig) =>
  withAndroidManifest(expoConfig, (c) => {
    const androidManifest = c.modResults.manifest

    androidManifest['uses-permission'] = [
      ...permissions.map((permission) => ({
        $: {
          'android:name': permission,
        },
      })),
    ]

    return c
  })

export const withAndroid: ConfigPlugin = (config) => withPlugins(config, [withAndroidPermissions])
