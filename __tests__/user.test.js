import "@babel/polyfill/noConflict";
import "cross-fetch/polyfill";
import ApolloBoost, { gql } from "apollo-boost";
import prisma from "../src/prisma";

const client = new ApolloBoost({
  uri: "http://localhost:4001"
});

test("Shold create a new user", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: {
          name: "Andrew"
          email: "andrew@example.com"
          password: "MyPass123"
        }
      ) {
        token
        user {
          id
        }
      }
    }
  `;

  const resp = await client.mutate({
    mutation: createUser
  });

  const isUserCreated = await prisma.exists.User({
    email: "andrew@example.com"
  });

  expect(isUserCreated).toBe(true);
});
