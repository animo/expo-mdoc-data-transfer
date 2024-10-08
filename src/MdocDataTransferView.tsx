import { requireNativeViewManager } from 'expo-modules-core'
import type * as React from 'react'

import type { MdocDataTransferViewProps } from './MdocDataTransfer.types'

const NativeView: React.ComponentType<MdocDataTransferViewProps> = requireNativeViewManager('MdocDataTransfer')

export default function MdocDataTransferView(props: MdocDataTransferViewProps) {
  return <NativeView {...props} />
}
