import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

export { prisma as default };

// const createPostForUser = async (authorId, data) => {
//   const isUserExist = await prisma.exists.User({ id: authorId });

//   if (!isUserExist) {
//     throw new Error("User not found");
//   }

//   const post = await prisma.mutation.createPost(
//     {
//       data: {
//         ...data,
//         author: {
//           connect: {
//             id: authorId
//           }
//         }
//       }
//     },
//     "{ author { id name email posts { id title published } } }"
//   );

//   return post;
// };

// const updatePostForUser = async (postId, data) => {
//   const isPostExist = await prisma.exists.Post({ id: postId });

//   if (!isPostExist) {
//     throw new Error("Post not found");
//   }

//   const post = await prisma.mutation.updatePost(
//     {
//       data: { ...data },
//       where: {
//         id: postId
//       }
//     },
//     "{ author { id name email posts { id title published } } }"
//   );

//   return post;
// };

// // createPostForUser("cjqwg53lx000w0734p813nf6v", {
// //   title: "Great",
// //   body: "AAAAAA",
// //   published: true
// // }).then(user => console.log(JSON.stringify(user, null, 2)));

// updatePostForUser("cjqxx8qcy000a073428kth0og", { title: "HAAAA" }).then(user =>
//   console.log(JSON.stringify(user, null, 2))
// );
