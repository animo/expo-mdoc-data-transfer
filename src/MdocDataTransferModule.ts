import { requireNativeModule } from 'expo-modules-core'

type MdocNativeModule = {
  hello: () => string
}

const mDocNativeModule = requireNativeModule<MdocNativeModule>('MdocDataTransfer')

export const hello = mDocNativeModule.hello
