import React from 'react';
import Debug from 'debug';
import { useQuery } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import copy from 'copy-to-clipboard';
import { BarLoader } from 'react-spinners';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Identicon from './Identicon';
import { FaRegClone } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';
import { MdKeyboardBackspace } from 'react-icons/md';
import classNames from 'classnames';

import { getVoter } from './gql';
import {
  SUBGRAPH_CLIENTS,
  MCB_ADDRESS,
  UNI_MCB_POOL,
  formatAddress,
  linkToTitle,
  calcSimpleVotingStatus,
  formatMCB,
} from './utils';
import { Web3Consumer } from './Web3Provider';

const debug = Debug('voters');
const styles = (theme) => ({
  root: {
    gridArea: 'maingrid',
    backgroundColor: '#232b48',
    minHeight: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageHeader: {
    display: 'flex',
    padding: '2rem 0',
    display: 'flex',
    justifyContent: 'center',
    flex: 0.75,
  },
  container: {
    maxWidth: '70rem',
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
  ribbon: {
    display: 'flex',
    alignItems: 'center',
    color: 'rgb(121, 132, 161)',
  },
  arrow: {
    marginRight: '5px',
  },
  headerTitle: {
    display: 'flex',
    marginTop: '1.875rem',
  },
  voterRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    margin: '0 5px',
  },
  voterID: { fontSize: '1.75rem', fontWeight: 700, color: 'white' },
  voterAddress: {
    color: 'rgb(121, 132, 161)',
    marginBottom: '5px',
    cursor: 'copy',
  },
  paper: {
    marginTop: '1.875rem',
    display: 'flex',
    flexDirection: 'column',
  },
  holdingsPaper: {
    flex: 1,
    marginRight: '15px',
  },
  holdingsItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
  },
  holdingsItemTitle: {
    color: 'rgb(121, 132, 161)',
    fontWeight: 600,
    margin: '10px 0',
  },
  holdingsItemBalance: {
    fontWeight: 500,
    fontSize: '1.4rem',
    marginBottom: '10px',
  },
  listPaper: {
    flex: 2,
  },
  listHeader: {
    fontWeight: 700,
    fontSize: '1.1rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  listItem: {
    display: 'flex',
    paddingTop: '1.75rem',
    paddingBottom: '1.75rem',
    justifyContent: 'space-between',
  },
  listItemLeft: {
    flexDirection: 'column',
    alignItems: 'start',
  },
  listItemRight: {
    color: 'rgb(121, 132, 161)',
    fontWeight: 600,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voteIcon: {
    margin: '5px',
  },
  proposalSubTitle: {
    marginTop: '0.6rem',
    display: 'flex',
    alignItems: 'center',
  },
  proposalTitle: {
    fontSize: '1.5rem',
  },
  proposalID: {
    color: 'rgb(121, 132, 161)',
    fontWeight: 600,
  },
  status: {
    border: '1px solid rgb(121, 132, 161)',
    borderRadius: '4px',
    padding: '0.25rem 1rem',
    textAlign: 'center',
    color: 'rgb(121, 132, 161)',
    marginRight: '10px',
  },
  statusActive: {
    borderColor: 'rgb(147, 182, 242)',
    color: 'rgb(147, 182, 242)',
    animation: '$changeColor 3s normal infinite',
  },
  '@keyframes changeColor': {
    '0%': {
      borderColor: 'rgb(147, 182, 242)',
      color: 'rgb(147, 182, 242)',
      backgroundColor: 'white',
    },
    '50%': {
      borderColor: 'rgb(147, 182, 242)',
      color: 'white',
      backgroundColor: 'rgb(147, 182, 242)',
    },
    '100%': {
      borderColor: 'rgb(147, 182, 242)',
      color: 'rgb(147, 182, 242)',
      backgroundColor: 'white',
    },
  },
  statusEnded: {
    borderColor: 'black',
    color: 'black',
  },
  paperContainer: { display: 'flex', marginTop: '1.875rem' },
});
const Voter = ({ classes, match }) => {
  const voterAddress = match.params.address.toLowerCase();
  const { loading, error, data } = useQuery(getVoter, {
    client: SUBGRAPH_CLIENTS[match.params.chain],
    variables: {
      id: voterAddress,
      addressUniswap: UNI_MCB_POOL[match.params.chain],
    },
  });
  if (loading)
    return (
      <div className={classes.root}>
        <BarLoader size={30} sizeUnit={'rem'} color={'white'} />
      </div>
    );
  if (error)
    return <div className={classes.root}>`Error! ${error.message}`</div>;
  debug('data', data);
  debug('match.params', match.params);
  return (
    <Web3Consumer>
      {(web3Context) => {
        let mcbBalance = 0;
        let uniMCBBalance = 0;

        if (data?.account?.balances?.length > 0) {
          const mcbBalanceObj = data.account.balances.find(
            (balance) =>
              balance.contract.id === MCB_ADDRESS[match.params.chain],
          );
          if (mcbBalanceObj) mcbBalance = mcbBalanceObj.balance;
          debug('mcbBalance', mcbBalance);

          const uniBalanceObj = data.account.balances.find(
            (balance) =>
              balance.contract.id === UNI_MCB_POOL[match.params.chain],
          );
          debug('uniBalanceObj', uniBalanceObj);
          if (uniBalanceObj) {
            const uniSharesBalance = parseFloat(uniBalanceObj.balance);
            const uniSharesSupply = parseFloat(
              data.uniContract.balancesHistory[0].totalSupply,
            );
            const mcbUniSupply = parseFloat(
              data.uniMCBAccount.balancesHistory[0].balance,
            );
            const uniSharesPct = uniSharesBalance / uniSharesSupply;
            uniMCBBalance = uniSharesPct * mcbUniSupply;
          }
        }

        return (
          <div className={classes.root}>
            <div className={classes.pageHeader}>
              <div className={classes.container}>
                <div>
                  <Link
                    className={classes.ribbon}
                    to={`../../${match.params.chain}`}
                  >
                    <MdKeyboardBackspace size={25} className={classes.arrow} />
                    ALL PROPOSALS
                  </Link>
                </div>
                <div className={classes.headerTitle}>
                  <Identicon size="48" value={voterAddress} />

                  <div className={classes.voterRight}>
                    <div className={classes.voterID}>
                      {voterAddress === web3Context.address ? 'Me' : 'Voter'}{' '}
                      {formatAddress(voterAddress)}
                    </div>
                    <div
                      className={classNames(
                        'hint--right',
                        'hint--bounce',
                        classes.voterAddress,
                      )}
                      onClick={(e) => copy(voterAddress)}
                      data-hint="Copy address"
                    >
                      {voterAddress} <FaRegClone />
                    </div>
                  </div>
                </div>
                <div className={classes.paperContainer}>
                  <Paper
                    className={classNames(classes.paper, classes.holdingsPaper)}
                  >
                    <List
                      component="nav"
                      className={classes.addressList}
                      aria-label="list of addresses"
                    >
                      <ListItem className={classes.listHeader}>
                        MCB Holdings
                      </ListItem>
                      <Divider />
                      <ListItem className={classes.holdingsItem}>
                        <div className={classes.holdingsItemTitle}>
                          MCB Total Balance
                        </div>
                        <div className={classes.holdingsItemBalance}>
                          {formatMCB(parseFloat(mcbBalance) + uniMCBBalance)}
                        </div>
                      </ListItem>
                      <Divider />

                      <ListItem className={classes.holdingsItem}>
                        <div className={classes.holdingsItemTitle}>
                          MCB Balance
                        </div>
                        <div className={classes.holdingsItemBalance}>
                          {formatMCB(parseFloat(mcbBalance))}
                        </div>
                      </ListItem>
                      <Divider />

                      <ListItem className={classes.holdingsItem}>
                        <div className={classes.holdingsItemTitle}>
                          MCB Balance in Uniswap
                        </div>
                        <div className={classes.holdingsItemBalance}>
                          {formatMCB(uniMCBBalance)}
                        </div>
                      </ListItem>
                    </List>
                  </Paper>
                  <Paper
                    className={classNames(classes.paper, classes.listPaper)}
                  >
                    <List
                      component="nav"
                      className={classes.addressList}
                      aria-label="list of addresses"
                    >
                      <ListItem className={classes.listHeader}>
                        Voting History
                      </ListItem>
                      {data?.account?.votes &&
                        data.account.votes.map((vote) => {
                          const votingStatus = calcSimpleVotingStatus({
                            blockNumber: web3Context.blockNumber,
                            proposal: vote.proposal,
                          });
                          return (
                            <Link
                              to={{
                                pathname: `../../${match.params.chain}/proposal/${vote.proposal.id}`,
                                state: { endBlock: vote.proposal.endBlock },
                              }}
                              key={vote.id}
                            >
                              <Divider />
                              <ListItem button className={classes.listItem}>
                                <div className={classes.listItemLeft}>
                                  <div className={classes.proposalTitle}>
                                    {linkToTitle(vote.proposal.link)}
                                  </div>
                                  <div className={classes.proposalSubTitle}>
                                    <div
                                      className={classNames(
                                        classes.status,
                                        votingStatus === 'Active' &&
                                          classes.statusActive,
                                        votingStatus === 'Ended' &&
                                          classes.statusEnded,
                                      )}
                                    >
                                      {votingStatus}
                                    </div>
                                    <div className={classes.proposalID}>
                                      0{vote.proposal.id} •{' '}
                                      {votingStatus === 'Active'
                                        ? 'Will end'
                                        : votingStatus}{' '}
                                      on Block #{vote.proposal.endBlock}
                                    </div>
                                  </div>
                                </div>
                                <div className={classes.listItemRight}>
                                  {vote.content === 'FOR' ? (
                                    <FaCheckCircle
                                      size={25}
                                      color="rgb(89, 239, 236)"
                                      className={classes.voteIcon}
                                    />
                                  ) : (
                                    <FaTimesCircle
                                      size={25}
                                      color="rgb(217, 128, 65)"
                                      className={classes.voteIcon}
                                    />
                                  )}
                                  {vote.content}
                                </div>
                              </ListItem>
                            </Link>
                          );
                        })}
                    </List>
                  </Paper>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Web3Consumer>
  );
};

export default withStyles(styles)(Voter);
