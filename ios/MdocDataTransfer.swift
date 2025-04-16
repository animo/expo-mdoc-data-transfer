import MdocDataModel18013
import MdocDataTransfer18013
import MdocSecurity18013
import React
import SwiftCBOR
import WalletStorage

@objc(MdocDataTransfer)
class MdocDataTransfer: RCTEventEmitter {
  let crv: CoseEcCurve = CoseEcCurve.P256

  let ON_RESPONSE_SENT_EVENT: String = "onResponseSent"
  let ON_REQUEST_RECEIVED_EVENT: String = "onRequestReceived"

  var secureArea: SecureArea?
  var bleServerTransfer: MdocGattServer?
  var resolver: RCTPromiseResolveBlock?
  var rejector: RCTPromiseRejectBlock?

  override func supportedEvents() -> [String]! {
    return ["onResponseSent", "onRequestReceived"]
  }

  // NFC is not enabled on iOS
  @objc func enableNfc() {
    return
  }

  @objc func initialize(
    _ serviceName: String, trustedCertificates: [String], resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    resolver = resolve
    rejector = reject

    guard bleServerTransfer == nil else {
      self.reject(MdocDataTransferError.BleGattServerAlreadyInitialized.localizedDescription)
      return
    }

    let decodedCertificates: [Data] = trustedCertificates.map { $0.data(using: .utf8) ?? Data() }
      .filter { !$0.isEmpty }

    var base64DecodedCerts: [Data] = Array()
    for cert in decodedCertificates {
      guard let base64Data = Data(base64Encoded: cert) else {
        self.reject(MdocDataTransferError.InvalidTrustedCertificate.localizedDescription)
        return
      }

      let secCert = SecCertificateCreateWithData(nil, base64Data as CFData)
      if secCert == nil {
        self.reject(MdocDataTransferError.InvalidTrustedCertificate.localizedDescription)
        return
      }

      base64DecodedCerts.append(base64Data)
    }

    secureArea = SoftwareSecureArea.create(
      storage: KeyChainSecureKeyStorage(serviceName: serviceName, accessGroup: nil))

    do {
      bleServerTransfer = try MdocGattServer(
        parameters: InitializeTransferData(
          dataFormats: [:],
          documentData: [:],
          docDisplayNames: [:],
          privateKeyData: [:],
          trustedCertificates: base64DecodedCerts,
          deviceAuthMethod: DeviceAuthMethod.deviceSignature.rawValue,
          idsToDocTypes: [:],
          hashingAlgs: [:],
          sendDeviceResponseManually: true)
      )
      bleServerTransfer?.delegate = self
    } catch {
      self.reject(error.localizedDescription)
      return
    }

    self.resolve(nil)
  }

  @objc func startQrEngagement(
    _ resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      resolver = resolve
      rejector = reject

      guard let bleServerTransfer = bleServerTransfer, let secureArea = secureArea else {
        self.reject(
          MdocDataTransferError.BleGattServerNotInitialized
            .localizedDescription)
        return
      }

      do {
        try await bleServerTransfer.performDeviceEngagement(secureArea: secureArea, crv: crv)
      } catch {
        self.reject(error.localizedDescription)
      }
    }
  }

  @objc func sendDeviceResponse(
    _ deviceResponse: String,
    resolve: @escaping RCTPromiseResolveBlock,
    reject: @escaping RCTPromiseRejectBlock
  ) {
    Task {
      resolver = resolve
      rejector = reject

      guard let bleServerTransfer = bleServerTransfer,
        var sessionEncryption = bleServerTransfer.sessionEncryption
      else {
        self.reject(
          MdocDataTransferError.BleGattServerNotInitialized
            .localizedDescription)
        return
      }

      do {
        let byteArray = deviceResponse.split(separator: ":").compactMap {
          UInt8($0)
        }
        let cipherData = try await sessionEncryption.encrypt(byteArray)
        let sd = SessionData(cipher_data: cipherData, status: 20)
        try bleServerTransfer.sendDeviceResponse(
          Data(sd.encode(options: CBOROptions())))
      } catch {
        let sd = SessionData(cipher_data: nil, status: 11)
        do {
          try bleServerTransfer.sendDeviceResponse(
            Data(sd.encode(options: CBOROptions())))
        } catch {
          self.reject(error.localizedDescription)
          return
        }
        self.reject(error.localizedDescription)
        return
      }
      resolve(nil)
    }
  }

  @objc func shutdown() -> String? {
    guard let bleServerTransfer = bleServerTransfer else {
      return MdocDataTransferError.BleGattServerNotInitialized
        .localizedDescription

    }

    bleServerTransfer.stop()

    self.bleServerTransfer = nil
    rejector = nil
    resolver = nil

    return nil
  }

  private func reject(_ message: String) {
    guard let rejector = rejector else {
      fatalError(
        MdocDataTransferError.RejectorNotInitialized
          .localizedDescription)
    }
    rejector("ERROR", message, nil)

    resolver = nil
    self.rejector = nil
  }

  private func resolve(_ result: Any?) {
    guard let resolver = resolver else {
      fatalError(
        MdocDataTransferError.ResolverNotInitialized
          .localizedDescription)
    }
    resolver(result)

    self.resolver = nil
    rejector = nil
  }
}

extension MdocDataTransfer: MdocOfflineDelegate {
  public func didChangeStatus(
    _ newStatus: MdocDataTransfer18013.TransferStatus
  ) {
    guard let bleServerTransfer = bleServerTransfer else {
      reject(
        MdocDataTransferError.BleGattServerNotInitialized
          .localizedDescription)
      return
    }

    switch newStatus {
    case .qrEngagementReady:
      guard let qrCode = bleServerTransfer.qrCodePayload else {
        reject(MdocDataTransferError.QrCodeNotSet.localizedDescription)
        return
      }
      resolve(qrCode)
    case .error:
      guard let error = bleServerTransfer.error else {
        reject(MdocDataTransferError.ErrorNotSet.localizedDescription)
        return
      }
      reject(error.localizedDescription)
      return
    case .responseSent:
      sendEvent(withName: ON_RESPONSE_SENT_EVENT, body: nil)
    default:
      os_log("data transfer status change: %@", newStatus.rawValue)
    }

  }

  public func didFinishedWithError(_ error: any Error) {
    reject(error.localizedDescription)
  }

  public func didReceiveRequest(
    _ request: MdocDataTransfer18013.UserRequestInfo?,
    handleSelected: @escaping (Bool, MdocDataTransfer18013.RequestItems?) async -> Void
  ) {
    guard
      let sessionTranscriptBytes = bleServerTransfer?.sessionEncryption?
        .sessionTranscriptBytes,
      let deviceRequestBytes = bleServerTransfer?.deviceRequest?.encode(
        options: CBOROptions())
    else {
      return
    }

    sendEvent(
      withName: ON_REQUEST_RECEIVED_EVENT,
      body: [
        "sessionTranscript": sessionTranscriptBytes,
        "deviceRequest": deviceRequestBytes,
      ])
  }
}
