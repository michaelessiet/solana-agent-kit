import {
  createTransferInstruction,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";
import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
} from "@solana/web3.js";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import * as multisig from "@sqds/multisig";
import { SolanaAgentKit, signOrSendTX } from "solana-agent-kit";
const { Multisig } = multisig.accounts;

/**
 * Transfer SOL or SPL tokens to a recipient from a multisig vault.
 * @param agent - SolanaAgentKit instance.
 * @param amount - Amount to transfer.
 * @param to - Recipient's public key.
 * @param vaultIndex - Optional vault index, default is 0.
 * @param mint - Optional mint address for SPL tokens.
 * @returns Transaction signature.
 */
export async function multisig_transfer_from_treasury(
  agent: SolanaAgentKit,
  amount: number,
  to: PublicKey,
  vaultIndex: number = 0,
  mint?: PublicKey,
): Promise<Awaited<ReturnType<typeof signOrSendTX>>> {
  try {
    let transferInstruction: TransactionInstruction;

    const [multisigPda] = multisig.getMultisigPda({
      createKey: agent.wallet.publicKey,
    });
    const multisigInfo = await Multisig.fromAccountAddress(
      agent.connection,
      multisigPda,
    );
    const currentTransactionIndex = Number(multisigInfo.transactionIndex);
    const transactionIndex = BigInt(currentTransactionIndex + 1);
    const [vaultPda] = multisig.getVaultPda({
      multisigPda,
      index: vaultIndex,
    });

    if (!mint) {
      // Transfer native SOL
      transferInstruction = SystemProgram.transfer({
        fromPubkey: agent.wallet.publicKey,
        toPubkey: to,
        lamports: amount * LAMPORTS_PER_SOL,
      });
    } else {
      // Transfer SPL token
      const fromAta = await getAssociatedTokenAddress(mint, vaultPda, true);
      const toAta = await getAssociatedTokenAddress(mint, to, true);
      const mintInfo = await getMint(agent.connection, mint);
      const adjustedAmount = amount * Math.pow(10, mintInfo.decimals);

      transferInstruction = createTransferInstruction(
        fromAta,
        toAta,
        agent.wallet.publicKey,
        adjustedAmount,
      );
    }

    const transferMessage = new TransactionMessage({
      payerKey: vaultPda,
      recentBlockhash: (await agent.connection.getLatestBlockhash()).blockhash,
      instructions: [transferInstruction],
    });

    const multisigTx = multisig.transactions.vaultTransactionCreate({
      blockhash: (await agent.connection.getLatestBlockhash()).blockhash,
      feePayer: agent.wallet.publicKey,
      multisigPda,
      transactionIndex,
      creator: agent.wallet.publicKey,
      vaultIndex: 0,
      ephemeralSigners: 0,
      transactionMessage: transferMessage,
    });
    const { blockhash } = await agent.connection.getLatestBlockhash();
    multisigTx.message.recentBlockhash = blockhash;

    return await signOrSendTX(agent, multisigTx);
  } catch (error: any) {
    throw new Error(`Transfer failed: ${error}`);
  }
}
