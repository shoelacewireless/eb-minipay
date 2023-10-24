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

function logToScreen(message) {
    const logElement = document.getElementById("log");
    if (logElement) {
        logElement.innerHTML += message + "<br>";
    } else {
        console.error("Log element not found in DOM");
    }
}

async function postCeloTransaction(sourceAccount, recipientAddress, amount, web3Instance) {

    // Create ContractKit with web3's current provider
    const kit = newKitFromWeb3(web3Instance.currentProvider);

    // Add the source account to ContractKit
    kit.connection.addAccount(sourceAccount.privateKey);
    
    // Use ContractKit to get the cUSD stable token contract instance
    const celotoken = await kit.contracts.getStableToken();

    // Transfer the specified amount of cUSD to the recipient
    let celotx = await celotoken
    .transfer(recipientAddress, amount)
    .send({ from: sourceAccount.address });

    // Wait for the transaction to be processed and return the receipt
    return await celotx.waitReceipt();
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
            logToScreen("No accounts found. Make sure you are connected to the Ethereum network.");
            return;
        } else {
            currentAccount = accounts[0];
            logToScreen("Current account: " + currentAccount);
        }
    } catch (error) {
        logToScreen("Error fetching accounts: " + error.message);
        return;
    }

    fetch('credentials.json')
    .then(response => {
        if (!response.ok) {
            logToScreen("Network response was not ok");
            return;
        }
        return response.json();
    })
    .then(async data => {
        logToScreen("Fetched credentials successfully.");
        
        const sourceAccount = { 
            privateKey: data.privateKey,
            address: data.fromAddress
        };

        const amount = "0.001";
        
        try {
            const receipt = await postCeloTransaction(sourceAccount, currentAccount, amount, web3);
            logToScreen(`Transaction receipt: ${JSON.stringify(receipt)}`);
        } catch (error) {
            logToScreen(`Transaction error: ${error.message}`);
        }
    })
    .catch(error => {
        logToScreen("Error reading the credentials file: " + error.message);
    });
}