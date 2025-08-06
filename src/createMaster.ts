import { AlgorandClient, algo} from '@algorandfoundation/algokit-utils';
import { KmdAccountManager} from '@algorandfoundation/algokit-utils/types/kmd-account-manager' 
 
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


 async function getAccount(
            kmdManager: KmdAccountManager,
            accountName: string
        ){
            let account;

            try {
                account = await kmdManager.getOrCreateWalletAccount(accountName, algo(0));
                console.log(`Account retrieved: ${account.addr}`);
            } catch (error) {
                console.warn(`Could not retrieve or create account "${accountName}".`, error);
            }

            return String(account); // Return the account object instead of just the address
        }

    async function main() {
        
        // Create a KMD Account Manager instance using the Algorand client
        const kmdManager = new KmdAccountManager(algorand.client);

        // Create or retrieve an account named 'MasterAccount1' from the KMD wallet
        const accountCreated = await getAccount(kmdManager, 'MasterAccount1');
        console.log(accountCreated); // Log the created/retrieved account details

        const walletPassword = ''; // Password for the wallet (empty string if none set)

        // Get a list of all wallets managed by the local KMD
        const wallet_list = await kmdClient.listWallets();
        console.log('Wallet list:', wallet_list); // Log the list of wallets

        // Get the ID of the first wallet in the list
        const walletId = wallet_list.wallets[0].id;

        // Unlock the wallet using its ID and password to get a wallet handle token
        const handleResp = await kmdClient.initWalletHandle(walletId, walletPassword);
        const walletHandle = handleResp.wallet_handle_token;

        // List all account public keys (addresses) stored in the wallet
        const keysResp = await kmdClient.listKeys(walletHandle);
        console.log(keysResp); // Log the addresses in the wallet

        // Export the master derivation key (MDK) of the wallet
        const masterDerivationKey = await kmdClient.exportMasterDerivationKey(walletHandle, walletPassword);
        console.log(masterDerivationKey); // Log the raw MDK (as Uint8Array)

        // Always release the wallet handle after you're done to clean up
        await kmdClient.releaseWalletHandle(walletHandle);



    
}

   main();