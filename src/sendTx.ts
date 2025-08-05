import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils';
import {KmdAccountManager} from '@algorandfoundation/algokit-utils/types/kmd-account-manager'
import algosdk from 'algosdk';



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

        // Access clients
        const algodClient = algorand.client.algod;
        const kmdClient = algorand.client.kmd;

        // General Const
        const usdcAssetId = 10458941n
        const decimals = 6

        // Get TestNet status
        async function checkStatus() {
        const status = await algodClient.status().do();
        console.log('TestNet status:', status);
        }

        // Get list wallets in local KMD
        async function listLocalWallets() {
        const wallets = await kmdClient.listWallets();
        return wallets;
        }
        
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
        
        searchString = "XG2LWX2425QUQV6S7BOGSKQQTJLTO6RL4AXHTUA2AWNQTBSZCM6DGJSPIU";

            // Retrieve an account whose address contains the search string

        const account2= await kmdManager.getWalletAccount(
            walletName,
            (a) => a.address.includes(searchString)
        );
        if (account2) {
            console.log(`Matched account address: ${account2.addr}`);
        } else {
            console.log('No account matched the search string.');
        }
    

        const groupTx = algorand.newGroup()

        groupTx.addPayment(
            {
                signer: account1!.signer,
                sender: account1!.addr,
                receiver: account2!.addr,
                amount: algo(0.20),
                staticFee: algo(0.003)
            }
        )

        groupTx.addAssetOptIn(
            { 
                signer:account2!.signer,
                sender:account2!.addr, 
                assetId: usdcAssetId, //10458941n
                staticFee:algo(0) 
            })

        groupTx.addAssetTransfer(
            {
                signer:account1!.signer,
                sender: account1!.addr, 
                assetId: usdcAssetId, 
                amount: BigInt(0.1* 10 ** decimals), 
                receiver: account2!.addr,
                staticFee:algo(0)
            }
        )

        const txResult = await groupTx.send()

       console.log(txResult.groupId)
    }

    
    main();