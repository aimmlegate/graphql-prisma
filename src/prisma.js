import { Prisma } from "prisma-binding";
import { fragmentReplacements } from "./resolvers";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  fragmentReplacements,
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: "A670E5C79BAE9BDD9C9921B12B018F8C29679E5F06E425290C827E6E4743219B"
});

export { prisma as default };
