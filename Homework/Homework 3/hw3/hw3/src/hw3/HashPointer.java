package hw3;

import hw3.Util;

import java.nio.ByteBuffer;
import java.nio.channels.InterruptibleChannel;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.SignatureException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

public class HashPointer {
	private byte[] hash;
	private int ledgerIndex;

	public HashPointer(byte[] h, int ledgerIndex) {
		if (h == null) throw new RuntimeException();
		this.hash = Arrays.copyOf(h, h.length);
		this.ledgerIndex = ledgerIndex;
	}

	public int getLedgerIndex() {
		return ledgerIndex;
	}

	public byte[] getHash() {
		return Arrays.copyOf(hash, hash.length);
	}

	@Override
	public int hashCode() {
		return Objects.hash(Arrays.hashCode(hash), ledgerIndex);
	}

	@Override
	public boolean equals(Object o) {
		if (!(o instanceof HashPointer)) return false;
		HashPointer p = (HashPointer) o;
		return Arrays.equals(hash, p.hash) && ledgerIndex == p.ledgerIndex;
	}

}
