<h1 align="center" ><b>Expo - mDOC Data Transfer</b></h1>

<p align="center">
  <a href="https://typescriptlang.org">
    <img src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg" />
  </a>
  <a href="https://www.npmjs.com/package/expo-mdoc-data-transfer">
    <img src="https://img.shields.io/npm/v/expo-mdoc-data-transfer" />
  </a>
  <a
    href="https://raw.githubusercontent.com/openwallet-foundation-labs/expo-mdoc-data-transfer/main/LICENSE"
    ><img
      alt="License"
      src="https://img.shields.io/badge/License-Apache%202.0-blue.svg"
  /></a>
</p>

<p align="center">
  <a href="#getting-started">Getting Started</a> 
  &nbsp;|&nbsp;
  <a href="#usage">Usage</a> 
  &nbsp;|&nbsp;
  <a href="#contributing">Contributing</a> 
  &nbsp;|&nbsp;
  <a href="#contributing">License</a> 
</p>

---

An [Expo Module](https://docs.expo.dev/modules/overview/) with support for mDOC (e.g., mDL) data transfer, as specified in ISO/IEC 18013-5.

## Getting Started

First, install the module using your package manager.

```sh
npm install expo-mdoc-data-transfer
```

Then add the config plugin to your `app.json`, so the required permissions and native configuration are applied:

```json
{
  "expo": {
    "plugins": ["expo-mdoc-data-transfer"]
  }
}
```

Then prebuild the application so the Expo Module wrapper can be added as native dependency:

```sh
npx expo prebuild
```

### iOS

For iOS installations, you need to follow the following steps:

1. Add `expo-build-properties` with `ios.useFrameworks: "dynamic"`
2. If you want to use the new architecture (more efficient), add `expo-build-properties` with `newArchEnabled: true`

Run `USE_FRAMEWORKS=dynamic npx pod-install` after installing the npm package.

### Android

The Android implementation is built on top of [Multipaz](https://github.com/openwallet-foundation-labs/identity-credential), which requires a minimum SDK version of 26. Add `expo-build-properties` with `android.minSdkVersion: 26`:

```json
{
  "expo": {
    "plugins": [
      "expo-mdoc-data-transfer",
      [
        "expo-build-properties",
        {
          "android": {
            "minSdkVersion": 26
          }
        }
      ]
    ]
  }
}
```

The config plugin takes care of the rest of the native setup for you:

- Adds the Bluetooth (`BLUETOOTH_SCAN`, `BLUETOOTH_ADVERTISE`, `BLUETOOTH_CONNECT`, and the legacy `BLUETOOTH`/`BLUETOOTH_ADMIN`) and `NFC` permissions to the manifest.
- Registers the NFC engagement `HostApduService`, so the device can be engaged by tapping it against a reader.
- Forces a single Bouncy Castle version (`bcprov-jdk18on`/`bcutil-jdk18on`) and excludes the conflicting `jdk15to18` artifacts.
- Excludes a duplicate `META-INF` entry that otherwise fails the packaging step.

The Bluetooth permissions are declared in the manifest, but on Android they still have to be granted at runtime before starting an engagement. You are responsible for requesting them, for example using `PermissionsAndroid` from React Native:

```ts
import { PermissionsAndroid, type Permission } from 'react-native'

await PermissionsAndroid.requestMultiple([
  'android.permission.BLUETOOTH_CONNECT',
  'android.permission.BLUETOOTH_SCAN',
  'android.permission.BLUETOOTH_ADVERTISE',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_COARSE_LOCATION',
] as Permission[])
```

`ACCESS_FINE_LOCATION` and `ACCESS_COARSE_LOCATION` are only required on Android 11 and below, where Bluetooth scanning is gated behind the location permission.

Finally, build and run the app on a physical device — Bluetooth and NFC are not available on an emulator:

```sh
npx expo run:android
```

## Usage

You can import `expo-mdoc-data-transfer` in your application.

## Contributing

Is there something you'd like to fix or add? Great, we love community contributions! To get involved, please follow our [contribution guidelines](https://github.com/animo/.github/blob/main/CONTRIBUTING.md).

## License

This repository is licensed under the [Apache 2.0](./LICENSE) license.
