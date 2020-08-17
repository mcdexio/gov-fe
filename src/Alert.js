import React from 'react';
import Debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import Alert from '@material-ui/lab/Alert';
import cap from 'capitalize';

import { Web3Consumer } from './Web3Provider';
import { SUPPORTED_CHAINS } from './utils';

const debug = Debug('Alert');

const styles = (theme) => ({
  root: {
    gridArea: 'alert',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#1d233b',
    paddingTop: '2px',
  },
  alertContainer: {
    width: 'calc(100% - 60px)',
    margin: '2px 0px',
  },
  alert: {
    flex: 1,
    padding: '1px 30px',
  },
  icon: {
    padding: 0,
  },
  message: {
    padding: 0,
    display: 'flex',
    alignItems: 'center',
  },
  bold: {
    fontWeight: 'bold',
  },
});

const AlertComponent = ({ classes, match }) => {
  return (
    <Web3Consumer>
      {(web3Context) => {
        const alerts = [];
        debug('SUPPORTED_CHAINS', SUPPORTED_CHAINS);
        debug('web3Context.chainName', web3Context.chainName);
        if (!''.concat(SUPPORTED_CHAINS).includes(web3Context.chainName)) {
          const alertMessage = (
            <div>
              The chain{' '}
              <span className={classes.bold}>{cap(web3Context.chainName)}</span>{' '}
              selected in your Wallet{' '}
              <span className={classes.bold}>is not supported</span>. Here are
              the supported chains:{' '}
              {SUPPORTED_CHAINS.map((e) => cap(e)).join(', ')}.
            </div>
          );
          alerts.push(alertMessage);
        }

        if (match.params.chain !== 'homestead') {
          const alertMessage = (
            <div>
              You are <span className={classes.bold}>NOT on Mainnet</span>, but
              on the {cap(match.params.chain)}{' '}
              <span className={classes.bold}>testnet version</span> of this
              website.
            </div>
          );
          alerts.push(alertMessage);
        }
        debug('alerts', alerts);
        return (
          <div className={classes.root}>
            {alerts.map((alertMessage, index) => {
              return (
                <div className={classes.alertContainer} key={index}>
                  <Alert
                    className={classes.alert}
                    classes={{ icon: classes.icon, message: classes.message }}
                    severity="warning"
                  >
                    Warning {index + 1}: {alertMessage}
                  </Alert>
                </div>
              );
            })}
          </div>
        );
      }}
    </Web3Consumer>
  );
};

export default withRouter(withStyles(styles)(AlertComponent));
