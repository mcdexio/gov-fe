import Debug from 'debug';
import React from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { Web3Consumer } from './Web3Provider';

const debug = Debug('Web3Modal');
let provider;

const styles = (theme) => ({
  root: {
    backgroundColor: 'gray',
  },
});

const Web3ModalComponent = ({ classes }) => {
  return (
    <Web3Consumer>
      {(context) => (
        <div className={classes.root}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={
              context.isConnected
                ? () => context.disconnect()
                : context.isConnecting
                ? () => null
                : () => context.connect()
            }
          >
            {context.isConnected
              ? `Disconnect Wallet ${context.address}`
              : context.isConnecting
              ? 'Loading...'
              : 'Connect Wallet'}
            {`context.isConnected ${context.isConnected}`}
            {`context.isConnecting ${context.isConnecting}`}
            {`context.networkVersion ${context.chainID}`}
          </Button>
        </div>
      )}
    </Web3Consumer>
  );
};

// const provider = await web3Modal.connect();
export default withStyles(styles)(Web3ModalComponent);
