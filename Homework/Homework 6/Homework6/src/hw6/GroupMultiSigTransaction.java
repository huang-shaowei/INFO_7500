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
        ScriptBuilder builder = new ScriptBuilder();
        builder.op(OP_1);
        builder.data(keyCus1.getPubKey());
        builder.data(keyCus2.getPubKey());
        builder.data(keyCus3.getPubKey());
        builder.op(OP_3);
        builder.op(OP_CHECKMULTISIGVERIFY);
        builder.data(keyBank.getPubKey());
        builder.op(OP_CHECKSIG);
        return builder.build();
    }

    @Override
    public Script createUnlockingScript(Transaction unsignedTransaction) {
        ScriptBuilder builder = new ScriptBuilder();
        TransactionSignature txSig;
        txSig = sign(unsignedTransaction, keyBank);
        builder.data(txSig.encodeToBitcoin());
        builder.smallNum(0);
        txSig = sign(unsignedTransaction, keyCus1);
        builder.data(txSig.encodeToBitcoin());
        return builder.build();
    }

    public static void main(String[] args) throws InsufficientMoneyException, InterruptedException {
        WalletInitTest wit = new WalletInitTest();
        new GroupMultiSigTransaction(wit.getKit()).run();
        wit.monitor();
    }

}
