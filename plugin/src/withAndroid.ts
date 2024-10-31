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

// TODO: make it possible to optionally enable NFC
const withAndroidNfcProperties: ConfigPlugin = (expoConfig) =>
  withAndroidManifest(expoConfig, (c) => {
    const androidManifest = c.modResults.manifest

    if (!androidManifest['uses-permission']?.some((p) => p.$['android:name'] === 'android.permission.NFC')) {
      androidManifest['uses-permission']?.push({
        $: {
          'android:name': 'android.permission.NFC',
        },
      })
    }

    for (const app of androidManifest.application ?? []) {
      if (app.service?.some((s) => s.$['android:name'] === 'id.animo.mdocdatatransfer.NfcEngagementServiceImpl'))
        continue
      app.service ??= []
      app.service.push({
        $: {
          'android:exported': 'true',
          'android:name': 'id.animo.mdocdatatransfer.NfcEngagementServiceImpl',
          'android:permission': 'android.permission.BIND_NFC_SERVICE',
        },
        'intent-filter': [
          {
            action: [
              {
                $: {
                  'android:name': 'android.nfc.action.NDEF_DISCOVERED',
                },
              },
              {
                $: {
                  'android:name': 'android.nfc.cardemulation.action.HOST_APDU_SERVICE',
                },
              },
            ],
          },
        ],
        // @ts-ignore
        'meta-data': {
          $: {
            'android:name': 'android.nfc.cardemulation.host_apdu_service',
            'android:resource': '@xml/nfc_engagement_apdu_service',
          },
        },
      })
    }

    return c
  })

const withAndroidPermissions: ConfigPlugin = (expoConfig) =>
  withAndroidManifest(expoConfig, (c) => {
    const androidManifest = c.modResults.manifest

    for (const permission of permissions) {
      if (androidManifest['uses-permission']?.some((p) => p.$['android:name'] === permission)) continue
      androidManifest['uses-permission']?.push({
        $: {
          'android:name': permission,
        },
      })
    }

    return c
  })

export const withAndroid: ConfigPlugin = (config) =>
  withPlugins(config, [withAndroidNfcProperties, withAndroidPermissions])
