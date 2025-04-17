package id.animo.mdocdatatransfer

import android.annotation.SuppressLint
import android.content.Context
import com.android.identity.securearea.software.SoftwareSecureArea
import com.android.identity.storage.EphemeralStorageEngine
import eu.europa.ec.eudi.iso18013.transfer.TransferManager
import eu.europa.ec.eudi.iso18013.transfer.engagement.BleRetrievalMethod
import eu.europa.ec.eudi.wallet.document.DocumentManager

@SuppressLint("StaticFieldLeak")
object MdocDataTransferManager {
    @Volatile
    private lateinit var context: Context

    fun init(
        context: Context,
        tc: Array<String>,
    ) {
        this.context = context
    }

    private val storageEngine = EphemeralStorageEngine()
    private val secureArea = SoftwareSecureArea(storageEngine)

    private val documentManager =
        DocumentManager
            .Builder()
            .setIdentifier("eudi_wallet_document_manager")
            .setStorageEngine(storageEngine)
            .addSecureArea(secureArea)
            .build()

    val transferManager =
        lazy {
            TransferManager.getDefault(
                context,
                documentManager,
                null,
                listOf(
                    BleRetrievalMethod(
                        peripheralServerMode = true,
                        centralClientMode = true,
                        clearBleCache = true,
                    ),
                ),
            )
        }
}
