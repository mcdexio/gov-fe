import Debug from 'debug';
import React, { Component } from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import ethers from 'ethers';
import { abi as VoteBoxABI } from './abi/VoteBox.json';

const debug = Debug('Web3Provider');
const { Provider, Consumer } = React.createContext();

const VOTEBOX_ADDRESSES = {
  '3': '0x79a367A7045d359765f9CdE9424304c85b9F7A25',
};

const VOTER_SIDE_ENUM = {
  FOR: 1,
  AGAINST: 2,
};

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: 'ddbcb3ec0c874f538664ded20bd35826',
    },
  },
};

const web3Modal = new Web3Modal({
  network: 'ropsten',
  cacheProvider: true,
  theme: 'dark',
  providerOptions,
});

let web3Provider;
let ethersProvider;
let ethersSigner;

const defaultEthersProvider = new ethers.providers.InfuraProvider(
  'ropsten',
  'e78c03298dbe469f81af846f6727d3d8',
);

class Web3ContextProvider extends Component {
  state = {
    isConnected: false,
    isConnecting: false,
    defaultChainId: '',
    chainID: '',
    chainName: '',
    address: '',
    blockNumber: '',
  };

  async componentDidMount() {
    const blockNumber = await defaultEthersProvider.getBlockNumber();
    debug('blockNumber', blockNumber);
    this.setState(() => {
      return {
        blockNumber: blockNumber,
      };
    });
  }

  connect = async () => {
    this.setState(() => {
      return {
        isConnecting: true,
      };
    });

    web3Provider = await web3Modal.connect();
    web3Provider.autoRefreshOnNetworkChange = false;

    ethersProvider = new ethers.providers.Web3Provider(web3Provider, 'any');
    debug('ethers ethersProvider', ethersProvider);
    ethersSigner = ethersProvider.getSigner();

    const [accounts, network] = await Promise.all([
      ethersProvider.listAccounts(),
      ethersProvider.getNetwork(),
      ethersProvider.getBlockNumber(),
    ]);
    debug('accounts', accounts);
    debug('network', network);

    this.setState(() => {
      return {
        address: accounts[0],
        isConnected: true,
        isConnecting: false,
        chainID: network.chainId,
        chainName: network.chainName,
      };
    });

    debug('connected, ethersProvider:', ethersProvider);

    web3Provider.on('accountsChanged', (accounts) => {
      debug('accountsChanged', accounts);
      this.setState(() => {
        return {
          address: web3Provider.selectedAddress || web3Provider.accounts[0],
        };
      });
    });

    ethersProvider.on('network', (network, oldNetwork) => {
      debug('ethersProvider.network network', network);
      debug('ethersProvider.network oldNetwork', oldNetwork);
      this.setState(() => {
        return {
          chainID: network.chainId,
          chainName: network.chainName,
        };
      });
    });
  };

  disconnect = async () => {
    debug('disconnect ethersProvider:', ethersProvider);
    await web3Modal.clearCachedProvider();

    if (web3Provider.close) {
      debug('web3Provider.close', web3Provider.close);
      await web3Provider.close();
    }

    this.setState(() => {
      return {
        address: '',
        isConnected: false,
        isConnecting: false,
      };
    });
  };

  propose = async () => {
    const voteBoxContract = new ethers.Contract(
      VOTEBOX_ADDRESSES[this.state.chainID.toString()],
      VoteBoxABI,
      ethersSigner,
    );
    const tx = await voteBoxContract.propose(
      'https://forum.mcdex.io/t/discussion-about-liquidity-mining-round-shang/24',
      8458758,
      8464518,
    );
    debug('propose tx', tx);
    const receipt = await tx.wait();
    debug('receipt', receipt);
  };

  vote = async (proposalID, voterSide) => {
    debug('vote', this.state.chainID.toString());
    const voteBoxContract = new ethers.Contract(
      VOTEBOX_ADDRESSES[this.state.chainID.toString()],
      VoteBoxABI,
      ethersSigner,
    );
    const tx = await voteBoxContract.vote(
      proposalID,
      VOTER_SIDE_ENUM[voterSide],
    );
    debug('vote tx', tx);
    const receipt = await tx.wait();
    debug('receipt', receipt);
  };

  render() {
    return (
      <Provider
        value={{
          chainID: this.state.chainID,
          chainName: this.state.chainName,
          address: this.state.address,
          isConnected: this.state.isConnected,
          isConnecting: this.state.isConnecting,
          blockNumber: this.state.blockNumber,
          connect: this.connect,
          disconnect: this.disconnect,
          propose: this.propose,
          vote: this.vote,
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { Web3ContextProvider as Web3Provider, Consumer as Web3Consumer };
