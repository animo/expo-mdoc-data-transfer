package id.animo.mdocdatatransfer

import android.app.Activity
import android.content.Context
import android.util.Log
import androidx.activity.ComponentActivity
import eu.europa.ec.eudi.iso18013.transfer.TransferEvent
import eu.europa.ec.eudi.iso18013.transfer.engagement.NfcEngagementService
import eu.europa.ec.eudi.iso18013.transfer.response.device.DeviceRequest
import eu.europa.ec.eudi.iso18013.transfer.response.device.DeviceResponse

class MdocDataTransfer(
    context: Context,
    private val currentActivity: Activity,
    sendEvent: (name: String, body: Map<String, Any?>?) -> Unit,
) {
    companion object {
        private val TAG = Companion::class.java.simpleName
    }

    init {
        MdocDataTransferManager.init(context)

        val transferEventListener =
            TransferEvent.Listener { event ->
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
                        val request = event.request as DeviceRequest
                        sendEvent(
                            MdocDataTransferEvent.ON_REQUEST_RECEIVED,
                            mapOf(
                                "deviceRequest" to request.deviceRequestBytes.joinToString(":"),
                                "sessionTranscript" to request.sessionTranscriptBytes.joinToString(":"),
                            ),
                        )
                    }

                    is TransferEvent.ResponseSent -> {
                        Log.d(TAG, ":::mdoc-data-transfer::: TransferEvent.ResponseSent")
                        sendEvent(
                            MdocDataTransferEvent.ON_RESPONSE_SENT,
                            null,
                        )
                    }
                }
            }

        MdocDataTransferManager.transferManager.value.addTransferEventListener(transferEventListener)
    }

    var onQrEngagementReady: ((qrCode: String) -> Unit)? = null

    fun startQrEngagement() {
        MdocDataTransferManager.transferManager.value.startQrEngagement()
    }

    fun respond(deviceResponse: ByteArray) {
        MdocDataTransferManager.transferManager.value.sendResponse(DeviceResponse(deviceResponse))
    }

    fun enableNfc() {
        NfcEngagementService.enable(currentActivity as ComponentActivity)
    }

    fun disableNfc() {
        NfcEngagementService.disable(currentActivity as ComponentActivity)
    }

    fun shutdown() {
        disableNfc()
        MdocDataTransferManager.transferManager.value.stopPresentation(true, true)
    }
}
