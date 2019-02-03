import "@babel/polyfill/noConflict";
import "cross-fetch/polyfill";
import ApolloBoost, { gql } from "apollo-boost";
import bcrypt from "bcryptjs";
import prisma from "../src/prisma";

const client = new ApolloBoost({
  uri: "http://localhost:4001"
});

beforeEach(async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();
  const user = await prisma.mutation.createUser({
    data: {
      name: "Jen",
      email: "jen@example.com",
      password: bcrypt.hashSync("Red09121234")
    }
  });

  await prisma.mutation.createPost({
    data: {
      title: "Test post 1",
      body: "this post published",
      published: true,
      author: {
        connect: { id: user.id }
      }
    }
  });

  await prisma.mutation.createPost({
    data: {
      title: "Test post 2",
      body: "this post not published",
      published: false,
      author: {
        connect: { id: user.id }
      }
    }
  });
});

test("Should create a new user", async () => {
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

  const {
    data: {
      createUser: { id }
    }
  } = await client.mutate({
    mutation: createUser
  });

  const isUserCreated = await prisma.exists.User({
    id
  });

  expect(isUserCreated).toBe(true);
});
