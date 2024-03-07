import { AccountObject, Web3 } from "web3";
import { INFURA_ID } from "./config";

import dotenv from "dotenv";

dotenv.config();

//private RPC endpoint
export const web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_ID}`);

//or public RPC endpoint
//const web3 = new Web3('https://eth.llamarpc.com');

export async function getBlockNumber() {
  const info = await web3.eth.getBlockNumber();
  // ↳ 18849658n
  console.log(info);
}

export async function getBalance(walletAddress: string) {
  await web3.eth.getBalance(walletAddress);
}

export async function createWallet() {
  return web3.eth.accounts.wallet.create(1);
}

export async function addPrivateKey(privateKey: string) {
  //the private key must start with the '0x' prefix
  const account = web3.eth.accounts.wallet.add(privateKey);

  console.log(account[0].address);
  //↳ 0xcE6A5235d6033341972782a15289277E85E5b305

  console.log(account[0].privateKey);
  //↳ 0x50d349f5cf627d44858d6fcb6fbf15d27457d35c58ba2d5cfeaf455f25db5bec
}

export async function sendTransaction(to: string) {
  //add an account to a wallet
  const account = web3.eth.accounts.wallet.add(
    "0x50d349f5cf627d44858d6fcb6fbf15d27457d35c58ba2d5cfeaf455f25db5bec"
  );

  //create transaction object to send 1 eth to '0xa32...c94' address from the account[0]
  const tx = {
    from: account[0].address,
    to,
    value: web3.utils.toWei("1", "ether"),
  };
  //the `from` address must match the one previously added with wallet.add

  //send the transaction
  const txReceipt = await web3.eth.sendTransaction(tx);

  console.log("Tx hash:", txReceipt.transactionHash);
  // ↳ Tx hash: 0x03c844b069646e08af1b6f31519a36e3e08452b198ef9f6ce0f0ccafd5e3ae0e
}

export async function instantiateContract(address: string) {
  //you can find the complete ABI in etherscan.io
  const ABI = [
    {
      name: "symbol",
      outputs: [{ type: "string" }],
      type: "function",
    },
    {
      name: "totalSupply",
      outputs: [{ type: "uint256" }],
      type: "function",
    },
  ];

  //instantiate the contract
  const contract = new web3.eth.Contract(ABI, address);

  return contract;
}
