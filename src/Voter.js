import React from 'react';
import { useQuery } from '@apollo/client';
import { withStyles } from '@material-ui/core/styles';

import { getVoter } from './gql';

const styles = (theme) => ({
  root: {
    gridArea: 'maingrid',
  },
});

const Voter = ({ classes, match }) => {
  const { loading, error, data } = useQuery(getVoter, {
    variables: { id: match.params.address },
  });
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;
  return (
    <div className={classes.root}>
      <div>VOTER:</div>

      {data.account.id}
    </div>
  );
};

export default withStyles(styles)(Voter);
