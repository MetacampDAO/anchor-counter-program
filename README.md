# anchor-counter-program
A web3 counter program built with Anchor
# Deploy your own version 🛠
- `git clone` the repo 
- Make sure you have `solana-cli` installed, keypair configured, and at least 2 sol on devnet beforehand
- Update path to your keypair in `Anchor.toml` that begins with `wallet =`
- Run `anchor build` to build the programs
- We need to update the program IDs:
    - Run `solana-keygen pubkey ./target/deploy/anchor_counter_program.json` - replace the old prog ID (`BNoJPjrAtDJNhynak4rYUtUbGytaSJrRKpdg6iHxgzbs`) with the newly generated prog ID in the following locations:
        - `./Anchor.toml`
        - `./programs/anchor_counter_program/src/lib.rs`
        - `./src/index.ts`
- Run `anchor build` to build one more time
- (!) IMPORTANT - run `yarn` inside the root of the repo
- Run `anchor test` to test