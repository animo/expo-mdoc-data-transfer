<p align="center">
  <picture>
   <source media="(prefers-color-scheme: light)" srcset="https://res.cloudinary.com/animo-solutions/image/upload/v1656578320/animo-logo-light-no-text_ok9auy.svg">
   <source media="(prefers-color-scheme: dark)" srcset="https://res.cloudinary.com/animo-solutions/image/upload/v1656578320/animo-logo-dark-no-text_fqqdq9.svg">
   <img alt="Animo Logo" height="200px" />
  </picture>
</p>

<h1 align="center" ><b>Expo - mDOC Data Transfer</b></h1>

<h4 align="center">Powered by &nbsp; 
  <picture>
    <source media="(prefers-color-scheme: light)" srcset="https://res.cloudinary.com/animo-solutions/image/upload/v1656579715/animo-logo-light-text_cma2yo.svg">
    <source media="(prefers-color-scheme: dark)" srcset="https://res.cloudinary.com/animo-solutions/image/upload/v1656579715/animo-logo-dark-text_uccvqa.svg">
    <img alt="Animo Logo" height="12px" />
  </picture>
</h4><br>

<p align="center">
  <a href="https://typescriptlang.org">
    <img src="https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg" />
  </a>
  <a href="https://www.npmjs.com/package/@animo-id/expo-mdoc-data-transfer">
    <img src="https://img.shields.io/npm/v/@animo-id/expo-mdoc-data-transfer" />
  </a>
  <a
    href="https://raw.githubusercontent.com/animo/expo-mdoc-data-transfer/main/LICENSE"
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
npm install @animo-id/mdoc-data-transfer
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

*Coming soon.*

## Usage

You can import `@animo-id/mdoc-data-transfer` in your application.

## Contributing

Is there something you'd like to fix or add? Great, we love community contributions! To get involved, please follow our [contribution guidelines](https://github.com/animo/.github/blob/main/CONTRIBUTING.md).

## License

This repository is licensed under the [Apache 2.0](./LICENSE) license.
