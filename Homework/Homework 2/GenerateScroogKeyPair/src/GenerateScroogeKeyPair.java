/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 *
 * @author User
 */
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
import static org.bouncycastle.cms.RecipientId.password;

public class GenerateScroogeKeyPair {
    private static final String KEY_ALGORITHM           = "ECDSA";
    private static final String PROVIDER                = "BC";
    private static final String CURVE_NAME              = "secp256k1";
    
    private static ECGenParameterSpec  ecGenSpec;
    private static KeyPairGenerator    keyGen_;
    private static SecureRandom        random;
    
    private static String password = "12345678";
    
    public static void main(String[] args) throws Exception {
            Security.addProvider(new BouncyCastleProvider());
            
            random = SecureRandom.getInstanceStrong();
            ecGenSpec = new ECGenParameterSpec(CURVE_NAME);
            keyGen_ = KeyPairGenerator.getInstance(KEY_ALGORITHM, PROVIDER);      
            
            // Generates a ECDSA key pair.
            keyGen_.initialize(ecGenSpec, random);            
            KeyPair kp = keyGen_.generateKeyPair();
           
            PublicKey publicKey = kp.getPublic(); //"pk" == "public key"
            PrivateKey secretKey = kp.getPrivate(); //"sk" == "secret key" == "private key"
            
            System.out.println(publicKey);
            System.out.println(secretKey);
       
            
            // Store the public key in a separate, unencrypted file as scrooge_sk.pem
	    String pkFilename = "scrooge_pk.pem";
	    StringWriter sw = new StringWriter();
            JcaPEMWriter wr = new JcaPEMWriter(sw);
            wr.writeObject(kp.getPublic());
            wr.close();
            Writer fw = new FileWriter(pkFilename);
            fw.write(sw.toString());
            fw.close();
            System.out.println("Public Key:\n" + sw.toString());
            
            
            // Stores the private key in an encrypted format on disk as scrooge_pk.pem
            String skFilename = "scrooge_sk.pem";
            JcaPEMWriter privWriter = new JcaPEMWriter(new FileWriter(skFilename));
            PEMEncryptor penc = (new JcePEMEncryptorBuilder("AES-256-CFB"))
					.build(password.toCharArray());
            privWriter.writeObject(secretKey, penc);
            privWriter.close();

	}
}
