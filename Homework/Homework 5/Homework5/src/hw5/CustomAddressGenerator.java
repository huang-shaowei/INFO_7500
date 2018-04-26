package hw5;

import com.google.common.base.CharMatcher;
import java.text.NumberFormat;
import java.util.Locale;
import org.bitcoinj.core.ECKey;
import org.bitcoinj.core.NetworkParameters;
import org.bitcoinj.params.MainNetParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CustomAddressGenerator {
        
        private static final Logger log = LoggerFactory.getLogger(CustomAddressGenerator.class);
        private static final NetworkParameters netParams = MainNetParams.get();
        private static final int BTC_ADDRESS_MAX_LENGTH = 35;
        private static long attempts;
        
        private static boolean isValidBCTAddressSubstring(final String substring) {
            boolean validity = true;
            if (!CharMatcher.JAVA_LETTER_OR_DIGIT.matchesAllOf(substring) || 
                    substring.length() > BTC_ADDRESS_MAX_LENGTH || 
                    CharMatcher.anyOf("OIl0").matchesAnyOf(substring)) {
                validity = false;
            }
            
            return validity;
        }
        
        public static ECKey get (String prefix) {
            if (isValidBCTAddressSubstring(prefix)) {
                ECKey key;
                log.debug("Searching for a bitcoin address that starts with: " + prefix);
                
                do {
                    key = new ECKey();
                    attempts++;
                } while (!(key.toAddress(netParams).toString().startsWith(prefix)));
                log.debug("Exiting thread " + Thread.currentThread().getName() + ", Attempths made: " 
                            + NumberFormat.getNumberInstance(Locale.US).format(attempts));
                return key;             
            }
            
            else {
                System.out.println("Your prefix contains illegal characters!");
                return null;
            }
        }
	
	public static void main(String args[]) {
            ECKey key = get("1HUAN");
            System.out.println("Address: " + key.toAddress(netParams));
            System.out.println("Private Key: " + key.getPrivKey());
	}

}
