import { utils, ethers } from 'ethers';
import { useState, useEffect } from 'react';
import RenewableEnergyCreditTrading from '../artifacts/contracts/RenewableEnergyCreditTrading.sol/RenewableEnergyCreditTrading.json';
import RenewableEnergyRegistry from '../artifacts/contracts/RenewableEnergyRegistry.sol/RenewableEnergyRegistry.json';


const networkId = 1337n; // Replace with the network ID where your contracts are deployed
const tradingContractAddress = '0x4BBD31B615B71Dd41f65a9C0BAD564cCfEf51cA5';
const registryContractAddress = '0x019f052A98A80010b330F5F83eeA97716252F5D3';

const App = () => {
const [account, setAccount] = useState('');
const [web3Provider, setWeb3Provider] = useState(null);
const [tradingContract, setTradingContract] = useState(null);
const [registryContract, setRegistryContract] = useState(null);
const [energyCredits, setEnergyCredits] = useState(null);
const [creditListingAmount, setCreditListingAmount] = useState('0');
const [creditListingPrice, setCreditListingPrice] = useState('0');
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
        const credits = await tradingContract.energyCredits(account);
        setEnergyCredits(credits.toString());
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (tradingContract && registryContract) {
  //       const credits = await tradingContract.energyCredits();
  //       setEnergyCredits(credits.toString());
  //     }
  //   };
  //   fetchData();
  // }, [tradingContract, registryContract]);
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
  if (tradingContract && creditListingAmount > 0 && creditListingPrice > 0) {
    try {
      await tradingContract.listCreditForSale(creditListingAmount, utils.parseEther(creditListingPrice));
      alert('Credits listed for sale successfully');
    } catch (error) {
      console.error(error);
      alert('Error listing credits');
    }
  } else {
    alert('Please enter valid credit listing amount and price');
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