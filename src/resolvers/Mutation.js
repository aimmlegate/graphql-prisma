import uuidv4 from "uuid/v4";

const Mutation = {
  createUser: async (parent, args, { prisma }, info) => {
    const isEmailTaken = await prisma.exists.User({ email: args.data.email });

    if (isEmailTaken) {
      throw new Error("Email is taken");
    }

    const user = await prisma.mutation.createUser({ data: args.data }, info);

    return user;
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

  deletePost: (parent, args, { db, pubsub }) => {
    const { id } = args;
    const isPostExist = db.posts.some(pst => pst.id === id);

    if (!isPostExist) {
      throw new Error(" Post not found");
    }

    const deletedPost = db.posts.find(pst => pst.id === id);
    db.posts = db.posts.filter(pst => {
      const isMatch = pst.id === id;
      if (isMatch) {
        db.comments = db.comments.filter(cmnt => cmnt.post !== pst.id);
      }
      return !isMatch;
    });

    if (deletedPost.published) {
      pubsub.publish("post", {
        post: { mutation: "DELETED", data: deletedPost }
      });
    }

    return deletedPost;
  },

  updatePost: (parent, args, { db, pubsub }) => {
    const { id, data } = args;
    let post = db.posts.find(pst => pst.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }
    if (typeof data.body === "string") {
      post.body = data.body;
    }
    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubsub.publish("post", {
          post: { mutation: "DELETED", data: originalPost }
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish("post", {
          post: { mutation: "CREATED", data: post }
        });
      }
    } else if (post.published) {
      pubsub.publish("post", {
        post: { mutation: "UPDATED", data: post }
      });
    }

    return post;
  },

  createComment: (parent, args, { db, pubsub }, info) => {
    const { author, post } = args.data;

    const isUserExist = db.users.some(usr => usr.id === author);
    const isPostExist = db.posts.some(pst => pst.id === post && pst.published);

    if (!isUserExist || !isPostExist) {
      throw new Error("User or Post not found");
    }

    const newComment = {
      id: uuidv4(),
      ...args.data
    };

    db.comments.push(newComment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: { mutation: "CREATED", data: newComment }
    });

    return newComment;
  },

  deleteComment: (parent, args, { db, pubsub }) => {
    const { id } = args;
    const isExist = db.comments.some(cmnt => cmnt.id === id);
    if (!isExist) {
      throw new Error("Comment not found");
    }
    const deletedComment = db.comments.find(cmnt => cmnt.id === id);

    db.comments = db.comments.filter(cmnt => cmnt.id !== id);
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: { mutation: "DELETED", data: deletedComment }
    });

    return deletedComment;
  },

  updateComment: (parent, args, { db, pubsub }) => {
    const { id, data } = args;
    let comment = db.comments.find(cmnt => cmnt.id === id);
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (typeof data.text === "string") {
      comment.text = data.text;
    }
    pubsub.publish(`comment ${comment.post}`, {
      comment: { mutation: "UPDATE", data: comment }
    });

    return comment;
  }
};

export { Mutation as default };
