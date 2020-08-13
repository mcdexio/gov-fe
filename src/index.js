import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import 'hint.css';

import './index.css';
import App from './App';
import { SUPPORTED_CHAINS } from './utils';

const client = new ApolloClient({
  uri:
    'https://api.thegraph.com/subgraphs/name/sulliwane/mcdex-ropsten-subgraph',
  cache: new InMemoryCache(),
});

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      'Overpass-Regular, sans-serif',
      'Montserrat-Regular, sans-serif',
    ].join(','),
    subtitle1: {
      fontFamily: 'Montserrat-Regular, sans-serif',
    },
  },
  palette: {
    primary: {
      light: 'rgb(147, 182, 242)',
      main: 'rgb(35, 43, 72)',
      dark: 'rgb(24, 30, 52)',
      contrastText: 'rgb(121, 132, 161)',
    },
    secondary: {
      light: '#D4DCEA',
      main: 'rgb(147, 182, 242)',
      dark: '#4F5C73',
      contrastText: 'rgb(35, 43, 72)',
    },
    background: {
      default: 'rgb(35, 43, 72)',
      paper: '#f5f7fa',
      red: '#EF5353',
      green: '#11B15E',
      grey: '#6C6C6C',
      main: (opacity = '0.3') => `rgba(250,233,0,${opacity})`,
    },
    text: {
      primary: '#000000',
      secondary: '#000000',
      disabled: '#505050',
      link: '#3498db',
      focusLink: '#1d6fa5',
    },
  },
  overrides: {
    MuiTabs: {
      root: {
        backgroundColor: '#f5f7fa',
      },
      indicator: {
        height: '3px',
        backgroundColor: '#f4c503',
      },
    },
  },
  props: {
    MuiInput: {
      disableUnderline: true, // No more ripple, on the whole application 💣!
      root: {
        color: 'white',
      },
    },
    MuiInputLabel: {
      disableAnimation: true,
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <MuiThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Redirect exact strict from={'/:chain/'} to={'/:chain'} />
            <Route
              path={`/:chain(${SUPPORTED_CHAINS.join('|')})`}
              component={App}
            />
            <Redirect to={`/${SUPPORTED_CHAINS[0]}`} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
