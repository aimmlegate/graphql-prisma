import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../../src/prisma";

const userOne = {
  input: {
    name: "Jen",
    email: "jen@example.com",
    password: bcrypt.hashSync("Red09121234")
  },
  user: undefined,
  jwt: undefined
};

const seedDB = async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  userOne.user = await prisma.mutation.createUser({
    data: {
      name: "Jen",
      email: "jen@example.com",
      password: bcrypt.hashSync("Red09121234")
    }
  });
  userOne.jwt = jwt.sign({ userId: userOne.user.id }, process.env.JWT_SECRET);

  await prisma.mutation.createPost({
    data: {
      title: "Test post 1",
      body: "this post published",
      published: true,
      author: {
        connect: { id: userOne.user.id }
      }
    }
  });

  await prisma.mutation.createPost({
    data: {
      title: "Test post 2",
      body: "this post not published",
      published: false,
      author: {
        connect: { id: userOne.user.id }
      }
    }
  });
};

export { seedDB as default, userOne };
