package hw6;

import org.bitcoinj.core.Address;
import org.bitcoinj.core.InsufficientMoneyException;
import org.bitcoinj.core.Transaction;
import org.bitcoinj.crypto.DeterministicKey;
import org.bitcoinj.crypto.TransactionSignature;
import org.bitcoinj.kits.WalletAppKit;
import org.bitcoinj.script.Script;
import org.bitcoinj.script.ScriptBuilder;

import static org.bitcoinj.script.ScriptOpCodes.*;

public class PayToPubKeyHash extends ScriptTester {

    public PayToPubKeyHash(WalletAppKit kit) {
        super(kit);
    }

    @Override
    public Script createLockingScript() {
        return null;
    }

    @Override
    public Script createUnlockingScript(Transaction unsignedTransaction) {
        return null;
    }

    public static void main(String[] args) throws InsufficientMoneyException, InterruptedException {
        WalletInitTest wit = new WalletInitTest();
        new PayToPubKeyHash(wit.getKit()).run();
        wit.monitor();
    }

}
