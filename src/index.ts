import { algo, AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk';


async function main() {

    const usdcAssetId = 10458941n
    const decimals = 6

    let algorand = AlgorandClient.testNet()
    const kmd = AlgorandClient.defaultLocalNet().client.kmd
    algorand = algorand.setDefaultValidityWindow(20)


    // Create wallets in the KMD with ALIAS and PASSWORD

    //await kmd.createWallet('ACCOUNT_2', '1234')

    // list all created wallets on the MKD

    const wallet_list = await kmd.listWallets();
    console.log('Wallet list:', wallet_list);

    // select the first wallet to be imported
    
    const kmd_wallet = wallet_list.wallets[0].id
    console.log('Wallet Id for the created account:', kmd_wallet);
    const handleResp = await kmd.initWalletHandle(kmd_wallet, '1234');
    const walletHandle = handleResp.wallet_handle_token;
    console.log(walletHandle)
  
    //const keyResp = await kmd.generateKey(walletHandle);
    //console.log('Generated account address:', keyResp.address);

    const keysResp = await kmd.listKeys(walletHandle);
    const account_2 = keysResp.addresses[0] // add funds on testnet using the dispenser https://bank.testnet.algorand.network/
    const account_3 = keysResp.addresses[1]
    console.log('Wallet 2:', account_2);
    console.log('Wallet 3:', account_3);

    const account_1 = "KUJC6CV6B2TXO6XOIVVAVM2RHETM3P3U7FZOPUQOOHTDQKWARXRXHKBXDY"

    const payTx = await algorand.createTransaction.payment({
        sender: account_2,
        receiver: account_1,
        amount: algo(0.13),
        note: new Uint8Array(Buffer.from('KMD TX')),
        maxFee: algo(0.001)
      })


    const signedTxn = await kmd.signTransaction(walletHandle, '1234', payTx);
    let txId = await algorand.client.algod.sendRawTransaction(signedTxn).do()
    console.log('Transaction sent! TxID:', txId)
    
    // const optInTx = await algorand.createTransaction.assetOptIn({sender:account_2, assetId: usdcAssetId})
    // const optInTxSignedTxn = await kmd.signTransaction(walletHandle, '1234', optInTx);
    // const txId_2 = await algorand.client.algod.sendRawTransaction(optInTxSignedTxn).do()
    // console.log('Transaction sent! TxID:', txId_2)

    // Step 1. Create raw transactions from algokit-utils
    const tx1 = await algorand.createTransaction.payment({
        sender: account_2,
        receiver: account_3,
        amount: algo(0.2),
        note: new Uint8Array(Buffer.from('Tx 1')),
        staticFee: algo(0.003)
        })

    const tx2 = await algorand.createTransaction.assetOptIn({
            sender:account_3, 
            assetId: usdcAssetId, 
            staticFee:algo(0)
        })
        
    const tx3 = await algorand.createTransaction.assetTransfer(
        {
            sender: account_2, 
            assetId: usdcAssetId, 
            amount: BigInt(0.1* 10 ** decimals), 
            receiver: account_3,
            staticFee:algo(0)
        }
    )

        // Step 2. Assign group ID
        algosdk.assignGroupID([tx1, tx2, tx3])

        // Step 3. Sign with KMD
        const signedTx1 = await kmd.signTransaction(walletHandle, '1234', tx1)
        const signedTx2 = await kmd.signTransaction(walletHandle, '1234', tx2)
        const signedTx3 = await kmd.signTransaction(walletHandle, '1234', tx3)
       

        // Step 4. Send group transaction
        const txIdFinal = await algorand.client.algod.sendRawTransaction([signedTx1, signedTx2,signedTx3]).do()

        console.log(`Group transaction sent! First TxID: ${txIdFinal.txid}`)



            

}



main();


   