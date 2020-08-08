import React from 'react';
import { useQuery } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

import { getProposals } from './gql';

const styles = (theme) => ({
  root: {
    gridArea: 'maingrid',
  },
});

const Proposals = ({ classes, match }) => {
  const { loading, error, data } = useQuery(getProposals);
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  return (
    <div className={classes.root}>
      <div>PROPOSALS:</div>

      {data.proposals.map((proposal) => (
        <div key={proposal.id}>
          <Link to={`${match.params.chain}/proposal/${proposal.id}`}>
            {proposal.id}
          </Link>{' '}
          {proposal.link} {proposal.beginBlock} {proposal.endBlock}
        </div>
      ))}
    </div>
  );
};

export default withStyles(styles)(Proposals);
