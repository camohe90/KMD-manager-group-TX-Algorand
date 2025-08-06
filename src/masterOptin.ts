import { AlgorandClient, algo} from '@algorandfoundation/algokit-utils';
import {KmdAccountManager} from '@algorandfoundation/algokit-utils/types/kmd-account-manager'


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


        // General Const
        const usdcAssetId = 10458941n

        
        async function main() {
            
            // Create an instance of the KMD account manager using the Algorand client
            const kmdManager = new KmdAccountManager(algorand.client);

            // Define the name of the wallet where accounts are stored
            const walletName = 'MasterAccount1';

            // Define the string to search for in the account addresses
            let searchString = "CHQFDROZSZITFRLEHIAQ775SPY66EZAXKRJZDQDSVXXPTFABUY47STWSSA";

            // Attempt to retrieve an account from the wallet that matches the search string in its address
            const account1 = await kmdManager.getWalletAccount(
                walletName,
                (a) => a.address.includes(searchString) // Match function to find the account
            );

            // Log whether a match was found
            if (account1) {
                console.log(`Matched account address: ${account1.addr}`);
            } else {
                console.log('No account matched the search string.');
            }

            // Perform an asset opt-in using the matched account
            // This allows the account to receive the specified asset (e.g., USDC)
            await algorand.send.assetOptIn({
                signer: account1!.signer,     // Signer object to authorize the transaction
                sender: account1!.addr,       // Account address initiating the opt-in
                assetId: usdcAssetId          // ID of the asset to opt into (e.g., USDC on testnet or mainnet)
            });
        }


        main();