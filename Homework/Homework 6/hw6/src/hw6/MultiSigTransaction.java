package hw6;

import org.bitcoinj.core.InsufficientMoneyException;
import org.bitcoinj.core.Transaction;
import org.bitcoinj.crypto.DeterministicKey;
import org.bitcoinj.kits.WalletAppKit;
import org.bitcoinj.script.Script;

public class MultiSigTransaction extends ScriptTester {

    private DeterministicKey key1;
    private DeterministicKey key2;
    private DeterministicKey key3;

    public MultiSigTransaction(WalletAppKit kit) {
        super(kit);
        key1 = kit.wallet().freshReceiveKey();
        key2 = kit.wallet().freshReceiveKey();
        key3 = kit.wallet().freshReceiveKey();
    }

    @Override
    public Script createLockingScript() {
        //create a multisig locking script that unlocks when exactly one signature for one of the public keys (key1, key2, key3) are given
        return null;
    }

    @Override
    public Script createUnlockingScript(Transaction unsignedTransaction) {
        //create a corresponding unclocking script.
        return null;
    }

    public static void main(String[] args) throws InsufficientMoneyException, InterruptedException {
        WalletInitTest wit = new WalletInitTest();
        new MultiSigTransaction(wit.getKit()).run();
        wit.monitor();
    }

}
