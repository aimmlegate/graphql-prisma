import bcrypt from "bcryptjs";
import getUserId from "../utils/getUserId";
import { genJwt } from "../utils/tokenSecret";
import hashPass from "../utils/hashPass";

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
      token: genJwt(user.id)
    };
  },

  createUser: async (parent, args, { prisma }, info) => {
    const isEmailTaken = await prisma.exists.User({ email: args.data.email });

    if (isEmailTaken) {
      throw new Error("Email is taken");
    }

    const password = await hashPass(args.data.password);
    console.log(password);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password
      }
    });

    return {
      user,
      token: genJwt(user.id)
    };
  },

  deleteUser: async (parent, args, { prisma, req }, info) => {
    const userId = getUserId(req);

    const user = await prisma.mutation.deleteUser(
      { where: { id: userId } },
      info
    );

    return user;
  },

  updateUser: async (parent, { data }, { prisma, req }, info) => {
    const userId = getUserId(req);

    const password = await hashPass(data.password);
    console.log(password);

    const user = await prisma.mutation.updateUser(
      { where: { id: userId }, data: { ...data, password } },
      info
    );

    return user;
  },

  createPost: async (
    parent,
    { data: { title, body, published } },
    { prisma, req },
    info
  ) => {
    const userId = getUserId(req);
    return prisma.mutation.createPost(
      {
        data: { title, body, published, author: { connect: { id: userId } } }
      },
      info
    );
  },

  deletePost: async (parent, { id }, { prisma, req }, info) => {
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });

    if (!postExists) {
      throw new Error("Unable to delete");
    }

    return prisma.mutation.deletePost({ where: { id } }, info);
  },

  updatePost: async (parent, { id, data }, { prisma, req }, info) => {
    const userId = getUserId(req);
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    });
    if (!postExists) {
      throw new Error("Unable to update");
    }

    const isPostPublished = await prisma.exists.Post({
      id,
      published: true
    });

    const isUnPublished = !data.published;

    if (isPostPublished && isUnPublished) {
      await prisma.mutation.deleteManyComments({ where: { post: { id } } });
    }

    return prisma.mutation.updatePost({ where: { id }, data }, info);
  },

  createComment: async (
    parent,
    { data: { text, post } },
    { prisma, req },
    info
  ) => {
    const userId = getUserId(req);

    const isPostExistPublished = await prisma.exists.Post({
      id: post,
      published: true
    });

    if (!isPostExistPublished) {
      throw new Error("post not exist");
    }

    return prisma.mutation.createComment(
      {
        data: {
          text,
          author: { connect: { id: userId } },
          post: { connect: { id: post } }
        }
      },
      info
    );
  },

  updateComment: async (parent, { id, data }, { prisma, req }, info) => {
    const userId = getUserId(req);
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });
    if (!commentExists) {
      throw new Error("unable to delete");
    }

    return prisma.mutation.updateComment({ where: { id }, data }, info);
  },

  deleteComment: async (parent, { id }, { prisma, req }, info) => {
    const userId = getUserId(req);
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    });
    if (!commentExists) {
      throw new Error("unable to delete");
    }

    return prisma.mutation.deleteComment({ where: { id } }, info);
  }
};

export { Mutation as default };
