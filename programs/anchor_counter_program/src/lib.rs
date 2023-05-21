use anchor_lang::prelude::*;



// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("BNoJPjrAtDJNhynak4rYUtUbGytaSJrRKpdg6iHxgzbs");

#[program]
pub mod anchor_counter_program {
    use super::*;

    pub fn initialize_or_greet(ctx: Context<InitializeOrGreet>) -> Result<()> {
        ctx.accounts.greeting_account.counter += 1;

        msg!(
            "Changed data of {} to: {}!",
            ctx.accounts.greeting_account.key(),
            ctx.accounts.greeting_account.counter
        ); // Message will show up in the tx logs
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeOrGreet<'info> {
    // We must specify the space in order to initialize an account.
    // First 8 bytes are default account discriminator,
    // next 8 bytes come from GreetingAccount.counter being type u64.
    // (u64 = 64 bits unsigned integer = 8 bytes)
    #[account(
        init_if_needed, 
        payer = signer, 
        seeds = [b"greeting_account", signer.key().as_ref()], 
        bump, 
        space = 8 + 8)]
    pub greeting_account: Account<'info, GreetingAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct GreetingAccount {
    counter: u64,
}
