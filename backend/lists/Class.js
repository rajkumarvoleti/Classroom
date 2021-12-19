const { v4: uuid } = require("uuid");
const { Text, Relationship, DateTime } = require("@keystonejs/fields");

module.exports = {
  fields: {
    name: { type: Text, required: true },
    section: { type: Text },
    subject: { type: Text },
    author: {
      type: Relationship,
      ref: "User.authorClasses",
      many: false,
      required: true,
    },
    teachers: {
      type: Relationship,
      ref: "User.teacherClasses",
      many: true,
      required: true,
    },
    students: { type: Relationship, ref: "User.studentClasses", many: true },
    studentInviteCode: { type: Text, unique: true, defaultValue: uuid },
    teacherInviteCode: { type: Text, unique: true, defaultValue: uuid },
  },
  // List-level access controls
  access: {
    read: true,
    update: true,
    create: true,
    delete: true,
    auth: true,
  },
};
