import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Mutation = {
  login: async (parent, { data: { email, password } }, { prisma }, info) => {
    const isUserExist = await prisma.exists.User({ email });
    if (!isUserExist) {
      throw new Error("User dont exist");
    }

    const user = await prisma.query.user({
      where: { email }
    });

    const { password: hashPassword } = user;
    const isPasswordCorrect = await bcrypt.compare(password, hashPassword);
    if (!isPasswordCorrect) {
      throw new Error("Unable to login");
    }

    return {
      user,
      token: jwt.sign({ userId: user.id }, "secrethurrdurr")
    };
  },

  createUser: async (parent, args, { prisma }, info) => {
    const isEmailTaken = await prisma.exists.User({ email: args.data.email });

    if (args.data.password.length < 8) {
      throw new Error("Password must be 8 char or longer");
    }

    if (isEmailTaken) {
      throw new Error("Email is taken");
    }

    const password = await bcrypt.hash(args.data.password, 10);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });

    return {
      user,
      token: jwt.sign({ userId: user.id }, "secrethurrdurr")
    };
  },

  deleteUser: async (parent, { id }, { prisma }, info) => {
    const isUserExist = await prisma.exists.User({ id });

    if (!isUserExist) {
      throw new Error("User not found");
    }

    const user = await prisma.mutation.deleteUser({ where: { id } }, info);

    return user;
  },

  updateUser: async (parent, { id, data }, { prisma }, info) => {
    const isUserExist = await prisma.exists.User({ id });

    if (!isUserExist) {
      throw new Error("User not found");
    }

    const user = prisma.mutation.updateUser({ where: { id }, data }, info);

    return user;
  },

  createPost: async (
    parent,
    { data: { title, body, published, author } },
    { prisma },
    info
  ) => {
    return await prisma.mutation.createPost(
      {
        data: { title, body, published, author: { connect: { id: author } } }
      },
      info
    );
  },

  deletePost: async (parent, { id }, { prisma }) => {
    return await prisma.mutation.deletePost({ where: { id } }, info);
  },

  updatePost: async (parent, { id, data }, { prisma }, info) => {
    return await prisma.mutation.updatePost({ where: { id }, data }, info);
  },

  createComment: async (
    parent,
    { data: { text, author, post } },
    { prisma },
    info
  ) => {
    return prisma.mutation.createComment(
      {
        data: {
          text,
          author: { connect: { id: author } },
          post: { connect: { id: post } }
        }
      },
      info
    );
  },

  updateComment: async (parent, { id, data }, { prisma }, info) => {
    return prisma.mutation.updateComment({ where: { id }, data }, info);
  },

  deleteComment: async (parent, { id }, { prisma }, info) => {
    return prisma.mutation.deleteComment({ where: { id } }, info);
  }
};

export { Mutation as default };
