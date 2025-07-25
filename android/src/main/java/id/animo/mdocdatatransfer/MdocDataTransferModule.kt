package id.animo.mdocdatatransfer

import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import org.bouncycastle.jce.provider.BouncyCastleProvider
import java.security.Security
import kotlin.io.encoding.Base64
import kotlin.io.encoding.ExperimentalEncodingApi

class MdocDataTransferModule : Module() {
    @OptIn(ExperimentalEncodingApi::class)
    override fun definition() = ModuleDefinition {
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
                appContext.reactContext ?: throw Exceptions.ReactContextLost(),
                appContext.currentActivity ?: throw Exceptions.MissingActivity()
            ) { name: String, body: Map<String, Any?>? ->
                sendEvent(
                    name,
                    body ?: mapOf()
                )
            }

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

        Function("sendDeviceResponse") { deviceResponse: String ->
            (mDocDataTransfer ?: throw MdocDataTransferException.NotInitialized()).respond(
                Base64.Default.decode(deviceResponse)
            )
        }

        Function("shutdown") {
            (mDocDataTransfer ?: throw MdocDataTransferException.NotInitialized()).shutdown()
        }

        Function("enableNfc") {
            (mDocDataTransfer ?: throw MdocDataTransferException.NotInitialized()).enableNfc()
        }
    }
}
