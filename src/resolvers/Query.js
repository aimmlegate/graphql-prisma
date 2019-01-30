import getUserId from "../utils/getUserId";

const Query = {
  me: (parent, args, { prisma, req }, info) => {
    const userId = getUserId(req);
    return prisma.query.user({ where: { id: userId } }, info);
  },
  users: (parent, args, { prisma }, info) => {
    const constructQuery = args => {
      if (args.query) {
        return {
          where: {
            OR: [{ name_contains: args.query }]
          },
          first: args.first,
          skip: args.skip
        };
      }
      return {
        first: args.first,
        skip: args.skip
      };
    };

    const query = constructQuery(args);

    return prisma.query.users(query, info);
  },
  posts: (parent, args, { prisma }, info) => {
    const constructQuery = args => {
      if (args.query) {
        return {
          where: {
            published: true,
            OR: [{ title_contains: args.query }, { body_contains: args.query }]
          },
          first: args.first,
          skip: args.skip
        };
      }
      return { where: { published: true }, first: args.first, skip: args.skip };
    };

    const query = constructQuery(args);

    return prisma.query.posts(query, info);
  },
  myPosts: async (parent, args, { prisma, req }, info) => {
    const userId = getUserId(req);
    const constructQuery = args => {
      if (args.query) {
        return {
          where: {
            id: { author: { author: { id: userId } } },
            OR: [{ title_contains: args.query }, { body_contains: args.query }]
          }
        };
      }
      return { where: { author: { id: userId } } };
    };
    console.log(constructQuery(args));
    const posts = await prisma.query.posts(constructQuery(args), info);
    return console.log(posts) || posts;
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
