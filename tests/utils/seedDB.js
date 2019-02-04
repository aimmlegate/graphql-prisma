import bcrypt from "bcryptjs";
import prisma from "../../src/prisma";

const seedDB = async () => {
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
};

export { seedDB as default };
