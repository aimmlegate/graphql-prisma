import { GraphQLServer } from "graphql-yoga";
import prisma from "./prisma";
import { resolvers, fragmentReplacements } from "./resolvers";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  fragmentReplacements,
  resolvers,
  context: req => ({
    prisma,
    req
  })
});

server.start(() => console.log("server up"));
