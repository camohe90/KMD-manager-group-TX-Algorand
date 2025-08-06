import { AlgorandClient, algo} from '@algorandfoundation/algokit-utils';
import { KmdAccountManager} from '@algorandfoundation/algokit-utils/types/kmd-account-manager' 
import algosdk from 'algosdk';
import { KmdClient } from 'algosdk/dist/types/client/kmd';
 


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

       // Create an instance of the KMD account manager using the Algorand client
        const kmdManager = new KmdAccountManager(algorand.client);

        // Define the name for the master wallet account
        const walletName = 'MasterAccount1';

        // Create or retrieve the wallet account with the given name
        await kmdManager.getOrCreateWalletAccount(walletName);

        // Read the list of local wallets available in the KMD
        const readWallets = await listLocalWallets();

        // Get the ID of the first wallet in the list (assuming it's the one we want)
        const kmd_wallet = readWallets.wallets[0].id;

        // Initialize a wallet handle using the wallet ID and an empty password
        const handleResp = await kmdClient.initWalletHandle(kmd_wallet, '');

        // Store the wallet handle token for use in other KMD operations
        const walletHandle = handleResp.wallet_handle_token;
        console.log(walletHandle); // Log the wallet handle for debugging

        // Generate a new key (account) within the wallet
        const keyResp = await kmdClient.generateKey(walletHandle);

        // Log the newly generated account address
        console.log('Generated account address:', keyResp.address);

    
}

   main();