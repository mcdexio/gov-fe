import Debug from 'debug';
import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import { Web3Consumer } from './Web3Provider';
import { formatAddress } from './utils';

const debug = Debug('Web3Modal');

const styles = (theme) => ({
  root: {},
});

const Web3ModalComponent = ({ classes }) => {
  return (
    <Web3Consumer>
      {(web3Context) => {
        return (
          <div className={classes.root}>
            <Button
              variant="contained"
              color="secondary"
              onClick={
                web3Context.isConnected
                  ? () => web3Context.disconnect()
                  : web3Context.isConnecting
                  ? () => null
                  : () => web3Context.connect()
              }
              data-hint={
                web3Context.isConnected
                  ? 'Click to connect'
                  : 'Click to  Wallet'
              }
            >
              {web3Context.isConnected
                ? `Disconnect ${formatAddress(web3Context.address)}`
                : web3Context.isConnecting
                ? 'Loading...'
                : 'Connect Wallet'}
            </Button>
          </div>
        );
      }}
    </Web3Consumer>
  );
};

export default withStyles(styles)(Web3ModalComponent);
