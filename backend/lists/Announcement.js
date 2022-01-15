const { Relationship, DateTime, Text } = require("@keystonejs/fields");
const moment = require("moment");

module.exports = {
  fields: {
    user: { type: Relationship, ref: "User", isRequired: true },
    classroom: { type: Relationship, ref: "Class", isRequired: true },
    date: {
      type: DateTime,
      format: "dd/MM/yyyy HH:mm O",
      defaultValue: () => moment().toISOString(),
    },
    links: { type: Text },
    text: { type: Text },
  },
};
