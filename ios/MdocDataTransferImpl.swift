//
//  MdocDataTransferImpl.swift
//  MdocDataTransfer
//
//  Created by Timo Glastra on 01/11/2024.
//

import Foundation
import MdocDataTransfer18013

@objc(MdocDataTransferImpl)
public class MdocDataTransferImpl: NSObject {
  @objc public func doSomethingWithMdoc() -> String {
    let bleServerTransfer = try? MdocGattServer(parameters: [
        InitializeKeys.document_json_data.rawValue: [Data(name: "sample_data")],
        InitializeKeys.trusted_certificates.rawValue: [Data(name: "scytales_root_ca.der")]
    ])
      
    return "Called the mdoc library"
  }
}

