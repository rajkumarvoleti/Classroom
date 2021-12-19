const {
  Text,
  Checkbox,
  Password,
  Url,
  Relationship,
} = require("@keystonejs/fields");

module.exports = {
  fields: {
    name: { type: Text },
    email: {
      type: Text,
      isUnique: true,
    },
    isAdmin: {
      type: Checkbox,
      access: {
        update: true,
      },
    },
    password: {
      type: Password,
    },
    image: {
      type: Url,
    },
    studentClasses: {
      type: Relationship,
      many: true,
      ref: "Class.students",
    },
    teacherClasses: {
      type: Relationship,
      many: true,
      ref: "Class.teachers",
    },
    authorClasses: {
      type: Relationship,
      many: true,
      ref: "Class.author",
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
