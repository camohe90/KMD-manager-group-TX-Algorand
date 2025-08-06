import { AlgorandClient, algo} from '@algorandfoundation/algokit-utils';
import { KmdAccountManager} from '@algorandfoundation/algokit-utils/types/kmd-account-manager' 
import { allOmitEmpty } from 'algosdk/dist/types/encoding/schema';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();
 
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

function writeEnvVariable(key: string, value: string, envPath: string) {
    const envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
    const regex = new RegExp(`^${key}=.*$`, 'm');

    let newContent;
    if (regex.test(envContent)) {
        // Update existing key
        newContent = envContent.replace(regex, `${key}=${value}`);
    } else {
        // Append new key
        newContent = envContent + `\n${key}=${value}`;
    }

    fs.writeFileSync(envPath, newContent.trim() + '\n', 'utf8');
    console.log(`✅ Saved ${key} to .env file`);
}


    async function getAccount(
    kmdManager: KmdAccountManager,
    accountName: string
    ) {
    try {
        const account = await kmdManager.getOrCreateWalletAccount(accountName, algo(0));
        console.log(`✅ Account retrieved (and funded if LocalNet): ${account.addr}`);
        return account;
    } catch (error: any) {
        // Handle specific LocalNet-only error
        if (error.message?.includes('LocalNet dispenser')) {
        console.warn(`⚠️ Skipping funding — likely not using LocalNet. Falling back to non-funded account creation.`);
        const fallbackAccount = await kmdManager.getOrCreateWalletAccount(accountName);
        console.log(`✅ Account retrieved (no funding): ${fallbackAccount.addr}`);
        return fallbackAccount;
        }

        // Handle any other unexpected error
        console.error(`❌ Could not retrieve or create account "${accountName}".`, error);
        return undefined;
    }
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

        const exportResult = await kmdClient.exportMasterDerivationKey(walletHandle, walletPassword);
        console.log('Raw MDK (Uint8Array):', masterDerivationKey);
        const mdkBase64 = Buffer.from(exportResult.master_derivation_key).toString('base64');

        // Write to .env file
        const envPath = path.resolve(process.cwd(), '.env');
        writeEnvVariable('MDK_BASE64', mdkBase64, envPath);
        writeEnvVariable('ACCOUNTMASTER', keysResp.addresses[0], envPath); 

        console.log("⚠️ Don't forget to add ALGOs to the wallet using https://bank.testnet.algorand.network ")
       

        // Always release the wallet handle after you're done to clean up
        await kmdClient.releaseWalletHandle(walletHandle);



    
}

   main();