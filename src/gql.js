import { gql } from '@apollo/client';

export const getProposals = gql`
  query getProposal {
    proposals(
      orderBy:timestamp
      orderDirection:desc
    ) {
      id
      timestamp
      beginBlock
      endBlock
      link
    }
  }
`;

export const getProposalByID = gql`
  query getProposal($id: ID!) {
    proposal(id: $id) {
      id
      link
      beginBlock
      endBlock
    }
  }
`;

export const getProposal = gql`
  query getProposal(
    $id: ID!
    $addressMCB: String!
    $addressUniswapMCBETH: String!
    $addressUniswapMCBUSDC: String!
    $balanceBlock: BigInt!
  ) {
    uniMCBETHContract: contract(id: $addressUniswapMCBETH) {
      balancesHistory(
        orderBy: block
        orderDirection: desc
        where: { block_lte: $balanceBlock }
        first: 1
      ) {
        totalSupply
      }
    }
    uniMCBUSDCContract: contract(id: $addressUniswapMCBUSDC) {
      balancesHistory(
        orderBy: block
        orderDirection: desc
        where: { block_lte: $balanceBlock }
        first: 1
      ) {
        totalSupply
      }
    }
    uniMCBETHAccount: account(id: $addressUniswapMCBETH) {
      balancesHistory(
        orderBy: block
        orderDirection: desc
        first: 1
        where: {
          contract: $addressMCB
          block_lte: $balanceBlock
        }
      ) {
        balance
      }
    }
    uniMCBUSDCAccount: account(id: $addressUniswapMCBUSDC) {
      balancesHistory(
        orderBy: block
        orderDirection: desc
        first: 1
        where: {
          contract: $addressMCB
          block_lte: $balanceBlock
        }
      ) {
        balance
      }
    }
    proposal(id: $id) {
      id
      link
      beginBlock
      endBlock
      proposer {
        id
      }
      votes {
        id
        content
        voter {
          id
          votesMCB: balancesHistory(
            orderBy: block
            orderDirection: desc
            where: { contract: $addressMCB, block_lte: $balanceBlock }
            first: 1
          ) {
            balance
          }
          votesUniMCBETH: balancesHistory(
            orderBy: block
            orderDirection: desc
            where: { contract: $addressUniswapMCBETH, block_lte: $balanceBlock }
            first: 1
          ) {
            balance
          }
          votesUniMCBUSDC: balancesHistory(
            orderBy: block
            orderDirection: desc
            where: { contract: $addressUniswapMCBUSDC, block_lte: $balanceBlock }
            first: 1
          ) {
            balance
          }
        }
      }
    }
  }
`;
export const getVoter = gql`
  query getVoter(
    $id: ID!,
    $addressUniswapMCBETH: String!,
    $addressUniswapMCBUSDC: String!,
    $addressMCB: String!
  ) {
    uniMCBETHAccount: account(id: $addressUniswapMCBETH) {
      balancesHistory(
        orderBy: block
        orderDirection: desc
        first: 1
        where: {
          contract: $addressMCB
        }
      ) {
        balance
      }
    }
    uniMCBUSDCAccount: account(id: $addressUniswapMCBUSDC) {
      balancesHistory(
        orderBy: block
        orderDirection: desc
        first: 1
        where: {
          contract: $addressMCB
        }
      ) {
        balance
      }
    }
    uniMCBETHContract: contract(id: $addressUniswapMCBETH) {
      balancesHistory(orderBy: block, orderDirection: desc, first: 1) {
        totalSupply
      }
    }
    uniMCBUSDCContract: contract(id: $addressUniswapMCBUSDC) {
      balancesHistory(orderBy: block, orderDirection: desc, first: 1) {
        totalSupply
      }
    }
    account(id: $id) {
      balances: balancesLatest {
        id
        balance
        totalSupply
        contract {
          id
        }
      }
      votes {
        id
        timestamp
        proposal {
          id
          link
          endBlock
          beginBlock
        }
        content
      }
    }
  }
`;
