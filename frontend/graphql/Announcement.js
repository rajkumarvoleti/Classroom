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

export const ALL_ANNOUNCEMENTS = gql`
  query ALL_ANNOUNCEMENTS($id: ID!) {
    allAnnouncements(where: { classroom: { id: $id } }, sortBy: date_DESC) {
      id
      user {
        id
        name
        image
      }
      classroom {
        id
      }
      date
      links
      text
    }
  }
`;

export const DELETE_ANNOUNCEMENT = gql`
  mutation DELETE_ANNOUNCEMENT($id: ID!) {
    deleteAnnouncement(id: $id) {
      id
    }
  }
`;
