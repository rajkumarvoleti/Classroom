import gql from "graphql-tag";

export const GET_USER_ID = gql`
  query GET_USER_ID($email: String!) {
    allUsers(where: { email: $email }) {
      id
    }
  }
`;

