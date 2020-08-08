import Debug from 'debug';
import React, { Component } from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import ethers from 'ethers';
import VoteBoxDesc from './abi/VoteBox.json';

const debug = Debug('Web3Provider');
const { Provider, Consumer } = React.createContext();

const VOTEBOX_ADDRESSES = {
  '3': '0x79a367A7045d359765f9CdE9424304c85b9F7A25',
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

class Web3ContextProvider extends Component {
  state = {
    currentProvider: '',
    isConnected: false,
    isConnecting: false,
    defaultChainId: '',
    chainID: '',
    chainName: '',
    address: '',
  };

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

    const [accounts, network] = await Promise.all([
      ethersProvider.listAccounts(),
      ethersProvider.getNetwork(),
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
      VOTEBOX_ADDRESSES[this.state.chainID],
      VoteBoxDesc,
      ethersProvider,
    );
    await voteBoxContract.propose();
  };

  render() {
    return (
      <Provider
        value={{
          theme: this.state.theme,
          toggleTheme: this.toggleTheme,
          address: this.state.address,
          isConnected: this.state.isConnected,
          isConnecting: this.state.isConnecting,
          connect: this.connect,
          disconnect: this.disconnect,
          chainID: this.state.chainID,
          chainName: this.state.chainName,
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { Web3ContextProvider as Web3Provider, Consumer as Web3Consumer };
