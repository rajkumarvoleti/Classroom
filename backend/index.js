const { Keystone } = require("@keystonejs/keystone");
const { PasswordAuthStrategy } = require("@keystonejs/auth-password");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const initialiseData = require("./initial-data");
require("dotenv").config();
const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");
const User = require("./lists/User");
const Class = require("./lists/Class");
const JoinClass = require("./resolvers/JoinClass");

const PROJECT_NAME = "backend";
const adapterConfig = {
  mongoUri: process.env.MONGO_URI,
};

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  cookieSecret: process.env.COOKIE_SECRET,
  onConnect: process.env.CREATE_TABLES !== "true" && initialiseData,
});

//lists
const userList = keystone.createList("User", User);
const classList = keystone.createList("Class", Class);

//extendedschemas
keystone.extendGraphQLSchema({
  types: [
    {
      type: "type JoinClassOutput { message: String! }",
    },
  ],
  mutations: [
    {
      schema:
        "joinClass(code: String!,userId: ID!,isTeacher: Boolean!): JoinClassOutput",
      resolver: (parent, { code, userId, isTeacher }) =>
        JoinClass(classList, { code, userId, isTeacher }),
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
