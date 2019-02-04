import "@babel/polyfill/noConflict";
import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
import prisma from "../src/prisma";
import seedDB, { userOne } from "./utils/seedDB";
import getClient from "./utils/getClent";

const client = getClient();

beforeEach(seedDB);

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

test("Should fetch user profile", async () => {
  const client = getClient(userOne.jwt);

  const getProfile = gql`
    query {
      me {
        id
        name
        email
      }
    }
  `;

  const {
    data: {
      me: { id }
    }
  } = await client.query({ query: getProfile });

  expect(id).toBe(userOne.user.id);
});
