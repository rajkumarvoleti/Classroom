import gql from "graphql-tag";

export const CREATE_CLASS_MUTATION = gql`
  mutation CREATE_CLASS_MUTATION(
    $name: String!
    $section: String
    $subject: String
    $userId: ID!
  ) {
    createClass(
      data: {
        name: $name
        section: $section
        subject: $subject
        author: { connect: { id: $userId } }
        teachers: { connect: [{ id: $userId }] }
      }
    ) {
      name
      teachers {
        name
      }
    }
  }
`;

export const JOIN_CLASS = gql`
  mutation JOIN_CLASS($code: String!, $userId: ID!, $isTeacher: Boolean!) {
    joinClass(code: $code, userId: $userId, isTeacher: $isTeacher) {
      message
    }
  }
`;
