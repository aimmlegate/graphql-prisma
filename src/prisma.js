import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

// prisma.query
//   .users(null, "{ id name posts { id title } }")
//   .then(data => console.log(JSON.stringify(data, null, 2)));

// prisma.query
//   .comments(null, "{ id text author { id name } }")
//   .then(data => console.log(JSON.stringify(data, null, 2)));

// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: "My new post a",
//         body: "text",
//         published: false,
//         author: {
//           connect: {
//             id: "cjqwg53lx000w0734p813nf6v"
//           }
//         }
//       }
//     },
//     "{ id, title, body, published }"
//   )
//   .then(data => console.log(JSON.stringify(data, null, 2)));

prisma.mutation
  .updatePost(
    {
      data: { published: false, body: "aaaaahuina" },
      where: { id: "cjqxxto3a000k0734yan2tqgf" }
    },
    "{ id title body published }"
  )
  .then(data => {
    console.log(JSON.stringify(data, null, 2));
    return prisma.query.posts(null, "{ id title body published }");
  })
  .then(data => console.log(JSON.stringify(data, null, 2)));
