import React from 'react';
import Debug from 'debug';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { FaMedium } from 'react-icons/fa';
import { FaDiscord } from 'react-icons/fa';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaReddit } from 'react-icons/fa';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import {
  Logo,
  LogoSmall,
  BLOCHAIN_EXPLORER_BASE_URL,
  SUPPORTED_CHAINS,
} from './utils';
const debug = Debug('Footer');

const styles = (theme) => ({
  root: {
    gridArea: 'footer',
    color: 'rgb(121, 132, 161)',
    display: 'flex',
    flexDirection: 'column',
    padding: '77px 67px 0 47px',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    'background-position-x': '0%',
    'background-position-y': '0%',
    backgroundRepeat: 'repeat',
    backgroundAttachment: 'scroll',
    backgroundImage: 'linear-gradient(180deg, #232b48, rgb(24, 30, 52) 79%)',
    backgroundSize: 'auto',
    backgroundOrigin: 'padding-box',
    backgroundClip: 'border-box',
    '& a': {
      color: 'rgb(121, 132, 161)',
      '& :hover': {
        '-o-transition': '0.5s',
        '-ms-transition': '0.5s',
        '-moz-transition': '0.5s',
        '-webkit-transition': '0.5s',
        transition: '0.5s',
        color: '#fff',
      },
    },
    '& p': {
      color: 'rgb(121, 132, 161)',
      lineHeight: '20px',
    },
  },
  row1: {
    display: 'flex',
    justifyContent: 'space-between',
    'border-bottom-color': 'rgba(255, 255, 255, 0.3)',
    'border-bottom-style': 'dotted',
    'border-bottom-width': '0.8px',
  },
  row2: {
    display: 'flex',
    padding: '20px 0px',
  },
  column: {
    flexDirection: 'column',
    display: 'flex',
    '& a': {
      lineHeight: '20px',
      marginBottom: '20px',
    },
  },
  title: {
    color: 'white',
    fontSize: '1.2rem',
    marginBottom: 23,
  },
  icon: {
    display: 'flex',
    fontSize: 16,
    margin: '0px 0px 16px 0px',
    lineHeight: 0,
  },
  description: {
    color: 'rgb(121, 132, 161)',
  },
  left: {
    flexBasis: '25%',
    maxWidth: '25%',
  },
  middle: {
    flexBasis: '50%',
    maxWidth: '50%',
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
  },
  right: { flexBasis: '25%', maxWidth: '25%', textAlign: 'right' },
  logoSmall: { marginRight: 5 },
  selectRoot: {
    color: 'rgb(121, 132, 161)',
    backgroundColor: 'rgb(55, 69, 120)',
    paddingLeft: '16px',
  },
  selectSelect: {
    '&:focus': {
      backgroundColor: 'rgb(55, 69, 122)',
    },
  },
  selectIcon: {
    color: 'rgb(121, 132, 161)',
    top: 'calc(50% - 9px)',
  },
  selectPaper: {
    color: 'rgb(121, 132, 161)',
    backgroundColor: 'rgb(55, 69, 119)',
  },
  externalLink: {
    marginLeft: '5px',
  },
});

const Footer = ({ classes, match }) => {
  debug('match', match);
  return (
    <div className={classes.root}>
      <div className={classes.row1}>
        <div className={classes.column}>
          <div className={classes.title}>
            <Logo width={75} />
          </div>
          <div className={classes.description}>
            <p>
              Monte Carlo Decentralized Exchange is a crypto trading platform.
            </p>
            <p>
              MCDEX is powered by the Mai Protocol smart contracts deployed on
              the Ethereum blockchain.
            </p>
            <p>
              The Mai Protocol smart contracts are fully audited by Open
              Zeppelin, Consensys and Chain Security.
            </p>
          </div>
        </div>
        <div className={classes.column}>
          <div className={classes.title}>Protocol</div>
          <a href="https://mcdex.io/references/#/en-US/white-paper">
            Whitepaper
          </a>
          <a href="https://mcdex.io/trade">Trade</a>
          <a href="https://mcdex.io/doc/api">API</a>
          <a href="https://support.mcdex.io/hc/en-us">Support</a>
        </div>
        <div className={classes.column}>
          <div className={classes.title}>Governance</div>
          <a href="https://forum.mcdex.io/t/a-lightweight-voting-system-for-mcdex/89">
            Overview
          </a>
          <a href="https://forum.mcdex.io/t/about-the-governance-category/21">
            Forum
          </a>
        </div>
        <div className={classes.column}>
          <div className={classes.title}>Company</div>
          <a href="mailto:contact@mcdex.io">contact@mcdex.io</a>
          <a href="https://mcdex.io/homepage/pc-careers.html">Careers</a>
        </div>
        <div className={classes.column}>
          <a
            className={classes.icon}
            href="https://twitter.com/MonteCarloDEX"
            target="_blank"
            rel="noreferrer noopener"
          >
            <FaTwitter />
          </a>
          <a
            className={classes.icon}
            href="https://discord.gg/uut3V3D"
            target="_blank"
            rel="noreferrer noopener"
          >
            <FaDiscord />
          </a>
          <a
            className={classes.icon}
            href="https://t.me/Mcdex"
            target="_blank"
            rel="noreferrer noopener"
          >
            <FaTelegramPlane />
          </a>
          <a
            className={classes.icon}
            href="https://www.reddit.com/r/MCDEX/"
            target="_blank"
            rel="noreferrer noopener"
          >
            <FaReddit />
          </a>
          <a
            className={classes.icon}
            href="https://medium.com/@montecarlodex"
            target="_blank"
            rel="noreferrer noopener"
          >
            <FaMedium />
          </a>
        </div>
      </div>
      <div className={classes.row2}>
        <div className={classes.left}></div>
        <div className={classes.middle}>
          <LogoSmall width={28} className={classes.logoSmall} /> MCB Address:
          0x4e352cf164e64adcbad318c3a1e222e9eba4ce42
          <a
            className={classNames('hint--right', classes.externalLink)}
            aria-label="open in Etherscan"
            target="_blank"
            rel="noreferrer noopener"
            href={`${BLOCHAIN_EXPLORER_BASE_URL['mainnet']}/address/0x4e352cf164e64adcbad318c3a1e222e9eba4ce42`}
          >
            <FaExternalLinkAlt />
          </a>
        </div>
        <div className={classes.right}>
          {' '}
          <Select
            labelId="chain-selector"
            id="chain-selector"
            value={0}
            onChange={() => debug('select onChange')}
            classes={{
              root: classes.selectRoot,
              select: classes.selectSelect,
              icon: classes.selectIcon,
            }}
            MenuProps={{ classes: { paper: classes.selectPaper } }}
          >
            {SUPPORTED_CHAINS.map((chain, index) => (
              <MenuItem key={index} value={index}>
                {chain}
              </MenuItem>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
};

export default withRouter(withStyles(styles)(Footer));
