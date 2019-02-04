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

test("Should expose public author profiles", async () => {
  const getUsers = gql`
    query {
      users {
        id
        name
        email
      }
    }
  `;

  const response = await client.query({ query: getUsers });

  expect(response.data.users.length).toBe(1);
  expect(response.data.users[0].email).toBe(null);
  expect(response.data.users[0].name).toBe("Jen");
});

test("Should expose public posts", async () => {
  const getPosts = gql`
    query {
      posts {
        id
        title
      }
    }
  `;

  const response = await client.query({ query: getPosts });

  expect(response.data.posts.length).toBe(1);
});

test("Should not login with bad credentials", async () => {
  const login = gql`
    mutation {
      login(data: { email: "exaple@email.ru", password: "password" }) {
        token
      }
    }
  `;
  await expect(client.mutate({ mutation: login })).rejects.toThrow();
});

test("Should login with correct credentials", async () => {
  const login = gql`
    mutation {
      login(data: { email: "jen@example.com", password: "Red09121234" }) {
        token
      }
    }
  `;
});

test("Should not create a user with short pass", async () => {
  const createUser = gql`
    mutation {
      createUser(
        data: { name: "Andrew2", email: "andrew2@example2.com", password: "My" }
      ) {
        token
        user {
          id
        }
      }
    }
  `;

  await expect(client.mutate({ mutation: createUser })).rejects.toThrow();
});
