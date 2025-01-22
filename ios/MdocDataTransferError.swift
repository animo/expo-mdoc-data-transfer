public enum MdocDataTransferError: Error {
    case BleGattServerNotInitialized
    case DocumentsNotProvided
    case RejectorNotInitialized
    case ResolverNotInitialized
    case QrCodeNotSet
    case ErrorNotSet
}

extension MdocDataTransferError: LocalizedError {
    public var errorDescription: String? {
        switch self {
        case .BleGattServerNotInitialized:
            return NSLocalizedString(
                "Ble Gatt Server is not initialized. Please call `initialize()` before.",
                comment: "")
        case .DocumentsNotProvided:
            return NSLocalizedString("Documents are not provided.", comment: "")
        case .RejectorNotInitialized:
            return NSLocalizedString(
                "Rejector is not initialized. Invalid state. Bug occurred.",
                comment: "")
        case .ResolverNotInitialized:
            return NSLocalizedString(
                "Resolver is not initialized. Invalid state. Bug occurred.",
                comment: "")
        case .QrCodeNotSet:
            return NSLocalizedString(
                "QRCode not set on the object. Invalid state. Issue in EUDI mdoc library.",
                comment: "")
        case .ErrorNotSet:
            return NSLocalizedString(
                "Error not set on the object. Invalid state. Issue in EUDI mdoc library.",
                comment: "")
        }
    }
}
