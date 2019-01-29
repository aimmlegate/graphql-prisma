import getUserId from "../utils/getUserId";
import { request } from "https";

const Subscription = {
  comment: {
    subscribe: (parent, { postId: id }, { prisma }, info) => {
      return prisma.subscription.comment(
        {
          where: {
            node: {
              post: { id }
            }
          }
        },
        info
      );
    }
  },
  post: {
    subscribe: (parent, args, { prisma }, info) => {
      return prisma.subscription.post(
        {
          where: {
            node: {
              published: true
            }
          }
        },
        info
      );
    }
  },
  myPost: {
    subscribe: (parent, args, { prisma, req }, info) => {
      const userId = getUserId(req);
      return prisma.subscription.post(
        {
          where: {
            node: {
              author: { id: userId }
            }
          }
        },
        info
      );
    }
  }
};

export { Subscription as default };
