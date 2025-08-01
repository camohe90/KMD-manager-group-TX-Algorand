import { AlgorandClient, algo } from '@algorandfoundation/algokit-utils';
import { KmdAccountManager} from '@algorandfoundation/algokit-utils/types/kmd-account-manager'
import { encodeAddress, Kmd } from 'algosdk';

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
        console.log('Local KMD wallets:', wallets);
        }
        
    async function main() {
        
        console.log("MAIN")
        const kmdManager = new KmdAccountManager(algorand.client);

        console.log(listLocalWallets() )

        const account1 = await kmdManager.getOrCreateWalletAccount('account1');
        // Add funds Algos on testnet using the dispenser https://bank.testnet.algorand.network/
        const account3 = await kmdManager.getOrCreateWalletAccount('account3');
    
       // Opt_in account1

        // await algorand.send.assetOptIn({
        //     signer:account1.signer,
        //     sender:account1.addr, 
        //     assetId: usdcAssetId
        // })

        // Add USDC on testnet to Account 1 using https://dispenser.testnet.aws.algodev.network/

        const groupTx = algorand.newGroup()

        groupTx.addPayment(
            {
                signer: account1.signer,
                sender: account1.addr,
                receiver: account3.addr,
                amount: algo(0.23),
                staticFee: algo(0.003)
            }
        )

        groupTx.addAssetOptIn(
            { 
                signer:account3.signer,
                sender:account3.addr, 
                assetId: usdcAssetId, //10458941n
                staticFee:algo(0) 
            })

        groupTx.addAssetTransfer(
            {
                signer:account1.signer,
                sender: account1.addr, 
                assetId: usdcAssetId, 
                amount: BigInt(0.1* 10 ** decimals), 
                receiver: account3.addr,
                staticFee:algo(0)
            }
        )

        const txResult = await groupTx.send()

        console.log(txResult.groupId)
    }

    
    main();