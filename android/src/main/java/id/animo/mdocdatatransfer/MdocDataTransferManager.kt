package id.animo.mdocdatatransfer

import android.annotation.SuppressLint
import android.content.Context
import eu.europa.ec.eudi.iso18013.transfer.DocumentsResolver
import eu.europa.ec.eudi.iso18013.transfer.TransferManager
import eu.europa.ec.eudi.iso18013.transfer.response.ResponseGenerator
import eu.europa.ec.eudi.iso18013.transfer.retrieval.BleRetrievalMethod

@SuppressLint("StaticFieldLeak")
object MdocDataTransferManager {
    @Volatile
    private lateinit var context: Context

    fun init(context: Context) {
        this.context = context
    }

    val transferManager = lazy {
        TransferManager.Builder(context).apply {
            retrievalMethods = listOf(
                BleRetrievalMethod(
                    peripheralServerMode = true,
                    centralClientMode = true,
                    clearBleCache = true
                )
            )
            responseGenerator = ResponseGenerator.Builder(context)
                .apply {
                    documentsResolver = DocumentsResolver { listOf() }
                }.build()

        }.build()
    }
}
