import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Link, withRouter } from 'react-router-dom';

import Web3Modal from './Web3Modal';
import { Logo } from './utils';

const styles = (theme) => ({
  root: {
    gridArea: 'header',
    backgroundImage: 'linear-gradient(0deg,#232b48,#1d233b)',
    display: 'flex',
    alignItems: 'center',
    padding: '0px 30px',
  },
  logo: {
    flexBasis: '25%',
    maxWidth: '25%',
  },
  title: {
    flexBasis: '50%',
    maxWidth: '50%',
    textAlign: 'center',
    color: 'white',
    fontSize: '1.2rem',
    fontWeight: 'bolder',
  },
  web3: {
    flexBasis: '25%',
    maxWidth: '25%',
    textAlign: 'right',
  },
});

const Header = ({ classes, match }) => (
  <div className={classes.root}>
    <div className={classes.logo}>
      <Link to={`../../${match.params.chain}`}>
        <Logo width={96} />
      </Link>
    </div>

    <div className={classes.title}>Governance Voting App</div>
    <div className={classes.web3}>
      <Web3Modal />
    </div>
  </div>
);

export default withRouter(withStyles(styles)(Header));
