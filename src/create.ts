import algosdk from 'algosdk';

async function main(){

     // Account creation
     const account = algosdk.generateAccount();
     
     console.log('Mnemonic', algosdk.secretKeyToMnemonic(account.sk));
     console.log('Address', account.addr);
     console.log('Address', account.sk);
    }

main().then();