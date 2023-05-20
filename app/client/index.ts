// Anchor Client
import * as anchor from "@coral-xyz/anchor";
import { AnchorCounterProgram } from "./idl/anchor_counter_program"; // imported after compiling and deploying program
import idlJson from "./idl/anchor_counter_program.json"; // imported after compiling and deploying program


import * as web3 from "@solana/web3.js"
import { initializeSolSignerKeypair, airdropSolIfNeeded } from "./initializeKeypair" // for creating and saving userKeypair as well as airdrop SOL if needed
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

// call greet()
initializeOrGreet().then(() => {
    console.log('Finished successfully')
    process.exit(0)
  }).catch(error => {
    console.log(error)
    process.exit(1)
  })


async function initializeOrGreet() {

    // // Set up a connection to blockchain cluster
    const cluster = 'devnet'
    const connection = new web3.Connection(web3.clusterApiUrl(cluster), 'confirmed')



    // Create user keypair and airdrop SOL if needed
    const userKeypair = initializeSolSignerKeypair()
    await airdropSolIfNeeded(connection, userKeypair.publicKey, 2, 0.05)

    // Set up Anchor provider and program
    const nodeWallet = new NodeWallet(userKeypair)
    const provider = new anchor.AnchorProvider(connection, nodeWallet, anchor.AnchorProvider.defaultOptions())
    const program = new anchor.Program<AnchorCounterProgram>(idlJson as any, idlJson.metadata.address, provider)
  
    const [greetingPda, bump] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("greeting_account"), userKeypair.publicKey.toBuffer()],
      program.programId
    );
  
    // Send transaction
    console.log(`Sending transaction with commitment level '${program.provider.connection.commitment}' to program ${program.programId} ...`);
    const txHash = await program.methods
      .initializeOrGreet()
      .accounts({
        greetingAccount: greetingPda,
        signer: userKeypair.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([userKeypair])
      .rpc();
    console.log(`Use 'solana confirm -v ${txHash}' to see the logs \n`);
  
    // Confirm transaction
    await program.provider.connection.confirmTransaction(txHash);
  
    // Fetch the created account
    const greetingAccount = await program.account.greetingAccount.fetch(greetingPda);
  
    const greetingAccountInfo = await program.provider.connection.getAccountInfo(greetingPda);
  
    console.log(
      `On-chain account ${greetingPda}'s data field 'counter': ${greetingAccount.counter.toString()} \n`
    );
  }
  
  