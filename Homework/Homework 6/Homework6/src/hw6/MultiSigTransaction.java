package hw6;

import org.bitcoinj.core.InsufficientMoneyException;
import org.bitcoinj.core.Transaction;
import org.bitcoinj.crypto.DeterministicKey;
import org.bitcoinj.crypto.TransactionSignature;
import org.bitcoinj.kits.WalletAppKit;
import org.bitcoinj.script.Script;
import org.bitcoinj.script.ScriptBuilder;

import static org.bitcoinj.script.ScriptOpCodes.*;

import java.util.ArrayList;
import java.util.Random;


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
    	
    	ScriptBuilder builder = new ScriptBuilder();
		builder.op(OP_1);
		builder.data(key1.getPubKey());
		builder.data(key2.getPubKey());
		builder.data(key3.getPubKey());
		builder.op(OP_3);
		builder.op(OP_CHECKMULTISIG);
		return builder.build();
    }

    @Override
    public Script createUnlockingScript(Transaction unsignedTransaction) {
        //create a corresponding unlocking script.
    	ScriptBuilder builder = new ScriptBuilder();
		builder.smallNum(0);
		TransactionSignature txSig = sign(unsignedTransaction, key1);
		builder.data(txSig.encodeToBitcoin());
		return builder.build();    
	}

    public static void main(String[] args) throws InsufficientMoneyException, InterruptedException {
        WalletInitTest wit = new WalletInitTest();
        new MultiSigTransaction(wit.getKit()).run();
        wit.monitor();
    }

}