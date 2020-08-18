import Debug from 'debug';
import React from 'react';
import classNames from 'classnames';
import { ApolloClient, InMemoryCache } from '@apollo/client';

const debug = Debug('utils');

export const breakpoints = {
  mobile: 540,
  small: 600,
  medium: 1000,
  big: 1500,
};
const createMediaQuery = (breakpoint) => ({
  up: `@media (min-width: ${breakpoint}px)`,
  down: `@media (max-width: ${breakpoint}px)`,
});
export const mediaQueries = {
  mobile: createMediaQuery(breakpoints.mobile),
  small: createMediaQuery(breakpoints.small),
  medium: createMediaQuery(breakpoints.medium),
  big: createMediaQuery(breakpoints.big),
};

export const Logo = ({ width }) => (
  <img
    width={width}
    src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTMwcHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDEzMCAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICAgIDwhLS0gR2VuZXJhdG9yOiBTa2V0Y2ggNjEgKDg5NTgxKSAtIGh0dHBzOi8vc2tldGNoLmNvbSAtLT4KICAgIDx0aXRsZT5sb2dvPC90aXRsZT4KICAgIDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPgogICAgPGcgaWQ9IkhvbWUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJwaG9uZV8wNSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTMwLjAwMDAwMCwgLTIzLjAwMDAwMCkiPgogICAgICAgICAgICA8ZyBpZD0iTmF2aUJhciI+CiAgICAgICAgICAgICAgICA8ZyBpZD0ibG9nbyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzAuMDAwMDAwLCAyMy4wMDAwMDApIj4KICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNTMuNjc3ODY2NywyNCBMNjAuNjY2NjY2NywyNCBMNjAuNjY2NjY2NywxOCBMNTMuNjc3ODY2NywxOCBDNTAuMjQ3MTQyNCwxOCA0Ny40NjU2LDE1LjMxMzUgNDcuNDY1NiwxMiBDNDcuNDY1Niw4LjY4NjUgNTAuMjQ3MTQyNCw2IDUzLjY3Nzg2NjcsNiBMNjAuNjY2NjY2Nyw2IEw2MC42NjY2NjY3LDAgTDUzLjY3Nzg2NjcsMCBDNDYuODE2NDE4MSwwIDQxLjI1MzMzMzMsNS4zNzMgNDEuMjUzMzMzMywxMiBDNDEuMjUzMzMzMywxOC42MjcgNDYuODE2NDE4MSwyNCA1My42Nzc4NjY3LDI0IFoiIGlkPSJGaWxsLTEtQ29weS03IiBmaWxsPSIjRkZGRkZGIj48L3BhdGg+CiAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTcxLjQ5Njc5MDEsMTggTDY5LjIwNDkzODMsMTggTDY5LjIwNDkzODMsNiBMNzEuNDk2NzkwMSw2IEM3NC44NzE5MjQsNiA3Ny42MDgzOTUxLDguNjg2NSA3Ny42MDgzOTUxLDEyIEM3Ny42MDgzOTUxLDE1LjMxMzUgNzQuODcxOTI0LDE4IDcxLjQ5Njc5MDEsMTggTTcxLjQ5Njc5MDEsMCBMNjkuMjA0OTM4MywwIEw2My4wOTMzMzMzLDAgTDYzLjA5MzMzMzMsMjQgTDY5LjIwNDkzODMsMjQgTDcxLjQ5Njc5MDEsMjQgQzc4LjI0ODU4NTcsMjQgODMuNzIsMTguNjI3IDgzLjcyLDEyIEM4My43Miw1LjM3MyA3OC4yNDg1ODU3LDAgNzEuNDk2NzkwMSwwIiBpZD0iRmlsbC0zLUNvcHktNiIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJGaWxsLTUtQ29weS03IiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9Ijg0LjkzMzMzMzMgNC41IDg0LjkzMzMzMzMgNiA4NC45MzMzMzMzIDkgODQuOTMzMzMzMyAxNSA4NC45MzMzMzMzIDE4IDg0LjkzMzMzMzMgMTkuNSA4NC45MzMzMzMzIDI0IDEwMy4xMzMzMzMgMjQgMTAzLjEzMzMzMyAxOCA5MSAxOCA5MSAxNSAxMDAuMSAxNSAxMDAuMSA5IDkxIDkgOTEgNiAxMDMuMTMzMzMzIDYgMTAzLjEzMzMzMyAwIDg0LjkzMzMzMzMgMCI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJGaWxsLTktQ29weS02IiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjEwNS41NiAwIDExMy45MDE2NjcgMTIgMTA1LjU2IDI0IDExMy4xNDMzMzMgMjQgMTE3LjY5MzMzMyAxNy40NTU1IDEyMi4yNDMzMzMgMjQgMTI5LjgyNjY2NyAyNCAxMTMuMTQzMzMzIDAiPjwvcG9seWdvbj4KICAgICAgICAgICAgICAgICAgICA8cG9seWdvbiBpZD0iRmlsbC0xMS1Db3B5LTYiIGZpbGw9IiNGRkZGRkYiIHBvaW50cz0iMTI5LjgyNjY2NyAwIDEyMi4xMDU0NTUgMCAxMjEuMzMzMzMzIDEuMDAxMTQ2IDEyNS4xOTM5MzkgNiI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSLliIbnu4QtY29weS0yMSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik0xLjA1MTQwNDA0LDI0IEMwLjI0ODcxMTY0MSwyNCAtMC4yNTY4NDI4MjIsMjMuMDM2NDg3OCAwLjEzNTg0MTIyNiwyMi4yNTYxOTUxIEwxMC40MzA2NzMsMS43OTM1NjA5OCBDMTAuOTg3Njc1NCwwLjY4NjA0ODc4IDEyLjAzODE1NzcsMCAxMy4xNzczNjE1LDAgTDE3LjkzOTk2OCwwIEMxOC43NDIxMzU0LDAgMTkuMjQ4MjE0OSwwLjk2MzUxMjE5NSAxOC44NTU1MzA4LDEuNzQzODA0ODggTDguNTYwMTc0MDIsMjIuMjA2NDM5IEM4LjAwMzE3MTY1LDIzLjMxMzk1MTIgNi45NTI2ODkzMiwyNCA1LjgxMzQ4NTU5LDI0IEwxLjA1MTQwNDA0LDI0IFoiIGlkPSJGaWxsLTEiIGZpbGw9IiM1OUVGRUMiPjwvcGF0aD4KICAgICAgICAgICAgICAgICAgICAgICAgPHBhdGggZD0iTTIwLjA1NzAxMDksMjQgTDE1LjI5NDk0NjMsMjQgQzE0LjQ5MTczMTgsMjQgMTMuOTg2NzA0MSwyMy4wMzY0ODc4IDE0LjM3OTM4NjcsMjIuMjU2MTk1MSBMMjQuNjczNjU2OSwxLjc5MzU2MDk4IEMyNS4yMzA2NTcyLDAuNjg2MDQ4NzggMjYuMjgxNjYwOCwwIDI3LjQyMDg2MDUsMCBMMzIuMTgzNDUsMCBDMzIuOTg1NjE0NiwwIDMzLjQ5MTY5MjIsMC45NjM1MTIxOTUgMzMuMDk5MDA5NiwxLjc0MzgwNDg4IEwyMi44MDM2ODk1LDIyLjIwNjQzOSBDMjIuMjQ2Njg5MSwyMy4zMTM5NTEyIDIxLjE5NjIxMDUsMjQgMjAuMDU3MDEwOSwyNCIgaWQ9IkZpbGwtMyIgZmlsbD0iI0Q5ODA0MSI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMzIuOTgxOTY0Myw3Ljk2NzcxNjQ5IEwzMC41MzA0MjE3LDEyLjY1NzY0MTggQzI5Ljk4NjI4NDYsMTMuNjk4MjYxNyAyOS45ODYyODQ2LDE0Ljk2ODM1NDcgMzAuNTMwNDIxNywxNi4wMDg5NzQ3IEwzMy43OTMxMTcsMjIuMjUwNDExMyBDMzQuMzU3OTk4MywyMy4zMzA5ODkyIDM1LjQyMjMzNywyNCAzNi41NzY1NjczLDI0IEw0MS40MDE0NjI3LDI0IEM0Mi4yMTQyMTExLDI0IDQyLjcyNjk2NTksMjMuMDYwNDE2NiA0Mi4zMjkxMDIyLDIyLjI5OTUwMjUgTDM0LjgzNzI0MzMsNy45Njc3MTY0OSBDMzQuNDMxNDAxLDcuMTkwMjQ4MzUgMzMuMzg4MzM4NSw3LjE5MDI0ODM1IDMyLjk4MTk2NDMsNy45Njc3MTY0OSIgaWQ9IkZpbGwtNSIgZmlsbD0iI0ZGRkZGRiI+PC9wYXRoPgogICAgICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgICAgIDwvZz4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+"
  />
);

export const LogoSmall = ({ width, className }) => (
  <img
    className={classNames(className)}
    width={width}
    src="data:image/png;base64,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"
  />
);

export const SUPPORTED_CHAINS = ['mainnet', 'ropsten', 'kovan'];

export const BLOCHAIN_EXPLORER_BASE_URL = {
  mainnet: 'https://etherscan.io',
  ropsten: 'https://ropsten.etherscan.io',
  kovan: 'https://kovan.etherscan.io',
  goerli: 'https://goerli.etherscan.io',
};

export const SUBGRAPH_CLIENTS = {
  mainnet: new ApolloClient({
    uri: 'https://api.thegraph.com/subgraphs/name/mcdexio/mcdex-vote-mainnet',
    cache: new InMemoryCache(),
  }),
  ropsten: new ApolloClient({
    uri:
      'https://api.thegraph.com/subgraphs/name/sulliwane/mcdex-ropsten-subgraph',
    cache: new InMemoryCache(),
  }),
  kovan: new ApolloClient({
    uri:
      'https://api.thegraph.com/subgraphs/name/sulliwane/mcdex-kovan-subgraph',
    cache: new InMemoryCache(),
  }),
};

export const MCB_ADDRESS = {
  mainnet: '0x4e352cf164e64adcbad318c3a1e222e9eba4ce42',
  ropsten: '0x03fd756680df74b794134fe174f03e8bb1229936',
  kovan: '0xcb263ab066d982b285d20cec20153d1923e6969d',
};

export const UNI_MCB_POOL = {
  mainnet: '0x10cfa744c77f1cb9a77fa418ac4a1b6ec62bcce4',
  ropsten: '0x9e99f7d76563a9b087f159d2599478826d9f729d',
  kovan: '0x4fb542b239cddca757828ddee53487739f1bcdef',
};

export const VOTING_BOX = {
  mainnet: '0xb44a29b5fb1f6dc5730d721a2c12898e1e6c6c31',
  ropsten: '0x79a367A7045d359765f9CdE9424304c85b9F7A25',
  kovan: '0x66B16B80f09cb80a476f74dEF7315B39Ad53eF8F',
};

export const isValidLink = (link) =>
  link.includes('https://forum.mcdex.io/t/') && link.split('/').length === 6;

export const linkToTitle = (link) => {
  if (isValidLink(link)) {
    return link
      .split('/')[4]
      .split('-')
      .join(' ')
      .replace(/./, (x) => x.toUpperCase());
  }
  return link;
};

export const formatAddress = (address) =>
  address.substring(0, 6).concat('...').concat(address.slice(-4));

export const formatMCB = (mcb) =>
  new Intl.NumberFormat().format(Math.round(mcb));

export const calcVotingSummary = ({
  votes,
  uniMCBAccount,
  uniContract,
  mcbContract,
}) => {
  const votesSummary = votes.reduce(
    (acu, cur) => {
      const hasMCB = cur.voter.votesMCB.length > 0 ? true : false;
      const hasUni = cur.voter.votesUni.length > 0 ? true : false;
      const isNo = cur.content === 'AGAINST' ? true : false;
      const isYes = cur.content === 'FOR' ? true : false;
      return {
        ...acu,
        ...(isNo && {
          noVoters: acu.noVoters + 1,
        }),
        ...(isNo &&
          hasMCB && {
            noVotersMCB: acu.noVotersMCB + 1,
            noVotesMCB:
              acu.noVotesMCB + parseFloat(cur.voter.votesMCB[0].balance),
          }),
        ...(isNo &&
          hasUni && {
            noVotersUni: acu.noVotersUni + 1,
            noVotesUni:
              acu.noVotesUni + parseFloat(cur.voter.votesUni[0].balance),
          }),
        ...(isYes && {
          yesVoters: acu.yesVoters + 1,
        }),
        ...(isYes &&
          hasMCB && {
            yesVotersMCB: acu.yesVotersMCB + 1,
            yesVotesMCB:
              acu.yesVotesMCB + parseFloat(cur.voter.votesMCB[0].balance),
          }),
        ...(isYes &&
          hasUni && {
            yesVotersUni: acu.yesVotersUni + 1,
            yesVotesUni:
              acu.yesVotesUni + parseFloat(cur.voter.votesUni[0].balance),
          }),
      };
    },
    {
      noVoters: 0,
      noVotersMCB: 0,
      noVotersUni: 0,
      noVotesMCB: 0,
      noVotesUni: 0,
      yesVoters: 0,
      yesVotersMCB: 0,
      yesVotersUni: 0,
      yesVotesMCB: 0,
      yesVotesUni: 0,
    },
  );
  debug('votesSummary', votesSummary);
  const {
    noVoters,
    noVotersMCB,
    noVotersUni,
    noVotesMCB,
    noVotesUni,
    yesVoters,
    yesVotersMCB,
    yesVotersUni,
    yesVotesMCB,
    yesVotesUni,
  } = votesSummary;

  const uniMCBBalance = parseFloat(uniMCBAccount.balancesHistory[0].balance);
  const uniSharesSupply = parseFloat(
    uniContract.balancesHistory[0].totalSupply,
  );
  const mcbSupply = parseFloat(mcbContract.balancesHistory[0].totalSupply);
  const yesVotesUniPct = yesVotesUni / uniSharesSupply;
  const noVotesUniPct = noVotesUni / uniSharesSupply;
  const yesVotesUniMCB = yesVotesUniPct * uniMCBBalance;
  const noVotesUniMCB = noVotesUniPct * uniMCBBalance;

  const yesVotes = yesVotesMCB + yesVotesUniMCB;
  const noVotes = noVotesMCB + noVotesUniMCB;

  const yesVotesPct = yesVotes / (yesVotes + noVotes);
  const noVotesPct = 1 - yesVotesPct;

  return {
    ...votesSummary,
    yesVotesUniPct,
    noVotesUniPct,
    yesVotesUniMCB,
    noVotesUniMCB,
    yesVotes,
    noVotes,
    yesVotesPct,
    noVotesPct,
    uniMCBBalance,
    uniSharesSupply,
  };
};

export const calcVotingStatus = ({
  blockNumber,
  proposal,
  yesVotes,
  noVotes,
}) => {
  let votingStatus;
  if (blockNumber && blockNumber < proposal.beginBlock) {
    votingStatus = 'Created';
  } else if (
    blockNumber &&
    proposal.beginBlock <= blockNumber &&
    blockNumber <= proposal.endBlock
  ) {
    votingStatus = 'Active';
  } else if (blockNumber && blockNumber > proposal.endBlock) {
    votingStatus = yesVotes > noVotes ? 'Passed' : 'Failed';
  }
  return votingStatus;
};

export const calcSimpleVotingStatus = ({ blockNumber, proposal }) => {
  let votingStatus;
  if (blockNumber && blockNumber < proposal.beginBlock) {
    votingStatus = 'Created';
  } else if (
    blockNumber &&
    proposal.beginBlock <= blockNumber &&
    blockNumber <= proposal.endBlock
  ) {
    votingStatus = 'Active';
  } else if (blockNumber && blockNumber > proposal.endBlock) {
    votingStatus = 'Ended';
  }
  return votingStatus;
};
