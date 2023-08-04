import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import RenewableEnergyCreditTrading from '../artifacts/contracts/RenewableEnergyCreditTrading.sol/RenewableEnergyCreditTrading.json';
import RenewableEnergyRegistry from '../artifacts/contracts/RenewableEnergyRegistry.sol/RenewableEnergyRegistry.json';


const networkId = 1337n; // Replace with the network ID where your contracts are deployed
const tradingContractAddress = '0x6c6bD2684F5bAB333000eED5c0bcF5FD597De84e';
const registryContractAddress = '0x74A6dfa2f17140AfB440FC33b3907c40ddf927d7';

const App = () => {
const [account, setAccount] = useState('');
const [web3Provider, setWeb3Provider] = useState(null);
const [tradingContract, setTradingContract] = useState(null);
const [registryContract, setRegistryContract] = useState(null);
const [energyCredits, setEnergyCredits] = useState(null);
const [myEnergyCredits, setMyEnergyCredits] = useState([]);
const [marketEnergyCredits, setMarketEnergyCredits] = useState([]);
const [creditListingAmount, setCreditListingAmount] = useState('');
const [creditListingPrice, setCreditListingPrice] = useState('');
const [buyAmount, setBuyAmount] = useState('0');
const [registryTimestamp, setRegistryTimestamp] = useState('');
const [registryEnergyAmount, setRegistryEnergyAmount] = useState('0');
const [registryLocation, setRegistryLocation] = useState('');

useEffect(() => {
  const init = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log(signer)
      const network = await provider.getNetwork();
      if (network.chainId === networkId) {
        setAccount(await signer.getAddress());
        setWeb3Provider(provider);
        const tradingContract = new ethers.Contract(tradingContractAddress, RenewableEnergyCreditTrading.abi, signer);
        const registryContract = new ethers.Contract(registryContractAddress, RenewableEnergyRegistry.abi, signer);
        setTradingContract(tradingContract);
        setRegistryContract(registryContract);
      } else {
        console.log("test", network.chainId, networkId)
        alert('Please connect to the correct network');
      }
    } else {
      alert('Please install MetaMask or any Ethereum wallet to use this app');
    }
  };
  init();
}, []);

  
useEffect(() => {
  const fetchEnergyCredits = async () => {
    if (tradingContract && account) {
      try {
        const credits = await tradingContract.energyCredits(account);
        setEnergyCredits(credits.toString());
      } catch (error) {
        console.error(error);
      }
    }
  };

  fetchEnergyCredits();
}, [tradingContract, account]);
useEffect(() => {
  const fetchMyEnergyCredits = async () => {
    if (tradingContract && account) {
      try {
        const credits = await tradingContract.energyCredits(account);
        setMyEnergyCredits(credits.toString());
      } catch (error) {
        console.error(error);
      }
    }
  };

  fetchMyEnergyCredits();
}, [tradingContract, account]);
useEffect(() => {
  const fetchMarketEnergyCredits = async () => {
    if (tradingContract) {
      try {
        const credits = await tradingContract.getListedCredits();
        setMarketEnergyCredits(credits);
      } catch (error) {
        console.error(error);
      }
    }
  };

  fetchMarketEnergyCredits();
}, [tradingContract]);


  const handleIncrementEnergyCredits = async () => {
    if (tradingContract && account) {
      try {
        // Get the signer
        const signer = await web3Provider.getSigner();
        // Create a new Contract instance using the signer
        const contractWithSigner = new ethers.Contract(
          tradingContractAddress,
          RenewableEnergyCreditTrading.abi,
          signer
        );
        // Call the incrementEnergyCredits function and send the transaction
        const tx = await contractWithSigner.incrementEnergyCredits(account);
        // Wait for the transaction to be mined and get the receipt
        await tx.wait();
        // Fetch the updated energyCredits value from the contract
        // const credits = await contractWithSigner.energyCredits(account);
        // setEnergyCredits(credits.toString());
        alert('Energy credits incremented successfully');
      } catch (error) {
        console.error(error);
        alert('Error incrementing energy credits');
      }
    } else {
      alert('Please connect to your Ethereum wallet');
    }
  };
  


  const handleListCredits = async () => {
    if (!creditListingAmount || Number(creditListingAmount) <= 0) {
    alert('Please enter a valid credit listing amount');
    return;
  }
  
  
  if (Number(creditListingAmount) > Number(myEnergyCredits)) {
    alert('You cannot list more credits than you own');
    return;
  }
  
  
    if (tradingContract && creditListingPrice > 0) {
      try {
        const priceInWei = ethers.parseEther(creditListingPrice);
        await tradingContract.listCreditForSale(creditListingAmount, priceInWei);
        alert('Credits listed for sale successfully');
      } catch (error) {
        console.error(error);
        alert('Error listing credits');
      }
    } else {
      alert('Please enter valid credit listing price');
    }
  };
  

const handleBuyCredits = async () => {
  if (tradingContract && buyAmount > 0) {
    try {
      await tradingContract.buyCredits(1, buyAmount);
      alert('Credits bought successfully');
    } catch (error) {
      console.error(error);
      alert('Error buying credits');
    }
  } else {
    alert('Please enter a valid buy amount');
  }
};

const handleRegisterEnergyData = async () => {
  if (registryContract && registryTimestamp > 0 && registryEnergyAmount > 0 && registryLocation) {
    try {
      await registryContract.registerRenewableEnergy(registryTimestamp, registryEnergyAmount, registryLocation);
      alert('Renewable energy data registered successfully');
    } catch (error) {
      console.error(error);
      alert('Error registering renewable energy data');
    }
  } else {
    alert('Please enter valid values for all fields');
  }
 };
 return (
    <>
    <header className="App-header">
    </header>
      <div>
        <h1>Renewable Energy Credit Trading Platform</h1>
        <h2>Connected Account: {account}</h2>
        <div>
          <h3>Increment Energy Credits</h3>
          <button onClick={handleIncrementEnergyCredits}>Increment</button>
        </div>

        <div>
          <h2>My Energy Credits: {myEnergyCredits}</h2>
        </div>

        <div>
          <h3>Market Energy Credits</h3>
        {marketEnergyCredits ? (
          <ul>
            {marketEnergyCredits.map((credit) => (
              <li key={credit.creditId}>
                Amount: {credit.quantity} credits, Price:{" "}
                {ethers.formatEther(credit.pricePerUnit, 18)} ETH
              </li>
            ))}
          </ul>
        ) : (
          <p>Loading market energy credits...</p>
        )}
        </div>

        <h2>Current Energy Credits Available: {energyCredits}</h2>

        <div>
          <h3>List Renewable Energy Credits for Sale</h3>
          <input
            type="number"
            placeholder="Amount of Credits"
            value={creditListingAmount}
            onChange={(e) => setCreditListingAmount(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price per Credit in ETH"
            value={creditListingPrice}
            onChange={(e) => setCreditListingPrice(e.target.value)}
          />
          <button onClick={handleListCredits}>List Credits for Sale</button>
        </div>

        <div>
          <h3>Buy Renewable Energy Credits</h3>
          <input
            type="number"
            placeholder="Amount to Buy"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
          />
          <button onClick={handleBuyCredits}>Buy Credits</button>
        </div>

        <div>
          <h3>Register Renewable Energy Data</h3>
          <input
            type="number"
            placeholder="Timestamp (Unix Epoch)"
            value={registryTimestamp}
            onChange={(e) => setRegistryTimestamp(e.target.value)}
          />
          <input
            type="number"
            placeholder="Energy Amount in kWh"
            value={registryEnergyAmount}
            onChange={(e) => setRegistryEnergyAmount(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={registryLocation}
            onChange={(e) => setRegistryLocation(e.target.value)}
          />
          <button onClick={handleRegisterEnergyData}>Register Energy Data</button>
        </div>
      </div>
    </>
 )
}
export default App 