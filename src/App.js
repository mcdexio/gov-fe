import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Route } from 'react-router-dom';

import Header from './Header';
import Proposals from './Proposals';
import Proposal from './Proposal';
import Voter from './Voter';
import Footer from './Footer';
import { Web3Provider } from './Web3Provider';

const appStyles = (theme) => ({
  appGrid: {
    minHeight: '100%',
    display: 'grid',
    padding: '0',
    gridGap: '0',
    gridTemplateRows: '5.5em 1fr auto',
    gridTemplateAreas: `'header' 'maingrid' 'footer'`,
  },
});

const App = withStyles(appStyles)(({ classes, match }) => {
  return (
    <div className={classes.appGrid}>
      <Web3Provider>
        <Header />
        <Route exact path={`${match.path}`} component={Proposals} />
        <Route path={`${match.path}/proposal/:id`} component={Proposal} />
        <Route path={`${match.path}/voter/:address`} component={Voter} />
        <Footer />
      </Web3Provider>
    </div>
  );
});

export default App;
