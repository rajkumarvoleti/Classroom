const { Text, Checkbox, Password, Url } = require("@keystonejs/fields");

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
