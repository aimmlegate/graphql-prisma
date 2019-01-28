import getUserId from "../utils/getUserId";

const Query = {
  users: (parent, args, { prisma }, info) => {
    const constructQuery = args => {
      if (args.query) {
        return {
          where: {
            OR: [{ name_contains: args.query }, { email_contains: args.query }]
          }
        };
      }
      return null;
    };

    const query = constructQuery(args);

    return prisma.query.users(query, info);
  },
  posts: (parent, args, { prisma }, info) => {
    const constructQuery = args => {
      if (args.query) {
        return {
          where: {
            OR: [{ title_contains: args.query }, { body_contains: args.query }]
          }
        };
      }
      return null;
    };

    const query = constructQuery(args);

    return prisma.query.posts(query, info);
  },
  comments: (parent, args, { prisma }, info) => {
    return prisma.query.comments(null, info);
  },
  post: async (parent, { id }, { prisma, req }, info) => {
    const userId = getUserId(req, false);

    const [post] = await prisma.query.posts({
      where: {
        id,
        OR: [
          {
            published: true
          },
          {
            author: { id: userId }
          }
        ]
      }
    });

    if (!post) {
      throw new Error("Post not found");
    }

    return post;
  }
};

export { Query as default };
