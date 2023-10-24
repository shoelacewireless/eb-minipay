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

const ERC20_ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
];

function logToScreen(message) {
    const logElement = document.getElementById("log");
    if (logElement) {
        logElement.innerHTML += message + "<br>";
    } else {
        console.error("Log element not found in DOM");
    }
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
        .then(response => {
        if (!response.ok) {
            logToScreen("Network response was not ok");
        }
        return response.json();
        })
        .then(data => {

            logToScreen("Fetched credentials successfully.");

            const privateKey = data.privateKey;
            const fromAddress = data.fromAddress;

            if (!privateKey || !fromAddress) {
                logToScreen("Private key or fromAddress missing in credentials file.");
            }

            const account = web3.eth.accounts.privateKeyToAccount('0x' + privateKey);
            web3.eth.accounts.wallet.add(account);
            web3.eth.defaultAccount = fromAddress;
            logToScreen("Private key added to wallet successfully.");

            const toAddress = currentAccount;
            
            const amount = "0.01";
            const cUSDTokenAddress = "0x765de816845861e75a25fca122bb6898b8b1282a";
            const cUSDContract = new web3.eth.Contract(ERC20_ABI, cUSDTokenAddress);
            const amountInWei = web3.utils.toWei(amount, 'ether');

            logToScreen("Attempting to send cUSD...");

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
            })
            .catch(error => {
                logToScreen(`Promise rejection: ${error.message}`);
            });
        })
        .catch(error => {
            logToScreen("Error reading the credentials file: " + error.message);
        });
}