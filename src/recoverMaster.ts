import { AlgorandClient, algo} from '@algorandfoundation/algokit-utils';



    const algorand = AlgorandClient.fromConfig({
           algodConfig: {
            server: 'https://testnet-api.algonode.cloud',  // TestNet endpoint
            port: 443,
            token: '', // Most public APIs (like AlgoNode) don't require a token
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
            8, 195, 106, 237, 175, 101, 178, 226,
            41, 109, 197,   9, 193,  28, 250,  21,
            70,  42,  43, 252,  68,  11, 235,  44,
            223,  56, 161,  24, 124, 147, 207, 244
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