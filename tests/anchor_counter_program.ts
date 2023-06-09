import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorCounterProgram } from "../target/types/anchor_counter_program";
import * as fs from "fs";
import dotenv from "dotenv";
import { assert } from "chai";
dotenv.config();

// Initialize Keypair for SOL
function initializeSolSignerKeypair(): web3.Keypair {
  console.log("Checking SOL keypair in .env file");

  if (!process.env.PRIVATE_KEY) {
    const signer = web3.Keypair.generate();

    // Append the new key-value pair to the contents of the .env file
    console.log(`New SOL Public Key: ${signer.publicKey}`);
    fs.writeFileSync(".env", `PRIVATE_KEY=[${signer.secretKey.toString()}]\n`);

    return signer;
  }

  const secret = JSON.parse(process.env.PRIVATE_KEY ?? "") as number[];
  const secretKey = Uint8Array.from(secret);
  const keypairFromSecretKey = web3.Keypair.fromSecretKey(secretKey);
  console.log(`\rCurrent SOL Public Key: ${keypairFromSecretKey.publicKey}`);

  return keypairFromSecretKey;
}

// Airdrop 1 SOL
const airdrop1Sol = async (
  program: Program<AnchorCounterProgram>,
  pubkey: web3.PublicKey
) => {
  await program.provider.connection.confirmTransaction(
    await program.provider.connection.requestAirdrop(pubkey, 1e9)
  );
};

// Find PDA
const getGreetingPda = (
  program: anchor.Program<AnchorCounterProgram>,
  userPubkey: web3.PublicKey
) => {
  const [userInfo, _userInfoBump] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(anchor.utils.bytes.utf8.encode("greeting_account")),
      userPubkey.toBuffer(),
    ],
    program.programId
  );
  return userInfo;
};

// Test script for anchor_counter_program
describe("anchor_counter_program", async () => {
  // Set up Anchor configuration
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace
    .AnchorCounterProgram as Program<AnchorCounterProgram>;

  // Initialize or use private key in .env file
  const user = initializeSolSignerKeypair();

  // Testing initializeOrGreet instruction
  it("initializeOrGreet", async () => {
    // Check user balance, and airdrop 1 SOL if needed
    const currUserInfo = await program.provider.connection.getAccountInfo(
      user.publicKey
    );
    if (currUserInfo)
      console.log(
        `Current balance: ${currUserInfo.lamports / web3.LAMPORTS_PER_SOL}`
      );
    if (!currUserInfo || currUserInfo.lamports < web3.LAMPORTS_PER_SOL) {
      console.log(`\rAirdropping 1 SOL ...`);
      await airdrop1Sol(program, user.publicKey);
      const latestUserInfo = await program.provider.connection.getAccountInfo(
        user.publicKey
      );
      console.log(
        `\Latest balance: ${latestUserInfo.lamports / web3.LAMPORTS_PER_SOL}`
      );
    }

    // Find PDA for greeting account
    const greetingPda = getGreetingPda(program, user.publicKey);

    const tx1 = await program.methods
      .initializeOrGreet()
      .accounts({
        greetingAccount: greetingPda,
        signer: user.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const greetingAccountInfo1 = await program.account.greetingAccount.fetch(
      greetingPda
    );

    assert.ok(Number(greetingAccountInfo1.counter) === 1);

    const tx2 = await program.methods
      .initializeOrGreet()
      .accounts({
        greetingAccount: greetingPda,
        signer: user.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const greetingAccountInfo2 = await program.account.greetingAccount.fetch(
      greetingPda
    );

    assert.ok(Number(greetingAccountInfo2.counter) === 2);
  });
});
