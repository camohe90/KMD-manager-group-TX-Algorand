import { AlgorandClient, algo} from '@algorandfoundation/algokit-utils';
import dotenv from 'dotenv';


dotenv.config(); // Loads .env into process.env

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

        const mdkBase64 = process.env.MDK_BASE64;

        if (!mdkBase64) {
             throw new Error('MDK_BASE64 is not defined in .env');
        }       

        // ✅ Convert Base64 string to Uint8Array
        const walletMDK = Uint8Array.from(Buffer.from(mdkBase64, 'base64'));

        console.log('Decoded MDK as Uint8Array:', walletMDK);

       
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