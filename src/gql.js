import { gql } from '@apollo/client';

export const getProposals = gql`
  query getProposal {
    proposals {
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
    $addressUniswap: String!
    $balanceBlock: BigInt!
  ) {
    mcbContract: contract(id: $addressMCB) {
      id
      balancesHistory(
        orderBy: block
        orderDirection: desc
        where: { block_lte: $balanceBlock }
        first: 1
      ) {
        id
        balance
        totalSupply
        block
      }
    }
    uniContract: contract(id: $addressUniswap) {
      id
      balancesHistory(
        orderBy: block
        orderDirection: desc
        where: { block_lte: $balanceBlock }
        first: 1
      ) {
        id
        balance
        totalSupply
        block
      }
    }
    uniMCBAccount: account(id: $addressUniswap) {
      id
      balancesHistory(
        orderBy: block
        orderDirection: desc
        where: { block_lte: $balanceBlock }
        first: 1
      ) {
        id
        balance
        totalSupply
        block
      }
    }
    proposal(id: $id) {
      id
      link
      beginBlock
      endBlock
      transaction {
        id
        from {
          id
        }
      }
      votes {
        id
        content
        transaction {
          id
        }
        voter {
          id
          votesMCB: balancesHistory(
            orderBy: block
            orderDirection: desc
            where: { contract: $addressMCB, block_lte: $balanceBlock }
            first: 1
          ) {
            contract {
              id
            }
            balance
            totalSupply
            block
          }
          votesUni: balancesHistory(
            orderBy: block
            orderDirection: desc
            where: { contract: $addressUniswap, block_lte: $balanceBlock }
            first: 1
          ) {
            contract {
              id
            }
            balance
            totalSupply
            block
          }
        }
      }
    }
  }
`;

export const getVoter = gql`
  query getProposal($id: ID!, $addressUniswap: String!) {
    uniMCBAccount: account(id: $addressUniswap) {
      id
      balancesLatest {
        id
        balance
        totalSupply
        block
      }
    }
    account(id: $id) {
      id
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
        }
        content
      }
    }
  }
`;
