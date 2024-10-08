import { EventEmitter, NativeModulesProxy, type Subscription } from 'expo-modules-core'

import { ChangeEventPayload, MdocDataTransferViewProps } from './MdocDataTransfer.types'
// Import the native module. On web, it will be resolved to MdocDataTransfer.web.ts
// and on native platforms to MdocDataTransfer.ts
import MdocDataTransferModule from './MdocDataTransferModule'
import MdocDataTransferView from './MdocDataTransferView'

// Get the native constant value.
export const PI = MdocDataTransferModule.PI

export function hello(): string {
  return MdocDataTransferModule.hello()
}

export async function setValueAsync(value: string) {
  return await MdocDataTransferModule.setValueAsync(value)
}

const emitter = new EventEmitter(MdocDataTransferModule ?? NativeModulesProxy.MdocDataTransfer)

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener)
}

export { MdocDataTransferView, MdocDataTransferViewProps, ChangeEventPayload }
