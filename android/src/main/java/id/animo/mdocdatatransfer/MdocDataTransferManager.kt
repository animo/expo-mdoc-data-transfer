package id.animo.mdocdatatransfer

import android.annotation.SuppressLint
import android.content.Context
import com.android.identity.securearea.software.SoftwareSecureArea
import com.android.identity.storage.EphemeralStorageEngine
import eu.europa.ec.eudi.iso18013.transfer.TransferManager
import eu.europa.ec.eudi.iso18013.transfer.engagement.BleRetrievalMethod
import eu.europa.ec.eudi.iso18013.transfer.readerauth.ReaderTrustStore
import eu.europa.ec.eudi.wallet.document.DocumentManager
import java.io.ByteArrayInputStream
import java.security.cert.CertificateFactory
import java.security.cert.X509Certificate
import java.util.Base64

@SuppressLint("StaticFieldLeak")
object MdocDataTransferManager {
    @Volatile
    private lateinit var context: Context
    private lateinit var trustedCertificates: List<X509Certificate>

    fun init(
        context: Context,
        tc: Array<String>,
    ) {
        this.context = context

        trustedCertificates = tc.map { base64StringToX509Certificate(it) }
    }

    private fun base64StringToX509Certificate(base64CertString: String): X509Certificate {
        val certificateBytes = Base64.getDecoder().decode(base64CertString)
        val inputStream = ByteArrayInputStream(certificateBytes)
        val certificateFactory = CertificateFactory.getInstance("X.509")
        return certificateFactory.generateCertificate(inputStream) as X509Certificate
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
                ReaderTrustStore.getDefault(trustedCertificates = trustedCertificates),
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
