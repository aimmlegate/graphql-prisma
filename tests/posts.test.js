import "@babel/polyfill/noConflict";
import "cross-fetch/polyfill";
import { gql } from "apollo-boost";
// import prisma from "../src/prisma";
import seedDB, { userOne } from "./utils/seedDB";
import getClient from "./utils/getClent";

const client = getClient();

beforeEach(seedDB);

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

test("Should fetch usr posts", async () => {
  const client = getClient(userOne.jwt);

  const myPosts = gql`
    query {
      myPosts {
        id
      }
    }
  `;

  const { data } = await client.query({ query: myPosts });

  expect(data.myPosts.length).toBe(2);
});
