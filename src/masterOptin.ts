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
        
        const kmdManager = new KmdAccountManager(algorand.client);
        
        const walletName = 'MasterAccount1'
        let searchString = "XBXJRUC4WP63T3SWPHPKFX76KAGAQ3CTIBQDM66HQTMBZAIQ52FL7F3G5E";

            // Retrieve an account whose address contains the search string

        const account1= await kmdManager.getWalletAccount(
            walletName,
            (a) => a.address.includes(searchString)
        );
        if (account1) {
            console.log(`Matched account address: ${account1.addr}`);
        } else {
            console.log('No account matched the search string.');
        }

        await algorand.send.assetOptIn({
            signer:account1!.signer,
            sender:account1!.addr, 
            assetId: usdcAssetId
        })




       
  
    }

    
    main();