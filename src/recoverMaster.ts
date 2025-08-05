import { AlgorandClient, algo} from '@algorandfoundation/algokit-utils';



    const algorand = AlgorandClient.fromConfig({
            algodConfig: {
                server: 'http://localhost',
                port: 4001,
                token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            },
            kmdConfig: {
                server: 'http://localhost',    // Local KMD
                port: 4002,
                token: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            },
            });


    const kmdClient = algorand.client.kmd;

    async function listLocalWallets() {
        const wallets = await kmdClient.listWallets();
        return wallets
    };



    async function main() {

       const walletMDK = new Uint8Array( [
             53,  66,   1, 121, 245,  96, 109, 113,
            157, 171,  21, 196, 213,  11, 191, 205,
            30, 184, 157, 153,  42, 142, 223, 141,
            16,  18, 241, 193,  50, 242, 165, 140
        ])
        

        const walletName = 'MasterAccount1'
        const walletPassword = '';

       await kmdClient.createWallet(walletName, walletPassword, walletMDK);

       const readWallets = await listLocalWallets()
        
        const kmd_wallet = readWallets.wallets[0].id

       console.log('Wallet Id for the created account:', kmd_wallet);
        const handleResp = await kmdClient.initWalletHandle(kmd_wallet, '');
        const walletHandle = handleResp.wallet_handle_token;
        console.log(walletHandle)

      
        const keyResp = await kmdClient.generateKey(walletHandle);
        console.log('Generated account address:', keyResp.address);
    
    
}

   main();