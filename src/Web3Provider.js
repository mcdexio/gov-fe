import Debug from 'debug';
import React, { Component } from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import ethers from 'ethers';
import { withRouter, useHistory } from 'react-router-dom';

import { abi as VoteBoxABI } from './abi/VoteBox.json';
import { VOTING_BOX, SUPPORTED_CHAINS } from './utils';

const debug = Debug('Web3Provider');
const { Provider, Consumer } = React.createContext();

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
  cacheProvider: true,
  theme: 'dark',
  providerOptions,
});

let web3Provider;
let ethersProvider;
let ethersSigner;

const defaultEthersProvider = {
  mainnet: new ethers.providers.InfuraProvider(
    'mainnet',
    'e78c03298dbe469f81af846f6727d3d8',
  ),
  ropsten: new ethers.providers.InfuraProvider(
    'ropsten',
    'e78c03298dbe469f81af846f6727d3d8',
  ),
  kovan: new ethers.providers.InfuraProvider(
    'kovan',
    'e78c03298dbe469f81af846f6727d3d8',
  ),
};

class Web3ContextProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isConnected: false,
      isConnecting: false,
      chainID: '',
      chainName: '',
      address: '',
      blockNumber: '',
      txs: [],
      receipts: [],
    };
  }

  connect = async () => {
    this.setState(() => {
      return {
        isConnecting: true,
      };
    });

    web3Provider = await web3Modal.connect().catch((e) => {
      debug(e);
      this.setState(() => {
        return {
          isConnecting: false,
        };
      });
      return 'error';
    });
    if (web3Provider === 'error') return;

    web3Provider.autoRefreshOnNetworkChange = false;
    debug('web3Provider', web3Provider);

    ethersProvider = new ethers.providers.Web3Provider(web3Provider, 'any');
    debug('ethersProvider', ethersProvider);
    ethersSigner = ethersProvider.getSigner();

    const [accounts, network] = await Promise.all([
      ethersProvider.listAccounts(),
      ethersProvider.getNetwork(),
    ]);
    debug('accounts', accounts);
    debug('network', network);

    const chainName = network.name === 'homestead' ? 'mainnet' : network.name;
    this.setState(() => {
      return {
        address: accounts[0].toLowerCase(),
        isConnected: true,
        isConnecting: false,
        chainID: network.chainId,
        chainName,
      };
    });

    if (
      this.props.match.params.chain !== chainName &&
      SUPPORTED_CHAINS.includes(chainName)
    ) {
      debug('redirect to ', chainName);
      this.props.history.push(`/${chainName}`);
    }

    debug('connected, ethersProvider:', ethersProvider);

    web3Provider.on('accountsChanged', (accounts) => {
      debug('accountsChanged', accounts);
      this.setState(() => {
        return {
          address:
            web3Provider.selectedAddress?.toLowerCase() ||
            web3Provider.accounts[0]?.toLowerCase(),
        };
      });
    });

    ethersProvider.on('network', async (network, oldNetwork) => {
      debug('ethersProvider.network network', network);
      debug('ethersProvider.network oldNetwork', oldNetwork);
      const chainName = network.name === 'homestead' ? 'mainnet' : network.name;

      this.setState(() => {
        return {
          chainID: network.chainId,
          chainName,
        };
      });

      if (
        this.props.match.params.chain !== chainName &&
        SUPPORTED_CHAINS.includes(chainName)
      ) {
        debug('redirect to ', chainName);
        this.props.history.push(`/${chainName}`);

        const blockNumber = await defaultEthersProvider[
          this.props.match.params.chain
        ].getBlockNumber();
        debug('blockNumber', blockNumber);
        debug('this.props.match', this.props.match);
        debug('this.state', this.state);
        this.setState(() => {
          return {
            blockNumber: blockNumber,
          };
        });
      }
    });
  };

  async componentDidMount() {
    if (web3Modal.cachedProvider) {
      debug('auto calling web3Modal.connect()');
      this.connect();
    }

    const blockNumber = await defaultEthersProvider[
      this.props.match.params.chain
    ].getBlockNumber();
    debug('blockNumber', blockNumber);
    debug('this.props.match', this.props.match);
    debug('this.state', this.state);
    this.setState(() => {
      return {
        blockNumber: blockNumber,
      };
    });
  }

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

  propose = async (
    newProposalLink,
    newProposalStartBlock,
    newProposalEndBlock,
    refetch,
    setOpen,
    setProposing,
  ) => {
    try {
      debug('newProposalLink', newProposalLink);
      debug('newProposalStartBlock', newProposalStartBlock);
      debug('newProposalEndBlock', newProposalEndBlock);
      debug('this.state.chainName', this.state.chainName);
      debug(
        'VOTING_BOX[this.state.chainName]',
        VOTING_BOX[this.state.chainName],
      );
      const voteBoxContract = new ethers.Contract(
        VOTING_BOX[this.state.chainName],
        VoteBoxABI,
        ethersSigner,
      );
      debug('voteBoxContract', voteBoxContract);
      const tx = await voteBoxContract.propose(
        newProposalLink,
        newProposalStartBlock,
        newProposalEndBlock,
      );

      this.setState(() => {
        return {
          txs: [...this.state.txs, tx],
        };
      });

      debug('propose tx', tx);
      const receipt = await tx.wait();
      debug('receipt', receipt);

      this.setState(() => {
        return {
          txs: [...this.state.receipts, receipt],
        };
      });
      setOpen(false);
      setProposing(false);
      refetch();
    } catch (error) {
      setProposing(false);
      debug('propose() error', error);
    }
  };

  vote = async (proposalID, voterSide, refetch, setVoting) => {
    try {
      debug('vote', this.state.chainID.toString());
      const voteBoxContract = new ethers.Contract(
        VOTING_BOX[this.state.chainName],
        VoteBoxABI,
        ethersSigner,
      );
      const tx = await voteBoxContract.vote(
        proposalID,
        VOTER_SIDE_ENUM[voterSide],
      );
      debug('vote tx', tx);
      this.setState(() => {
        return {
          txs: [...this.state.txs, tx],
        };
      });
      const receipt = await tx.wait();
      debug('receipt', receipt);
      this.setState(() => {
        return {
          txs: [...this.state.receipts, receipt],
        };
      });
      setVoting('');
      refetch();
    } catch (error) {
      setVoting('');
      debug('vote() error', error);
    }
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
          txs: this.state.txs,
          receipts: this.state.receipts,
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

function withMyHook(Component) {
  return function WrappedComponent(props) {
    let history = useHistory();
    return <Component {...props} history={history} />;
  };
}

const Web3Provider = withMyHook(withRouter(Web3ContextProvider));

export { Web3Provider, Consumer as Web3Consumer };
