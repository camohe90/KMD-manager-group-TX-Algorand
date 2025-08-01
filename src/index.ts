import { algo, AlgorandClient } from '@algorandfoundation/algokit-utils'

import { encodeAddress } from 'algosdk';

import 'dotenv/config'


async function main() {

    const usdcAssetId = 10458941n
    const decimals = 6

    let algorand = AlgorandClient.testNet()
    const kmd = AlgorandClient.defaultLocalNet().client.kmd
    algorand = algorand.setDefaultValidityWindow(20)
    const account_1 = algorand.account.fromMnemonic(process.env.PASSPHRASE!)
    console.log('Account 1 :', encodeAddress(account_1.publicKey))

    // Create wallets in the KMD with ALIAS and PASSWORD

    //await kmd.createWallet('ACCOUNT_1', '1234')

    const wallet_list = await kmd.listWallets();
    console.log('Wallet list:', wallet_list);
    const kmd_wallet = wallet_list.wallets[0].id
    console.log('Wallet Id for the created account:', kmd_wallet);

    
    const handleResp = await kmd.initWalletHandle(kmd_wallet, '1234');
    const walletHandle = handleResp.wallet_handle_token;
    console.log(walletHandle)
  
    // const keyResp = await kmd.generateKey(walletHandle);
    // console.log('Generated account address:', keyResp.address);

    const keysResp = await kmd.listKeys(walletHandle);
    const account_2 = keysResp.addresses[0]
    console.log('All account addresses in wallet:', account_2);

    const payTx = await algorand.createTransaction.payment({
        sender: account_2,
        receiver: account_1,
        amount: algo(0.13),
        note: new Uint8Array(Buffer.from('KMD TX')),
        maxFee: algo(0.001)
      })


    const signedTxn = await kmd.signTransaction(walletHandle, '1234', payTx);

    // // signedTxn is a Uint8Array containing the signed transaction blob
    console.log('Signed transaction:', signedTxn);

    //await kmd.releaseWalletHandle(walletHandle);

    const txId = await algorand.client.algod.sendRawTransaction(signedTxn).do()
    console.log('Transaction sent! TxID:', txId)

}



main();


   