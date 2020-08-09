import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Logo } from './utils';
import { FaMedium } from 'react-icons/fa';
import { FaDiscord } from 'react-icons/fa';
import { FaTelegramPlane } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaReddit } from 'react-icons/fa';

const styles = (theme) => ({
  root: {
    gridArea: 'footer',
    display: 'flex',
    justifyContent: 'space-between',
    padding: '77px 67px 0 47px',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    'background-position-x': '0%',
    'background-position-y': '0%',
    backgroundRepeat: 'repeat',
    backgroundAttachment: 'scroll',
    backgroundImage:
      'linear-gradient(360deg, rgb(16, 27, 59) 0%, rgb(17, 26, 52) 34%, rgb(20, 24, 39) 100%)',
    backgroundSize: 'auto',
    backgroundOrigin: 'padding-box',
    backgroundClip: 'border-box',
    '& a': {
      color: 'rgb(121, 132, 161)',
      lineHeight: '20px',
      marginBottom: '20px',
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
  column: {
    flexDirection: 'column',
    display: 'flex',
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
});

const Footer = ({ classes }) => (
  <div className={classes.root}>
    <div className={classes.column}>
      <div className={classes.title}>
        <Logo width={75} />
      </div>
      <div className={classes.description}>
        <p>Monte Carlo Decentralized Exchange is a crypto trading platform.</p>
        <p>
          MCDEX is powered by the Mai Protocol smart contracts deployed on the
          Ethereum blockchain.
        </p>
        <p>
          The Mai Protocol smart contracts are fully audited by Open Zeppelin,
          Consensys and Chain Security.
        </p>
      </div>
    </div>
    <div className={classes.column}>
      <div className={classes.title}>Protocol</div>
      <a href="https://mcdex.io/references/#/en-US/white-paper">Whitepaper</a>
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
);

export default withStyles(styles)(Footer);
