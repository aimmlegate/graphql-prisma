const Query = {
  users: (parent, args, { db, prisma }, info) => {
    return prisma.query.users(null, info);
    // if (!args.query) {
    //   return db.users;
    // }
    // return db.users.filter(usr =>
    //   usr.name.toLowerCase().includes(args.query.toLowerCase())
    // );
  },
  posts: (parent, args, { db, prisma }, info) => {
    return prisma.query.posts(null, info);
    // if (!args.query) {
    //   return db.posts;
    // }
    // return db.posts.filter(
    //   pst =>
    //     pst.title.toLowerCase().includes(args.query.toLowerCase()) ||
    //     pst.body.toLowerCase().includes(args.query.toLowerCase())
    // );
  },
  comments: (parent, args, { db }) => db.comments
};

export { Query as default };
