import Debug from 'debug';
import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { IoIosLogOut } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import { Web3Consumer } from './Web3Provider';
import { formatAddress } from './utils';
import Identicon from './Identicon';

const debug = Debug('Web3Modal');

const styles = (theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'end',
  },
  account: {
    display: 'flex',
    color: 'white',
    alignItems: 'center',
    margin: '0 15px',
  },
  identicon: {
    marginTop: '3px',
  },
  buttonConnect: {
    '&:hover': {
      color: 'white',
      backgroundColor: 'rgb(147, 182, 242)',
    },
  },
  accountRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    margin: '0 5px',
  },
  accountRightTitle: {
    color: 'white',
    fontWeight: 600,
  },
  accountRightAddress: {
    color: 'rgb(121, 132, 161)',
  },
  disconnect: {
    display: 'flex',
    alignItems: 'center',
    color: 'white',
    cursor: 'pointer',
    margin: '0px 10px',
  },
});

const Web3ModalComponent = ({ classes, match }) => {
  return (
    <Web3Consumer>
      {(web3Context) => {
        return (
          <div className={classes.root}>
            {web3Context.isConnected && (
              <Link
                className={classes.account}
                to={`${match.url}/voter/${web3Context.address}`}
              >
                <Identicon
                  size="35"
                  value={web3Context.address}
                  className={classes.identicon}
                />
                <div className={classes.accountRight}>
                  <div className={classes.accountRightTitle}>My Account</div>
                  <div className={classes.accountRightAddress}>
                    {formatAddress(web3Context.address)}
                  </div>
                </div>
              </Link>
            )}
            {!web3Context.isConnected && (
              <Button
                variant="contained"
                color="secondary"
                className={classes.buttonConnect}
                onClick={
                  web3Context.isConnecting
                    ? () => null
                    : () => web3Context.connect()
                }
              >
                {web3Context.isConnecting ? 'Loading...' : 'Connect Wallet'}
              </Button>
            )}
            {web3Context.isConnected && (
              <div
                className={classNames(
                  classes.disconnect,
                  'hint--left',
                  'hint--bounce',
                )}
                onClick={() => web3Context.disconnect()}
                data-hint="Disconnect Wallet"
              >
                <IoIosLogOut size="25" />
              </div>
            )}
          </div>
        );
      }}
    </Web3Consumer>
  );
};

export default withRouter(withStyles(styles)(Web3ModalComponent));
