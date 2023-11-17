const express = require('express');
const Web3 = require("web3");
const ContractKit = require("@celo/contractkit");
const fs = require('fs/promises');

const web3 = new Web3("https://forno.celo.org");
const kit = ContractKit.newKitFromWeb3(web3);

const app = express();

// serve files from the public directory
app.use(express.static('public'));
app.use(express.json());

// start the express web server listening on 8080
app.listen(8080, () => {
    console.log('listening on 8080');
});

// serve the homepage
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/convert', async (req, res) => {
    console.log(req.body.address, req.body.ebGoldAmount);
    try {
        let transactionResult = await sendcUSD(req.body.address, req.body.ebGoldAmount);
        res.json(transactionResult);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


async function postCeloTransaction(sourceAccount, recipientAddress, amount) {

    const web3 = new Web3("https://forno.celo.org");
    const kit = ContractKit.newKitFromWeb3(web3);

    // Add the source account to ContractKit
    kit.connection.addAccount(sourceAccount.privateKey);
    
    // Use ContractKit to get the cUSD stable token contract instance
    const celotoken = await kit.contracts.getStableToken();

    // Transfer the specified amount of cUSD to the recipient
    try {
        let celotx = await celotoken
            .transfer(recipientAddress, amount)
            .send({ from: sourceAccount.address });

        // Wait for the transaction to be processed and return the receipt
        const receipt = await celotx.waitReceipt();
        return { success: true, receipt: receipt };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function sendcUSD(currentAccount, ebGoldAmount) {
    try {
        const jsonString = await fs.readFile("./credentials.json", "utf8");
        const cred = JSON.parse(jsonString);

        const sourceAccount = {
            privateKey: cred.privateKey,
            address: cred.fromAddress
        };

        // Exchange rate: 0.001 cUSD for each 1000 gold
        const ExchangeRate = 0.001 / 1000;

        // Calculate the celoAmount
        const celoAmount = BigInt(Math.round(ebGoldAmount * ExchangeRate * 1e18));

        try {
            const receipt = await postCeloTransaction(sourceAccount, currentAccount, celoAmount);
            console.log(`Transaction receipt: ${JSON.stringify(receipt)}`);
            return receipt;
        } catch (error) {
            console.log(`Transaction error: ${error.message}`);
            return { success: false, error: error.message };
        }
    } catch (err) {
        console.log(`Error reading file or parsing JSON string: ${err.message}`);
        return { success: false, error: err.message };
    }
}