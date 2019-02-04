import ApolloBoost from "apollo-boost";

const getClient = () =>
  new ApolloBoost({
    uri: "http://localhost:4001"
  });

export { getClient as default };
