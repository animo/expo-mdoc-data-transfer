export * from './MdocDataTransfer'
import { Platform } from 'react-native'
import { requireExpoModule, requireTurboModule } from './NativeMdocDataTransfer'

const module = Platform.OS === 'ios' ? requireTurboModule() : requireExpoModule()

// TODO: convert this in the mdoc class
export function hello() {
  return module.hello()
}
