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

    //await kmd.createWallet('ACCOUNT_4', '1234')

    const wallet = await kmd.listWallets();
    console.log('Wallets lists:', wallet);

    const  {wallet_handle_token}  = await kmd.initWalletHandle('2c8554916c4278c0dcc1c57677a5920c', '1234')
    const walletAddress = await kmd.generateKey(wallet_handle_token)
    const keys = await kmd.generateKey(wallet_handle_token)

   


   


}




main();


   