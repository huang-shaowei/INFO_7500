package hw6;

import org.bitcoinj.core.InsufficientMoneyException;
import org.bitcoinj.core.Transaction;
import org.bitcoinj.crypto.DeterministicKey;
import org.bitcoinj.crypto.TransactionSignature;
import org.bitcoinj.kits.WalletAppKit;
import org.bitcoinj.script.Script;
import org.bitcoinj.script.ScriptBuilder;

import static org.bitcoinj.script.ScriptOpCodes.*;

public class GroupMultiSigTransaction extends ScriptTester {

    private DeterministicKey keyBank;
    private DeterministicKey keyCus1;
    private DeterministicKey keyCus2;
    private DeterministicKey keyCus3;

    public GroupMultiSigTransaction(WalletAppKit kit) {
        super(kit);
        keyBank = kit.wallet().freshReceiveKey();
        keyCus1 = kit.wallet().freshReceiveKey();
        keyCus2 = kit.wallet().freshReceiveKey();
        keyCus3 = kit.wallet().freshReceiveKey();
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
        new GroupMultiSigTransaction(wit.getKit()).run();
        wit.monitor();
    }

}
