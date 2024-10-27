package id.animo.mdocdatatransfer

import android.content.Context
import android.util.Log
import eu.europa.ec.eudi.iso18013.transfer.DeviceRetrievalMethod
import eu.europa.ec.eudi.iso18013.transfer.TransferEvent
import eu.europa.ec.eudi.iso18013.transfer.TransferManager
import eu.europa.ec.eudi.iso18013.transfer.response.DeviceRequest
import eu.europa.ec.eudi.iso18013.transfer.response.ResponseGenerator
import eu.europa.ec.eudi.iso18013.transfer.retrieval.BleRetrievalMethod

class MdocDataTransfer(
    context: Context,
    sendEvent: (name: String, body: Map<String, Any?>?) -> Unit
) {
    companion object {
        private val Any.TAG: String
            get() {
                val tag = javaClass.simpleName
                return if (tag.length <= 23) tag else tag.substring(0, 23)
            }
    }

    private val retrievalMethods = listOf<DeviceRetrievalMethod>(
        BleRetrievalMethod(
            peripheralServerMode = true,
            centralClientMode = true,
            clearBleCache = true
        )
    )

    private val transferEventListener = TransferEvent.Listener { event ->
        when (event) {
            is TransferEvent.QrEngagementReady -> {
                Log.d(TAG, ":::mdoc-data-transfer::: TransferEvent.QrEngagementReady")
                onQrEngagementReady?.let { it(event.qrCode.content) }
            }

            is TransferEvent.Connecting -> {
                Log.d(TAG, ":::mdoc-data-transfer::: TransferEvent.Connecting")
            }

            is TransferEvent.Connected -> {
                Log.d(TAG, ":::mdoc-data-transfer::: TransferEvent.Connected")
            }

            is TransferEvent.Disconnected -> {
                Log.d(TAG, ":::mdoc-data-transfer::: TransferEvent.Disconnected")
            }

            is TransferEvent.Error -> {
                Log.d(TAG, ":::mdoc-data-transfer::: TransferEvent.Error")
            }

            is TransferEvent.Redirect -> {
                Log.d(TAG, ":::mdoc-data-transfer::: TransferEvent.Redirect")
            }

            is TransferEvent.RequestReceived -> {
                Log.d(TAG, ":::mdoc-data-transfer::: TransferEvent.RequestReceived")
                when (val request = event.request) {
                    is DeviceRequest -> {
                        sendEvent(
                            MdocDataTransferEvent.ON_REQUEST_RECEIVED,
                            mapOf(("deviceRequest" to request.deviceRequestBytes.asList()))
                        )
                    }
                }
            }

            is TransferEvent.ResponseSent -> {
                Log.d(TAG, ":::mdoc-data-transfer::: TransferEvent.ResponseSent")
                sendEvent(
                    MdocDataTransferEvent.ON_RESPONSE_SENT,
                    null
                )
            }
        }
    }

    private val responseGenerator = ResponseGenerator.Builder(context).documentResolver { listOf() }
        .build()

    private val transferManager: TransferManager = TransferManager
        .Builder(context)
        .retrievalMethods(retrievalMethods)
        .responseGenerator(responseGenerator)
        .build().also { it.addTransferEventListener(transferEventListener) }

    var onQrEngagementReady: ((qrCode: String) -> Unit)? = null

    fun startQrEngagement() {
        transferManager.startQrEngagement()
    }

    fun respond(deviceResponse: ByteArray) {
        transferManager.sendResponse(deviceResponse)

    }
}