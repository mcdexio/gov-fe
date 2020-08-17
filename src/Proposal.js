import Debug from 'debug';
import React from 'react';
import { useQuery } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import { MdKeyboardBackspace } from 'react-icons/md';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import { FaTimesCircle } from 'react-icons/fa';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import pluralize from 'pluralize';
import classNames from 'classnames';
import { BarLoader } from 'react-spinners';

import { Web3Consumer } from './Web3Provider';
import { getProposalByID, getProposal } from './gql';
import Identicon from './Identicon';
import {
  SUBGRAPH_CLIENTS,
  UNI_MCB_POOL,
  MCB_ADDRESS,
  linkToTitle,
  formatAddress,
  formatMCB,
  calcVotingStatus,
  calcVotingSummary,
} from './utils';

const debug = Debug('Proposal');
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
  proposalHeader: {
    marginTop: '1.875rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  proposalTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'white',
  },
  proposalSubTitle: {
    marginTop: '0.6rem',
    display: 'flex',
    alignItems: 'center',
  },
  status: {
    border: '1px solid rgb(121, 132, 161)',
    borderRadius: '4px',
    padding: '0.25rem 1rem',
    textAlign: 'center',
    color: 'rgb(121, 132, 161)',
    marginRight: '10px',
  },
  statusPassed: {
    borderColor: 'rgb(89, 239, 236)',
    color: 'rgb(89, 239, 236)',
  },
  statusFailed: {
    borderColor: 'rgb(217, 128, 65)',
    color: 'rgb(217, 128, 65)',
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
  proposalAuthor: {
    color: 'white',
    display: 'flex',
    alignItems: 'center',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorRight: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'end',
    marginBottom: '5px',
    marginLeft: '5px',
  },
  proposerTitle: {
    fontWeight: 600,
  },
  proposer: {
    display: 'flex',
  },
  authorAddress: { color: 'rgb(121, 132, 161)' },
  proposalID: {
    color: 'rgb(121, 132, 161)',
    fontWeight: 600,
  },
  paperContainer: { display: 'flex', marginTop: '3.875rem' },
  resultPaper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: '2rem',
    justifyContent: 'space-between',
  },
  yesResultPaper: {
    marginRight: '15px',
  },
  rootBar: {
    height: '4px',
    borderRadius: '4px',
  },
  bar1: {
    backgroundColor: '#e4e4e4',
  },
  forBar: {
    backgroundColor: 'rgb(89, 239, 236)',
  },
  againstBar: {
    backgroundColor: 'rgb(217, 128, 65)',
  },
  totalVoteResult: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1.1rem',
    fontWeight: 700,
    marginBottom: '1rem',
  },
  addressList: {
    paddingTop: '1.4rem',
  },
  addressListHeader: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  addressItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  yesButton: {
    fontWeight: 600,
    marginTop: '2rem',
    border: '1px solid rgb(89, 239, 236)',
    backgroundColor: 'transparent',
    color: 'rgb(89, 239, 236)',
    '&:hover': {
      border: '1px solid rgb(89, 239, 236)',
      backgroundColor: 'rgb(89, 239, 236)',
      color: 'white',
    },
  },
  noButton: {
    fontWeight: 600,
    marginTop: '2rem',
    border: '1px solid rgb(217, 128, 65)',
    backgroundColor: 'transparent',
    color: 'rgb(217, 128, 65)',
    '&:hover': {
      border: '1px solid rgb(217, 128, 65)',
      backgroundColor: 'rgb(217, 128, 65)',
      color: 'white',
    },
  },
  buttonDisabled: {
    color: 'rgba(0, 0, 0, 0.4)',
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 0, 0, 0.4)',
    '&:hover': {
      color: 'rgba(0, 0, 0, 0.4)',
      backgroundColor: 'transparent',
      border: '1px solid rgba(0, 0, 0, 0.4)',
    },
  },
  voteIcon: {
    margin: '5px',
  },
});

const Proposal = ({ classes, match, location }) => {
  debug('match', match);
  debug('location', location);
  const [voting, setVoting] = React.useState('');

  const { data: { proposal: { endBlock } = {} } = {} } = useQuery(
    getProposalByID,
    {
      client: SUBGRAPH_CLIENTS[match.params.chain],
      variables: { id: match.params.id },
    },
  );
  debug('endBlock', endBlock);
  debug('location?.state?.endBlock', location?.state?.endBlock);
  const balanceBlock = endBlock || location?.state?.endBlock;
  debug('balanceBlock', balanceBlock);
  const skip = balanceBlock === undefined ? true : false;

  const { loading, error, data, refetch } = useQuery(getProposal, {
    client: SUBGRAPH_CLIENTS[match.params.chain],
    notifyOnNetworkStatusChange: true,
    variables: {
      id: match.params.id.toLowerCase(),
      addressMCB: MCB_ADDRESS[match.params.chain],
      addressUniswap: UNI_MCB_POOL[match.params.chain],
      balanceBlock,
    },
    skip,
  });

  if (loading || skip)
    return (
      <div className={classes.root}>
        <BarLoader size={30} sizeUnit={'rem'} color={'white'} />
      </div>
    );
  if (error)
    return <div className={classes.root}>`Error! ${error.message}`</div>;
  return (
    <Web3Consumer>
      {(web3Context) => {
        debug('data.proposal.votes', data.proposal.votes);
        debug('web3Context.txs.length', web3Context.txs.length);
        debug('web3Context.receipts.length', web3Context.receipts.length);

        const {
          noVoters,
          noVotersMCB,
          noVotersUni,
          yesVoters,
          yesVotersMCB,
          yesVotersUni,
          yesVotesMCB,
          yesVotesUniMCB,
          noVotesUniMCB,
          yesVotes,
          noVotes,
          yesVotesPct,
          noVotesPct,
        } = calcVotingSummary({
          votes: data.proposal.votes,
          uniMCBAccount: data.uniMCBAccount,
          uniContract: data.uniContract,
          mcbContract: data.mcbContract,
        });
        const votingStatus = calcVotingStatus({
          blockNumber: web3Context.blockNumber,
          proposal: data.proposal,
          yesVotes,
          noVotes,
        });
        const alreadyVoted = data.proposal.votes.find(
          (vote) => vote.voter.id === web3Context.address,
        );
        debug('alreadyVoted', alreadyVoted);

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
                <div className={classes.proposalHeader}>
                  <div>
                    <a
                      className={classNames(
                        'hint--right',
                        'hint--bounce',
                        classes.proposalTitle,
                      )}
                      target="_blank"
                      rel="noreferrer noopener"
                      href={data.proposal.link}
                      data-hint="Click to read the proposal"
                    >
                      {linkToTitle(data.proposal.link)}{' '}
                      <FaExternalLinkAlt size={17} />
                    </a>
                    <div className={classes.proposalSubTitle}>
                      <div
                        className={classNames(
                          classes.status,
                          votingStatus === 'Active' && classes.statusActive,
                          votingStatus === 'Passed' && classes.statusPassed,
                          votingStatus === 'Failed' && classes.statusFailed,
                        )}
                      >
                        {votingStatus}
                      </div>
                      <div className={classes.proposalID}>
                        0{data.proposal.id} • {votingStatus} on Block #
                        {data.proposal.endBlock}
                      </div>
                    </div>
                  </div>
                  <Link
                    className={classes.proposalAuthor}
                    to={`../../${match.params.chain}/voter/${data.proposal.transaction.from.id}`}
                  >
                    <div className={classes.proposer}>
                      <Identicon
                        size="48"
                        value={data.proposal.transaction.from.id}
                      />
                      <div className={classes.authorRight}>
                        <div className={classes.proposerTitle}>Proposer</div>
                        <div className={classes.authorAddress}>
                          {formatAddress(data.proposal.transaction.from.id)}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className={classes.paperContainer}>
                  <Paper
                    className={classNames(
                      classes.resultPaper,
                      classes.yesResultPaper,
                    )}
                  >
                    <div>
                      <div className={classes.totalVoteResult}>
                        <div>For</div>
                        <div
                          className={classNames('hint--bottom', 'hint--bounce')}
                          data-hint={`${formatMCB(
                            yesVotesMCB,
                          )} MCB \u000A${formatMCB(yesVotesUniMCB)} UNI`}
                        >
                          {formatMCB(yesVotes)} MCB
                        </div>
                      </div>
                      <LinearProgress
                        classes={{
                          root: classes.rootBar,
                          colorPrimary: classes.bar1,
                          barColorPrimary: classes.forBar,
                        }}
                        variant="determinate"
                        value={yesVotesPct * 100}
                      />

                      <List
                        component="nav"
                        className={classes.addressList}
                        aria-label="list of addresses"
                      >
                        <ListItem
                          className={classes.addressListHeader}
                          key="header"
                        >
                          <div
                            className={classNames(
                              'hint--bottom',
                              'hint--bounce',
                            )}
                            data-hint={`${yesVotersMCB} used MCB \u000A${yesVotersUni} used UNI`}
                          >
                            {yesVoters} {pluralize('address', yesVoters)}
                          </div>
                          <div>Votes</div>
                        </ListItem>
                        {data.proposal.votes
                          .filter((vote) => vote.content === 'FOR')
                          .map((vote, index) => {
                            const mcbBalance =
                              vote.voter.votesMCB.length > 0
                                ? parseFloat(vote.voter.votesMCB[0].balance)
                                : 0;
                            const uniBalance =
                              vote.voter.votesUni.length > 0
                                ? parseFloat(vote.voter.votesUni[0].balance)
                                : 0;
                            return (
                              <Link
                                to={`../../${match.params.chain}/voter/${vote.voter.id}`}
                                key={index}
                              >
                                <Divider />
                                <ListItem
                                  button
                                  className={classes.addressItem}
                                >
                                  <div>{formatAddress(vote.voter.id)}</div>
                                  <div
                                    className={classNames(
                                      'hint--bottom',
                                      'hint--bounce',
                                    )}
                                    data-hint={`${formatMCB(
                                      mcbBalance,
                                    )} MCB \u000A${formatMCB(
                                      yesVotesUniMCB,
                                    )} UNI`}
                                  >
                                    {formatMCB(mcbBalance + yesVotesUniMCB)} MCB
                                  </div>
                                </ListItem>
                              </Link>
                            );
                          })}
                      </List>
                    </div>
                    {votingStatus === 'Active' && !alreadyVoted && (
                      <div className={classes.flexCenter}>
                        <Button
                          variant="outlined"
                          color="primary"
                          disableElevation={true}
                          className={classNames(
                            !web3Context.isConnected && classes.buttonDisabled,
                            !web3Context.isConnected && 'hint--top',
                            !web3Context.isConnected && 'hint--bounce',
                          )}
                          data-hint="Please connect your Wallet first"
                          classes={{
                            root: classes.yesButton,
                          }}
                          onClick={() => {
                            if (web3Context.isConnected && !voting) {
                              setVoting('FOR');
                              web3Context.vote(
                                data.proposal.id,
                                'FOR',
                                refetch,
                                setVoting,
                              );
                            }
                          }}
                        >
                          {voting
                            ? `Voting ${voting}...`
                            : `Vote FOR the proposal`}
                        </Button>
                      </div>
                    )}
                    {alreadyVoted?.content === 'FOR' && (
                      <div className={classes.flexCenter}>
                        You voted{' '}
                        <FaCheckCircle
                          size={25}
                          color="rgb(89, 239, 236)"
                          className={classes.voteIcon}
                        />
                        FOR
                      </div>
                    )}
                  </Paper>
                  <Paper className={classes.resultPaper}>
                    <div>
                      <div className={classes.totalVoteResult}>
                        <div>Against</div>
                        <div>{formatMCB(noVotes)} MCB</div>
                      </div>
                      <LinearProgress
                        classes={{
                          root: classes.rootBar,
                          colorPrimary: classes.bar1,
                          barColorPrimary: classes.againstBar,
                        }}
                        variant="determinate"
                        value={noVotesPct * 100}
                      />
                      <List
                        component="nav"
                        className={classes.addressList}
                        aria-label="list of addresses"
                      >
                        <ListItem
                          className={classes.addressListHeader}
                          key="header"
                        >
                          <div
                            className={classNames(
                              'hint--bottom',
                              'hint--bounce',
                            )}
                            data-hint={`${noVotersMCB} used MCB \u000A${noVotersUni} used UNI`}
                          >
                            {noVoters} {pluralize('address', noVoters)}
                          </div>
                          <div>Votes</div>
                        </ListItem>
                        {data.proposal.votes
                          .filter((vote) => vote.content === 'AGAINST')
                          .map((vote, index) => {
                            const mcbBalance =
                              vote.voter.votesMCB.length > 0
                                ? parseFloat(vote.voter.votesMCB[0].balance)
                                : 0;
                            const uniBalance =
                              vote.voter.votesUni.length > 0
                                ? parseFloat(vote.voter.votesUni[0].balance)
                                : 0;
                            return (
                              <Link
                                to={`../../${match.params.chain}/voter/${vote.voter.id}`}
                                key={index}
                              >
                                <Divider />
                                <ListItem
                                  button
                                  className={classes.addressItem}
                                >
                                  <div>{formatAddress(vote.voter.id)}</div>
                                  <div
                                    className={classNames(
                                      'hint--bottom',
                                      'hint--bounce',
                                    )}
                                    data-hint={`${formatMCB(
                                      mcbBalance,
                                    )} MCB \u000A${formatMCB(
                                      noVotesUniMCB,
                                    )} UNI`}
                                  >
                                    {formatMCB(mcbBalance + noVotesUniMCB)} MCB
                                  </div>
                                </ListItem>
                              </Link>
                            );
                          })}
                      </List>
                    </div>
                    {votingStatus === 'Active' && !alreadyVoted && (
                      <div className={classes.flexCenter}>
                        <Button
                          variant="outlined"
                          disableElevation={true}
                          color="primary"
                          className={classNames(
                            !web3Context.isConnected && classes.buttonDisabled,
                            !web3Context.isConnected && 'hint--top',
                            !web3Context.isConnected && 'hint--bounce',
                          )}
                          classes={{
                            root: classes.noButton,
                          }}
                          data-hint="Please connect your Wallet first"
                          onClick={() => {
                            if (web3Context.isConnected && !voting) {
                              setVoting('AGAINST');
                              web3Context.vote(
                                data.proposal.id,
                                'AGAINST',
                                refetch,
                                setVoting,
                              );
                            }
                          }}
                        >
                          {voting
                            ? `Voting ${voting}...`
                            : `Vote AGAINST the proposal`}
                        </Button>
                      </div>
                    )}
                    {alreadyVoted?.content === 'AGAINST' && (
                      <div className={classes.flexCenter}>
                        You voted{' '}
                        <FaTimesCircle
                          size={25}
                          color="rgb(217, 128, 65)"
                          className={classes.voteIcon}
                        />
                        AGAINST
                      </div>
                    )}
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

export default withStyles(styles)(Proposal);
