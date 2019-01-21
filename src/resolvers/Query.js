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
  comments: (parent, args, { db }) => db.comments
};

export { Query as default };
