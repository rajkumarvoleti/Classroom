import gql from "graphql-tag";

export const CREATE_CLASS_MUTATION = gql`
  mutation CREATE_CLASS_MUTATION(
    $name: String!
    $section: String
    $subject: String
    $banner: String
    $userId: ID!
  ) {
    createClass(
      data: {
        name: $name
        section: $section
        subject: $subject
        author: { connect: { id: $userId } }
        teachers: { connect: [{ id: $userId }] }
        banner: $banner
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

export const GET_STUDENT_CLASSES = gql`
  query GET_STUDENT_CLASSES($id: ID!) {
    allClasses(where: { students_some: { id: $id } }) {
      id
    }
  }
`;

export const GET_TEACHER_CLASSES = gql`
  query GET_TEACHER_CLASSES($id: ID!) {
    allClasses(where: { teachers_some: { id: $id } }) {
      id
    }
  }
`;

export const GET_STUDENT_CLASSNAMES = gql`
  query GET_STUDENT_CLASSES($id: ID!) {
    allClasses(where: { students_some: { id: $id } }) {
      id
      name
    }
  }
`;

export const GET_TEACHER_CLASSNAMES = gql`
  query GET_TEACHER_CLASSES($id: ID!) {
    allClasses(where: { teachers_some: { id: $id } }) {
      id
      name
    }
  }
`;

export const GET_CLASS_CARD_DATA = gql`
  query GET_CLASS_CARD_DATA($id: ID!) {
    Class(where: { id: $id }) {
      name
      section
      subject
      author {
        name
        image
      }
      banner
    }
  }
`;

export const UNENROLL_CLASS = gql`
  mutation UNENROLL_CLASS($userId: ID!, $classId: ID!) {
    unEnroll(userId: $userId, classId: $classId) {
      message
    }
  }
`;

export const CLASS_DATA = gql`
  query CLASS_DATA($id: ID!) {
    Class(where: { id: $id }) {
      id
      name
      section
      subject
      author {
        id
        name
        image
      }
      teachers {
        id
        name
        image
      }
      students {
        id
        name
        image
      }
      studentInviteCode
      teacherInviteCode
      banner
    }
  }
`;
