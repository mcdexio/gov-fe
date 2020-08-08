import React from 'react';
import { useQuery } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

import { Web3Consumer } from './Web3Provider';
import { getProposal } from './gql';

const styles = (theme) => ({
  root: {
    gridArea: 'maingrid',
  },
});

const Proposal = ({ classes, match }) => {
  console.log('match', match);
  const { loading, error, data } = useQuery(getProposal, {
    variables: { id: match.params.id },
  });
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  return (
    <Web3Consumer>
      {(context) => {
        let votingControls;
        if (
          context.blockNumber &&
          context.blockNumber < data.proposal.beginBlock
        ) {
          votingControls = (
            <div>
              the vote for this proposal will start in{' '}
              {data.proposal.beginBlock - context.blockNumber} blocks
            </div>
          );
        } else if (
          context.blockNumber &&
          data.proposal.beginBlock <= context.blockNumber &&
          context.blockNumber <= data.proposal.endBlock
        ) {
          votingControls = (
            <div>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => context.vote(data.proposal.id, 'FOR')}
              >
                {`Vote YES to the proposal`}
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => context.vote(data.proposal.id, 'AGAINST')}
              >
                {`Vote NO to the proposal`}
              </Button>
            </div>
          );
        } else if (
          context.blockNumber &&
          context.blockNumber > data.proposal.endBlock
        ) {
          <div>the vote already ended on Block #{data.proposal.endBlock}</div>;
        }
        return (
          <div className={classes.root}>
            <div>
              PROPOSAL: {data.proposal.id} {votingControls}
            </div>

            <div>
              VOTES:{' '}
              {data.proposal.votes.map((vote) => (
                <div key={vote.id}>
                  <Link
                    to={`../../${match.params.chain}/voter/${vote.voter.id}`}
                  >
                    {vote.voter.id}
                  </Link>{' '}
                  {vote.content} {vote.transaction.id}
                </div>
              ))}
            </div>
          </div>
        );
      }}
    </Web3Consumer>
  );
};

export default withStyles(styles)(Proposal);
