import gql from "graphql-tag";

export const CREATE_ANNOUNCEMENT = gql`
  mutation CREATE_ANNOUNCEMENT(
    $userId: ID!
    $classId: ID!
    $text: String
    $links: String
  ) {
    createAnnouncement(
      data: {
        user: { connect: { id: $userId } }
        classroom: { connect: { id: $classId } }
        text: $text
        links: $links
      }
    ) {
      text
      links
    }
  }
`;
