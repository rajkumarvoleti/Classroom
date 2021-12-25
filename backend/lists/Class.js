const shortid = require("shortid");
const { Text, Relationship } = require("@keystonejs/fields");

module.exports = {
  fields: {
    name: { type: Text, required: true },
    section: { type: Text },
    subject: { type: Text },
    author: {
      type: Relationship,
      ref: "User",
      many: false,
      required: true,
    },
    teachers: {
      type: Relationship,
      ref: "User",
      many: true,
      required: true,
    },
    students: { type: Relationship, ref: "User", many: true },
    studentInviteCode: {
      type: Text,
      unique: true,
      defaultValue: shortid.generate,
    },
    teacherInviteCode: {
      type: Text,
      unique: true,
      defaultValue: shortid.generate,
    },
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
