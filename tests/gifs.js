const anchor = require('@project-serum/anchor');

// describe('gifs', () => {

//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.Provider.env());

//   it('start_stuff_off return ok', async () => {
//     // Add your test here.
//     const program = anchor.workspace.Gifs;
//     const tx = await program.rpc.startStuffOff();
//     console.log("Your transaction signature", tx);
//   });
// });

const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Gifs;

  const baseAccount = anchor.web3.Keypair.generate();

  const tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('GIF Count: ', account.totalGifs.toString());

  await program.rpc.addGif("https://media.giphy.com/media/5ZdW3tadQFppS/giphy.gif", {
    accounts: {
      baseAccount: baseAccount.publicKey,
    },
  });

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('GIF count: ', account.totalGifs.toString());
  console.log("Gif list: ", account.gifList);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
