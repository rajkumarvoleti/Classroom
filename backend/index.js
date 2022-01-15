const { Keystone } = require("@keystonejs/keystone");
const { PasswordAuthStrategy } = require("@keystonejs/auth-password");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const initialiseData = require("./initial-data");
require("dotenv").config();
const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");
const User = require("./lists/User");
const Class = require("./lists/Class");
const Announcement = require("./lists/Announcement");
const JoinClass = require("./resolvers/JoinClass");
const UnEnroll = require("./resolvers/UnEnroll");
const MongoStore = require("connect-mongo");

const PROJECT_NAME = "backend";
const adapterConfig = {
  mongoUri: process.env.MONGO_URI,
};

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  cookieSecret: process.env.COOKIE_SECRET,
  sessionStore: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
  }),
  cookie: {
    secure: false,
  },
  onConnect: process.env.CREATE_TABLES !== "true" && initialiseData,
});

//lists
const userList = keystone.createList("User", User);
const classList = keystone.createList("Class", Class);
keystone.createList("Announcement", Announcement);

//extendedschemas
keystone.extendGraphQLSchema({
  types: [
    {
      type: "type JoinClassOutput { message: String! }",
    },
    {
      type: "type UnEnrollOutput { message: String! }",
    },
  ],
  mutations: [
    {
      schema:
        "joinClass(code: String!,userId: ID!,isTeacher: Boolean!): JoinClassOutput",
      resolver: (parent, { code, userId, isTeacher }) =>
        JoinClass(classList, { code, userId, isTeacher }),
    },
    {
      schema: "unEnroll(userId: ID!,classId: ID!): UnEnrollOutput",
      resolver: (parent, { userId, classId }) =>
        UnEnroll(classList, { userId, classId }),
    },
  ],
});

// Access control functions
// const userIsAdmin = ({ authentication: { item: user } }) =>
//   Boolean(user && user.isAdmin);
// const userOwnsItem = ({ authentication: { item: user } }) => {
//   if (!user) {
//     return false;
//   }

//   // Instead of a boolean, you can return a GraphQL query:
//   // https://www.keystonejs.com/api/access-control#graphqlwhere
//   return { id: user.id };
// };

// const userIsAdminOrOwner = (auth) => {
//   const isAdmin = access.userIsAdmin(auth);
//   const isOwner = access.userOwnsItem(auth);
//   return isAdmin ? isAdmin : isOwner;
// };

// const access = { userIsAdmin, userOwnsItem, userIsAdminOrOwner };

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: "User",
  config: { protectIdentities: process.env.NODE_ENV === "production" },
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      name: "Classroom",
      enableDefaultRoute: true,
      authStrategy,
    }),
  ],
};
