document.addEventListener("DOMContentLoaded", function() {
    
    // Initialize web3 with MiniPay provider
    function initializeWeb3() {
        if (window.ethereum && window.ethereum.isMiniPay) {
            return new Web3(window.ethereum);
        } else {
            const errorMsg = "MiniPay provider not detected";
            console.error(errorMsg);
            updateConsoleOutput(errorMsg, 'error');
            return null;
        }
    }

    // Function to update the console output in the HTML
    function updateConsoleOutput(message, type = 'log') {
        const consoleElem = document.getElementById('consoleOutput');
        let formattedMessage = message;

        switch (type) {
            case 'error':
                formattedMessage = `Error: ${message}`;
                break;
            case 'log':
            default:
                break;
        }

        consoleElem.textContent += "\n" + formattedMessage; // Add new messages without removing old ones
    }

    function logToConsoleAndOutput(message) {
        console.log(message);
        updateConsoleOutput(message, 'log');
    }

    function errorToConsoleAndOutput(errorMsg) {
        console.error(errorMsg);
        updateConsoleOutput(errorMsg, 'error');
    }

    // Initialize the web3 instance
    const web3 = initializeWeb3();

    // If web3 is initialized, fetch the account details
    if (web3) {
        web3.eth.getAccounts().then(accounts => {
            if (accounts.length === 0) {
                const errorMsg = "No accounts found. Make sure you are connected to the Ethereum network.";
                console.error(errorMsg);
                updateConsoleOutput(errorMsg, 'error');
            } else {
                const currentAccount = accounts[0];
                const logMsg = "Current account: " + currentAccount;
                console.log(logMsg);
                updateConsoleOutput(logMsg);
            }
        });
    }

    async function enableAccounts() {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
    }

    async function sendTransaction() {
        if(!web3) {
            errorToConsoleAndOutput("Web3 is not initialized.");
            return;
        }

        const fromAddress = await enableAccounts();

        const tx = {
            from: fromAddress,
            to: 'RECIPIENT_ADDRESS', // Make sure to replace with your desired address
            value: web3.utils.toWei('0.1', 'ether'),
            gas: 21000,
        };

        web3.eth.sendTransaction(tx)
            .on('transactionHash', function(hash){
                logToConsoleAndOutput('Transaction Hash: ' + hash);
            })
            .on('confirmation', function(confirmationNumber, receipt){
                logToConsoleAndOutput('Confirmation: ' + confirmationNumber);
            })
            .on('receipt', function(receipt){
                logToConsoleAndOutput('Receipt: ' + JSON.stringify(receipt));
            })
            .on('error', function(error){
                errorToConsoleAndOutput('Error: ' + error.message);
            });
    }

    // Expose to global context for use in HTML
    window.initiateTransaction = function() {
        sendTransaction();
    };

    // Existing conversion logic
    document.getElementById("conversionButton").addEventListener("click", function() {
        const ebGold = document.getElementById("ebGoldInput").value;
        const conversionRate = 0.00001; 
        const cUSD = ebGold * conversionRate;
        document.getElementById("cUSDValue").innerText = cUSD.toFixed(2);
    });
});
