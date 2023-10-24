// Initialize web3 with MiniPay provider
function initializeWeb3() {
    if (window.ethereum && window.ethereum.isMiniPay) {
        return new Web3(window.ethereum);
    } else {
        const errorMsg = "MiniPay provider not detected";
        logToScreen(errorMsg);
        return null;
    }
}

const ERC20_ABI = [/*... (same as before) ...*/];

function logToScreen(message) {
    const logElement = document.getElementById("log");
    logElement.innerHTML += message + "<br>";
}

async function sendcUSD() {
    const web3 = initializeWeb3();

    if (!web3) {
        return;
    }

    let currentAccount;

    try {
        const accounts = await web3.eth.getAccounts();

        if (accounts.length === 0) {
            const errorMsg = "No accounts found. Make sure you are connected to the Ethereum network.";
            logToScreen(errorMsg);
            return;
        } else {
            currentAccount = accounts[0];
            const logMsg = "Current account: " + currentAccount;
            logToScreen(logMsg);
        }
    } catch (error) {
        logToScreen("Error fetching accounts: " + error.message);
        return;
    }

    fetch('credentials.json')
        .then(response => response.json())
        .then(data => {
            const privateKey = data.privateKey;
            const fromAddress = data.fromAddress;

            const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
            web3.eth.accounts.wallet.add(account);
            web3.eth.defaultAccount = fromAddress;

            const toAddress = currentAccount;
            
            const amount = "0.01";
            const cUSDTokenAddress = "0x765de816845861e75a25fca122bb6898b8b1282a";
            const cUSDContract = new web3.eth.Contract(ERC20_ABI, cUSDTokenAddress);
            const amountInWei = web3.utils.toWei(amount, 'ether');

            cUSDContract.methods.transfer(toAddress, amountInWei).send({ 
                from: fromAddress,
                feeCurrency: null
            })
            .on('transactionHash', hash => {
                logToScreen(`Transaction hash: ${hash}`);
            })
            .on('receipt', receipt => {
                logToScreen(`Transaction receipt: ${JSON.stringify(receipt)}`);
            })
            .on('error', error => {
                logToScreen(`Error: ${error}`);
            });
        })
        .catch(error => {
            logToScreen("Error reading the credentials file: " + error.message);
        });
}