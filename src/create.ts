import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils';
import { KmdAccountManager} from '@algorandfoundation/algokit-utils/types/kmd-account-manager' 
 


 async function getAccount(
            kmdManager: KmdAccountManager,
            accountName: string
        ) {
            let account;

            try {
                account = await kmdManager.getOrCreateWalletAccount(accountName, algo(0));
                //console.log(`Account retrieved: ${account.addr}`);
            } catch (error) {
                console.warn(`Could not retrieve or create account "${accountName}".`, error);
            }

            return account; // Return the account object instead of just the address
        }

    async function main() {
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

        // Access clients
        const kmdManager = new KmdAccountManager(algorand.client);

        getAccount(kmdManager, 'account6')
}

   main();