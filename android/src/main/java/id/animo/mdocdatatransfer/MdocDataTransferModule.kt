package id.animo.mdocdatatransfer

import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.bouncycastle.jce.provider.BouncyCastleProvider
import java.security.Security

class MdocDataTransferModule : Module() {
    override fun definition() = ModuleDefinition {
        val context = appContext.reactContext ?: throw Exceptions.ReactContextLost()
        var mDocDataTransfer: MdocDataTransfer? = null

        Name("MdocDataTransfer")

        Events(
            MdocDataTransferEvent.ON_REQUEST_RECEIVED,
            MdocDataTransferEvent.ON_RESPONSE_SENT
        )

        Function("initialize") {
            // We have to re-set the Bouncy Castle provider, otherwise the EUDI library cannot find it correctly
            Security.removeProvider("BC")
            Security.addProvider(BouncyCastleProvider())

            mDocDataTransfer = MdocDataTransfer(
                context,
                sendEvent = { name: String, body: Map<String, Any?>? ->
                    sendEvent(
                        name,
                        body ?: mapOf()
                    )
                }
            )

            return@Function null
        }


        AsyncFunction("startQrEngagement") { promise: Promise ->
            mDocDataTransfer?.apply {
                onQrEngagementReady = { qrCode ->
                    promise.resolve(qrCode)
                    onQrEngagementReady = null
                }
                startQrEngagement()
            } ?: throw MdocDataTransferException.NotInitialized()
        }

        Function("sendDeviceResponse") { deviceResponse: ByteArray ->
            (mDocDataTransfer
                ?: throw MdocDataTransferException.NotInitialized()).respond(deviceResponse)
        }

        Function("shutdown") {
            mDocDataTransfer = null

            return@Function null
        }
    }
}
