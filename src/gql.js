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
  {
    proposals {
      id
      timestamp
      beginBlock
      endBlock
      link
      transaction {
        id
        timestamp
        blockNumber
        from {
          id
        }
      }
      votes {
        id
      }
    }
  }
`;

export const getProposal = gql`
  query getProposal($id: ID!) {
    proposal(id: $id) {
      id
      link
      beginBlock
      endBlock
      votes {
        id
        transaction {
          id
        }
        voter {
          id
        }
        content
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
