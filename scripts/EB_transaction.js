// Initialize web3 with MiniPay provider
function initializeWeb3() {
    if (window.ethereum && window.ethereum.isMiniPay) {
        return new Web3(window.ethereum);
    } else {
        const errorMsg = "MiniPay provider not detected";
        console.error(errorMsg);
        return null;
    }
}

const ERC20_ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "_to", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "transfer",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {"name": "_spender", "type": "address"},
            {"name": "_value", "type": "uint256"}
        ],
        "name": "approve",
        "outputs": [{"name": "", "type": "bool"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {"name": "_owner", "type": "address"},
            {"name": "_spender", "type": "address"}
        ],
        "name": "allowance",
        "outputs": [{"name": "", "type": "uint256"}],
        "type": "function"
    }
];

async function sendcUSD() {
    const web3 = initializeWeb3();

    // If the web3 instance is null or no accounts are found, exit the function without executing the transaction
    if (!web3) {
        return;
    }

    let currentAccount;

    try {
        const accounts = await web3.eth.getAccounts();

        if (accounts.length === 0) {
            const errorMsg = "No accounts found. Make sure you are connected to the Ethereum network.";
            console.error(errorMsg);
            return; // Terminate the function if no accounts are found
        } else {
            currentAccount = accounts[0];
            const logMsg = "Current account: " + currentAccount;
            console.log(logMsg);
        }
    } catch (error) {
        console.error("Error fetching accounts:", error);
        return;
    }

    // Read from the JSON file
    fetch('credentials.json')
        .then(response => response.json())
        .then(data => {
            const privateKey = data.privateKey;
            const fromAddress = data.fromAddress;

            // Convert private key to account
            const account = web3.eth.accounts.privateKeyToAccount(privateKey);
            web3.eth.accounts.wallet.add(account);
            web3.eth.defaultAccount = fromAddress;

            // We now use the `currentAccount` variable as the toAddress for the transaction
            const toAddress = currentAccount;
            
            // Hardcoded amount for testing
            const amount = "0.01";

            const cUSDTokenAddress = "0x765de816845861e75a25fca122bb6898b8b1282a"; // Replace with your cUSD contract address
            const cUSDContract = new web3.eth.Contract(ERC20_ABI, cUSDTokenAddress);
            const amountInWei = web3.utils.toWei(amount, 'ether');

            // Sending cUSD
            cUSDContract.methods.transfer(toAddress, amountInWei).send({ 
                from: fromAddress,
                feeCurrency: null // Explicitly use CELO for gas fees
            })
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
            alert("Error reading the credentials file. Make sure it's in the root directory.");
        });
}