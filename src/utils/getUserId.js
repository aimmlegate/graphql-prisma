import jwt from "jsonwebtoken";

const getUserId = (request, required = true) => {
  const header = request.request.headers.authorization;
  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, "secrethurrdurr");

    return decoded.userId;
  }

  if (required) {
    throw new Error("Authorization required");
  }

  return null;
};

export { getUserId as default };
