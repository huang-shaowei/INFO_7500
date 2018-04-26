
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.*;
import org.bouncycastle.openssl.jcajce.*;
import org.bouncycastle.operator.OperatorCreationException;
import org.bouncycastle.pkcs.PKCSException;

import javax.xml.bind.DatatypeConverter;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.security.spec.ECGenParameterSpec;
import java.security.spec.InvalidKeySpecException;

public class GenerateDigitalSignature {

    private static final String SIGNATURE_ALGORITHM = "SHA256withECDSA";
    private static SecureRandom random;
    private static String password = "12345678";

    public static void main(String[] args) throws Throwable {

        random = SecureRandom.getInstanceStrong();

        // Read Scrooge's key pair from disk
        KeyPair kp = loadKeyFromEncrypted("scrooge_sk.pem", password);
        PrivateKey recoveredKey = kp.getPrivate();
        PublicKey publicKey = kp.getPublic();

        // Generate Scrooge's digital signature for the message "Pay 3 bitcoins to Alice"
        Signature signature = Signature.getInstance(SIGNATURE_ALGORITHM);
        signature.initSign(recoveredKey, random);
        String messageStr1 = "Pay 3 bitcoins to Alice";
        byte[] message1 = messageStr1.getBytes(StandardCharsets.UTF_8);
        signature.update(message1);
        byte[] sigBytes1 = signature.sign();
        System.out.println("Signature: msg=" + messageStr1 + " sig.len=" + sigBytes1.length + " sig=" + DatatypeConverter.printHexBinary(sigBytes1));
    }

    public static KeyPair loadKeyFromEncrypted(String filename, String password) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException, PKCSException, OperatorCreationException {
        File secretKeyFile = new File(filename); // private key file in PEM format
        PEMParser pemParser = new PEMParser(new FileReader(secretKeyFile));
        Object object = pemParser.readObject();
        PEMDecryptorProvider decProv = new JcePEMDecryptorProviderBuilder().build(password.toCharArray());
        JcaPEMKeyConverter converter = new JcaPEMKeyConverter();
        KeyPair kp = converter.getKeyPair(((PEMEncryptedKeyPair) object).decryptKeyPair(decProv));
        return kp;
    }
}
