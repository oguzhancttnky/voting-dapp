import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

import AddVoter from './components/AddVoter';
import AddCandidate from './components/AddCandidate';
import StartElection from './components/StartElection';
import Vote from './components/Vote';
import Winner from './components/Winner';

import detectEthereumProvider from '@metamask/detect-provider';
import VotingTokenABI from './VotingTokenABI.json';

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [electionName, setElectionName] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  const contractAddress = 'CONTRACT_ADDRESS'; // Your contract address

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0]);
        window.location.reload();
      });
    }
    const loadWeb3 = async () => {
      const provider = await detectEthereumProvider();
      if (provider) {
        await provider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(provider);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const contractInstance = new web3.eth.Contract(VotingTokenABI, contractAddress);
        setContract(contractInstance);

        const ownerAddress = await contractInstance.methods.owner().call();
        setElectionName(await contractInstance.methods.electionName().call());

        setIsOwner(accounts[0] === ownerAddress);
      }
    };
    loadWeb3();
  }, [account]);

  return (
    <div>
      <h1>{electionName} Election</h1>
      <p>Current Account: {account}</p>
      {isOwner && <p>You are the contract owner</p>}
      {isOwner && <AddVoter contract={contract} account={account} />}
      {isOwner && <AddCandidate contract={contract} account={account} />}
      {isOwner && <StartElection contract={contract} account={account} />}
      {!isOwner && <Vote contract={contract} account={account} />}
      {!isOwner && <Winner contract={contract} />}
    </div>
  );
};

export default App;
