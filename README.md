# @animo-id/mdoc-data-transfer

mdoc data transfer module

# API documentation

- [Documentation for the main branch](https://github.com/expo/expo/blob/main/docs/pages/versions/unversioned/sdk/@animo-id/expo-mdoc-data-transfer.md)
- [Documentation for the latest stable release](https://docs.expo.dev/versions/latest/sdk/@animo-id/expo-mdoc-data-transfer/)

# Installation in managed Expo projects

For [managed](https://docs.expo.dev/archive/managed-vs-bare/) Expo projects, please follow the installation instructions in the [API documentation for the latest stable release](#api-documentation). If you follow the link and there is no documentation available then this library is not yet usable within managed projects &mdash; it is likely to be included in an upcoming Expo SDK release.

TODO: plugin config for iOS and android:

- iOS
  - add `expo-build-properties` with `ios.useFrameworks: "dynamic"`
  - the library works with both new and old arch, but is most efficient on new arch
    - to enable new arch add `expo-build-properties` with `newArchEnabled: true`
- Android
  - @berend?

# Installation in bare React Native projects

For bare React Native projects, you must ensure that you have [installed and configured the `expo` package](https://docs.expo.dev/bare/installing-expo-modules/) before continuing.

### Add the package to your npm dependencies

```
npm install @animo-id/expo-mdoc-data-transfer
```

### Configure for iOS

Run `USE_FRAMEWORKS=dynamic npx pod-install` after installing the npm package.

### Configure for Android

# Contributing

Contributions are very welcome! Please refer to guidelines described in the [contributing guide](https://github.com/expo/expo#contributing).
