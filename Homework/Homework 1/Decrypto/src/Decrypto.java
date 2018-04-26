
/**
 *
 * @author Shaowei
 */
import javax.xml.bind.DatatypeConverter;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;

public class Decrypto {

    public static void main(String[] args) throws NoSuchAlgorithmException, IOException {

        boolean found = false;
        int t = 1;

        while (found != true) {
            System.out.println("------- This is " + t + " times----------");
            //Convert idHex into a byte array. API requires omitting the leading "0x".
            String idHex = "ED00AF5F774E4135E7746419FEB65DE8AE17D6950C95CEC3891070FBB5B03C77";
            byte[] id = DatatypeConverter.parseHexBinary(idHex);
            System.out.println("# id: " + DatatypeConverter.printHexBinary(id));
            System.out.println("# hex digits in id: " + idHex.length());

            //Generate a pseudo-random 256-bit x.
            byte[] x = new byte[32]; //256 bit array
            new Random().nextBytes(x); //pseudo-random
            String xHex = DatatypeConverter.printHexBinary(x);
            System.out.println();
            System.out.println("x: " + xHex);
            System.out.println("# hex digits in x: " + xHex.length());
            System.out.println("# bits in x: " + x.length * 8);

            //Concatentate two byte arrays
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            outputStream.write(x);
            outputStream.write(id);
            byte concat[] = outputStream.toByteArray();
            String concatHex = DatatypeConverter.printHexBinary(concat);
            System.out.println();
            System.out.println("x concatenate id: " + concatHex);

            //Apply SHA-256 to hash x||id
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(concat); //SHA256 hash
            String hashHex = DatatypeConverter.printHexBinary(hash);
            System.out.println();
            System.out.println("Hash: " + hashHex);
            System.out.println("# hex digits in hash: " + hashHex.length());
            System.out.println("# bits in hash: " + hash.length * 8);

            //Check whether H (x ◦ id) contains Y or not 
            String val = DatatypeConverter.printHexBinary(hash);
            System.out.println(val);
            byte[] b = DatatypeConverter.parseHexBinary(val);
            System.out.println(DatatypeConverter.printHexBinary(b));
            for (byte a : b) {
                if (a == 0x1D) {
                    found = true;
                    System.out.println("Found!");
                }
            }
            t++;
            System.out.println("x in HEX will be " + xHex);
        }
        System.out.println("DONE in " + t + " times");
    }
}
