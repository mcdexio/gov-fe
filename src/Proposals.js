import React from 'react';
import Debug from 'debug';
import { useQuery } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import { FaPlus } from 'react-icons/fa';
import classNames from 'classnames';
import { BarLoader } from 'react-spinners';
import cap from 'capitalize';

import { getProposals } from './gql';
import { Web3Consumer } from './Web3Provider';
import {
  SUBGRAPH_CLIENTS,
  linkToTitle,
  calcSimpleVotingStatus,
  SUPPORTED_CHAINS,
  isValidLink,
} from './utils';

const debug = Debug('Proposals');
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
  proposalsTitle: {
    fontSize: '1.75rem',
    fontWeight: 700,
    color: 'white',
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
  newProposalButton: {
    minWidth: '0px',
    color: 'rgba(0, 0, 0, 0.26)',
    '&:hover': {
      color: 'white',
      backgroundColor: 'rgb(147, 182, 242)',
    },
  },
  buttonDisabled: {
    color: 'rgba(0, 0, 0, 0.26)',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    '&:hover': {
      color: 'rgba(0, 0, 0, 0.26)',
      backgroundColor: 'rgba(0, 0, 0, 0.12)',
    },
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listPaper: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    margin: '3.875rem 0',
  },
  listHeader: {
    fontWeight: 700,
    fontSize: '1.1rem',
    display: 'flex',
    justifyContent: 'space-between',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: '1.75rem',
    paddingBottom: '1.75rem',
    alignItems: 'start',
  },
  modalPaper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '5px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    display: 'flex',
    flexDirection: 'column',
  },
  modalTitle: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: '1.1rem',
    fontWeight: 600,
  },
  form: { display: 'flex', flexDirection: 'column', margin: '2rem 0' },
  forumLinkInput: { display: 'flex' },
  blockInputs: { display: 'flex' },
  startBlockInput: { display: 'flex', marginRight: '10px' },
  endBlockInput: { display: 'flex' },
  buttonContainer: { display: 'flex', justifyContent: 'center' },
});

const Proposals = ({ classes, match }) => {
  const [open, setOpen] = React.useState(false);
  const [proposing, setProposing] = React.useState(false);
  const [newProposalLink, setNewProposalLink] = React.useState('');
  const [newProposalStartBlock, setNewProposalStartBlock] = React.useState('');
  const [newProposalEndBlock, setNewProposalEndBlock] = React.useState('');
  const [hasLinkError, setLinkError] = React.useState(false);
  const [hasStartBlockError, setStartBlockError] = React.useState(false);
  const [hasEndBlockError, setEndBlockError] = React.useState(false);

  const { loading, error, data, refetch } = useQuery(getProposals, {
    client: SUBGRAPH_CLIENTS[match.params.chain],
    onCompleted: debug,
    notifyOnNetworkStatusChange: true,
  });

  if (loading)
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
        const proposals = data.proposals.slice();
        let hintMessage;
        if (!web3Context.isConnected) {
          hintMessage = 'Please connect your Wallet first';
        } else if (
          web3Context.chainName &&
          !SUPPORTED_CHAINS.includes(web3Context.chainName)
        ) {
          hintMessage = `${cap(
            web3Context.chainName,
          )} is NOT supported. Switch to ${SUPPORTED_CHAINS.map((e) =>
            cap(e),
          ).join(' or ')}`;
        } else {
          hintMessage = 'Submit a new proposal';
        }
        const noErrors =
          !hasLinkError && !hasStartBlockError && !hasEndBlockError;

        return (
          <div className={classes.root}>
            <div className={classes.pageHeader}>
              <div className={classes.container}>
                <div className={classes.proposalsTitle}>
                  Governance Proposals
                </div>
                <Paper className={classes.listPaper}>
                  <List
                    component="nav"
                    className={classes.addressList}
                    aria-label="list of addresses"
                  >
                    <ListItem className={classes.listHeader} key="header">
                      <div>All Proposals</div>

                      <Button
                        variant="contained"
                        color="secondary"
                        disableElevation={true}
                        className={classNames(
                          'hint--left',
                          'hint--bounce',
                          classes.newProposalButton,
                          (!web3Context.address ||
                            !SUPPORTED_CHAINS.includes(
                              web3Context.chainName,
                            )) &&
                            classes.buttonDisabled,
                        )}
                        onClick={() => {
                          if (
                            web3Context.address &&
                            SUPPORTED_CHAINS.includes(web3Context.chainName)
                          ) {
                            setOpen(true);
                          }
                        }}
                        data-hint={hintMessage}
                      >
                        <FaPlus size={15} />
                      </Button>
                    </ListItem>
                    {proposals.reverse().map((proposal) => {
                      const votingStatus = calcSimpleVotingStatus({
                        blockNumber: web3Context.blockNumber,
                        proposal,
                      });
                      return (
                        <Link
                          to={{
                            pathname: `${match.params.chain}/proposal/${proposal.id}`,
                            state: { endBlock: proposal.endBlock },
                          }}
                          key={proposal.id}
                        >
                          <Divider />
                          <ListItem button className={classes.listItem}>
                            <div className={classes.proposalTitle}>
                              {linkToTitle(proposal.link)}
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
                                0{proposal.id} • {votingStatus} on Block #
                                {votingStatus === 'Ended'
                                  ? proposal.endBlock
                                  : proposal.beginBlock}
                              </div>
                            </div>
                          </ListItem>
                        </Link>
                      );
                    })}
                  </List>
                </Paper>
              </div>
            </div>

            <Modal
              aria-labelledby="transition-modal-title"
              aria-describedby="transition-modal-description"
              className={classes.modal}
              open={open}
              onClose={() => setOpen(false)}
              closeAfterTransition
              BackdropComponent={Backdrop}
              BackdropProps={{
                timeout: 500,
              }}
            >
              <Fade in={open}>
                <div className={classes.modalPaper}>
                  <div className={classes.modalTitle}>
                    New Proposal Submission Form
                  </div>
                  <form className={classes.form} noValidate autoComplete="off">
                    <TextField
                      id="standard-basic"
                      label="Forum Link"
                      className={classes.forumLinkInput}
                      value={newProposalLink}
                      onChange={(event) => {
                        setLinkError(!isValidLink(event.target.value));
                        setNewProposalLink(event.target.value);
                      }}
                      error={hasLinkError}
                      helperText={
                        hasLinkError ? 'Invalid MCDEX forum Link' : ''
                      }
                    />
                    <div className={classes.blockInputs}>
                      <TextField
                        id="standard-number"
                        label="Start Block Number"
                        type="number"
                        className={classes.startBlockInput}
                        value={newProposalStartBlock}
                        onChange={(event) => {
                          debug(
                            'typeof event.target.value',
                            typeof event.target.value,
                          );
                          setStartBlockError(
                            parseInt(event.target.value) <=
                              web3Context.blockNumber,
                          );
                          setNewProposalStartBlock(event.target.value);
                        }}
                        error={hasStartBlockError}
                        helperText={
                          hasStartBlockError ? 'Too old block number' : ''
                        }
                      />
                      <TextField
                        id="standard-number"
                        label="End Block Number"
                        type="number"
                        className={classes.endBlockInput}
                        value={newProposalEndBlock}
                        onChange={(event) => {
                          debug('event.target.value ', event.target.value);
                          debug(
                            'newProposalStartBlock + 5760',
                            newProposalStartBlock + 5760,
                          );
                          setEndBlockError(
                            event.target.value <=
                              parseInt(newProposalStartBlock) + 5760,
                          );
                          setNewProposalEndBlock(event.target.value);
                        }}
                        error={hasEndBlockError}
                        helperText={
                          hasEndBlockError ? 'Too small block number' : ''
                        }
                      />
                    </div>
                  </form>
                  <div className={classes.buttonContainer}>
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classNames(
                        classes.button,
                        (!noErrors || proposing) && classes.buttonDisabled,
                      )}
                      onClick={() => {
                        if (noErrors && !proposing) {
                          setProposing(true);
                          web3Context.propose(
                            newProposalLink,
                            newProposalStartBlock,
                            newProposalEndBlock,
                            refetch,
                            setOpen,
                            setProposing,
                          );
                        }
                      }}
                    >
                      {proposing ? `Submitting...` : `Submit the new proposal`}
                    </Button>
                  </div>
                </div>
              </Fade>
            </Modal>
          </div>
        );
      }}
    </Web3Consumer>
  );
};

export default withStyles(styles)(Proposals);
