import * as React from 'react'

import type { MdocDataTransferViewProps } from './MdocDataTransfer.types'

export default function MdocDataTransferView(props: MdocDataTransferViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  )
}
