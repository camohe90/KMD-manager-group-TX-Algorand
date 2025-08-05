import { AlgorandClient, algo} from '@algorandfoundation/algokit-utils';
import { KmdAccountManager} from '@algorandfoundation/algokit-utils/types/kmd-account-manager' 
import algosdk from 'algosdk';
import { KmdClient } from 'algosdk/dist/types/client/kmd';
 


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

        const kmdManager = new KmdAccountManager(algorand.client);
       


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