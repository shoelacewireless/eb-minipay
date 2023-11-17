// Initialize web3 with MiniPay provider
function initializeWeb3() {
    if (window.ethereum && window.ethereum.isMiniPay) {
        return new Web3(window.ethereum);
    } else {
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

let eb_wallet_gold = 10000
const cusd_rate = 0.001
const gold_rate = 1000

async function sendcUSD() {

    const web3 = initializeWeb3();

    if (!web3) {
        return { success: false, error: "MiniPay not detected" };
    }

    let currentAccount;
    try {
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            return { success: false, error: "No accounts found. Make sure you are connected to the Ethereum network."};
            return;
        } else {
            currentAccount = accounts[0];
        }
    } catch (error) {
        return { success: false, error: error.message };
    }

    eb_wallet_gold = revertKFormat(document.getElementById('eb_wallet_gold').innerHTML);

    //TODO: Use backend to validate wallet funds
    let inputFieldGold = document.getElementById('eb_gold_value');
    if(inputFieldGold > eb_wallet_gold) {
        return { success: false, error: "Not enough EcoBytes Gold funds!" };
    }

    let goldCurrentValue = parseInt(inputFieldGold.value.replace(/,/g, ''), 10);

    try {
        const response = await fetch("http://eb-minipay-demo.shoelacewireless.com:8080/convert", {
            method: "POST",
            body: JSON.stringify({ address: currentAccount, ebGoldAmount: goldCurrentValue }),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        });
        const json = await response.json();

        updateWalletValue();
        resetConvertValues();

        return { success: true, data: json };
    } catch (error) {
        console.error('Fetch error:', error);
        return { success: false, error: "Transaction failed" };
    }
}

//MARK: conversion UI functions
function kFormatter(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'K' : Math.sign(num)*Math.abs(num)
}

function revertKFormat(value) {
    if (typeof value === 'string' && value.includes('K')) {
        return parseFloat(value.replace('K', '')) * 1000;
    }
    return parseInt(value, 10);
}

function resetConvertValues() {
    document.getElementById('eb_gold_value').value = gold_rate;
    document.getElementById('cusd_value').value = cusd_rate;
}

function updateWalletValue() {
    let inputFieldGold = document.getElementById('eb_gold_value');
    let goldCurrentValue = parseInt(inputFieldGold.value.replace(/,/g, ''), 10);

    let newWalletValue = eb_wallet_gold - goldCurrentValue

    if(newWalletValue < 0) {
        eb_wallet_gold = eb_wallet_gold
        alert ("Not enough EcoBytes Gold funds!");
    } else {
        eb_wallet_gold = newWalletValue
    }

    document.getElementById('eb_wallet_gold').innerHTML = kFormatter(eb_wallet_gold);
}

function updateConversionValues(change) {
    let inputFieldGold = document.getElementById('eb_gold_value');
    let inputFieldCusd = document.getElementById('cusd_value');
    let goldCurrentValue = parseInt(inputFieldGold.value.replace(/,/g, ''), 10);
    let cusdCurrentValue = parseFloat(inputFieldCusd.value.replace(/,/g, ''));
    let goldNewValue = goldCurrentValue + change;

    let cusdChange = 0
    if(change >= 0) {
        cusdChange = cusd_rate
    } else {
        cusdChange = -cusd_rate
    }
    let cusdNewValue = cusdCurrentValue + cusdChange

    if (goldNewValue >= gold_rate && goldNewValue <= eb_wallet_gold) {
        inputFieldGold.value = goldNewValue.toLocaleString();
        inputFieldCusd.value = parseFloat(cusdNewValue.toFixed(3)).toString();
    }
}