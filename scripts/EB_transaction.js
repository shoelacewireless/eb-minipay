// EB_transaction.js
const provider = "YOUR_INFURA_URL";
const web3 = new Web3(new Web3.providers.HttpProvider(provider));

async function sendcUSD() {
    // Read from the text file (Note: this method only works locally due to browser security restrictions)
    fetch('credentials.txt')
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');
            const privateKey = lines[0].split('=')[1].trim();
            const fromAddress = lines[1].split('=')[1].trim();

            // Convert private key to account
            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            web3.eth.accounts.wallet.add(account);
            web3.eth.defaultAccount = fromAddress;

            // The rest of the send function here...
            const toAddress = prompt("Enter recipient address:");
            const amount = prompt("Enter amount of cUSD:");

            const cUSDTokenAddress = "CUSDTOKEN_CONTRACT_ADDRESS"; // Replace with your cUSD contract address
            const cUSDContract = new web3.eth.Contract(ERC20_ABI, cUSDTokenAddress);
            const amountInWei = web3.utils.toWei(amount, 'ether');

            // Sending cUSD
            cUSDContract.methods.transfer(toAddress, amountInWei).send({ from: fromAddress })
                .on('transactionHash', hash => {
                    alert(`Transaction hash: ${hash}`);
                })
                .on('receipt', receipt => {
                    alert(`Transaction receipt: ${JSON.stringify(receipt)}`);
                })
                .on('error', error => {
                    alert(`Error: ${error}`);
                });
        })
        .catch(error => {
            alert("Error reading the credentials file. Make sure it's in the same directory as this HTML file.");
        });
}