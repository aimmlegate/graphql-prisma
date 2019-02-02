import ApolloBoost, { gql } from "apollo-boost";

const client = new ApolloBoost({
  uri: "http://localhost:4000/"
});

const getUsers = gql`
  query {
    users {
      id
      name
    }
  }
`;

const getPosts = gql`
  query {
    posts {
      title
      author {
        name
      }
    }
  }
`;

client
  .query({
    query: getUsers
  })
  .then(({ data: { users } }) => {
    let html = "";
    users.forEach(user => {
      html += `
        <div>
          ${user.name}
        </div>
        `;
    });
    document.getElementById("app").innerHTML = html;
  });

client
  .query({
    query: getPosts
  })
  .then(({ data: { posts } }) => {
    let html = "";
    posts.forEach(pst => {
      html += `
        <div>
          ${pst.title}
          ${pst.author.name}
        </div>
        `;
    });
    document.getElementById("posts").innerHTML = html;
  });
