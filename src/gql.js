import { gql } from '@apollo/client';

export const getAccountsBalancesHistory = gql`
  {
    accounts(where: { id_in: ["0x2d0f2bbdf6b967dbea7ee453228e754cf85e6f7d"] }) {
      id
      balancesHistory(
        orderBy: block
        orderDirection: desc
        first: 1
        where: { block_lte: 8450228 }
      ) {
        balance
        block
      }
    }
  }
`;

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
  query getProposal($id: ID!) {
    account(id: $id) {
      id
      votes {
        id
        timestamp
        proposal {
          id
          link
        }
        content
      }
    }
  }
`;
