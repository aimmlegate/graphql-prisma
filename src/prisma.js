import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

const createPostForUser = async (authorId, data) => {
  const post = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: {
          connect: {
            id: authorId
          }
        }
      }
    },
    "{ id }"
  );
  const user = await prisma.query.user(
    { where: { id: authorId } },
    "{ id name email posts { id title published } }"
  );

  return user;
};

const updatePostForUser = async (postId, data) => {
  const post = await prisma.mutation.updatePost(
    {
      data: { ...data },
      where: {
        id: postId
      }
    },
    "{ author { id } }"
  );
  const user = await prisma.query.user(
    { where: { id: post.author.id } },
    "{ id name email posts { id title published } }"
  );

  return user;
};

// createPostForUser("cjqwg53lx000w0734p813nf6v", {
//   title: "Great",
//   body: "AAAAAA",
//   published: true
// }).then(user => console.log(JSON.stringify(user, null, 2)));

// updatePostForUser("cjqxx8qcy000a073428kth0og", { title: "HAAAA" }).then(user =>
//   console.log(JSON.stringify(user, null, 2))
// );
