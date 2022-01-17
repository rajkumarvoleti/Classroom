const shortid = require("shortid");
const { Text, Relationship, Url, Select } = require("@keystonejs/fields");

const bannerOptions = [
  {
    value: "https://gstatic.com/classroom/themes/img_read.jpg",
    label: "banner1",
    dataType: "string",
  },
  {
    value: "https://gstatic.com/classroom/themes/img_reachout.jpg",
    label: "banner2",
    dataType: "string",
  },
  {
    value: "https://gstatic.com/classroom/themes/img_code.jpg",
    label: "banner3",
    dataType: "string",
  },
  {
    value: "https://gstatic.com/classroom/themes/Honors.jpg",
    label: "banner4",
    dataType: "string",
  },
  {
    value: "https://gstatic.com/classroom/themes/img_graduation.jpg",
    label: "banner5",
    dataType: "string",
  },
  {
    value: "https://gstatic.com/classroom/themes/img_learnlanguage.jpg",
    label: "banner6",
    dataType: "string",
  },
];

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
    banner: {
      type: Select,
      options: bannerOptions,
      dataType: "string",
    },
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
