import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./tokenSecret.js";

const getUserId = (request, required = true) => {
  const header = request.request
    ? request.request.headers.authorization
    : request.connection.context.Authorization;

  if (header) {
    const token = header.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);

    return decoded.userId;
  }

  if (required) {
    throw new Error("Authorization required");
  }

  return null;
};

export { getUserId as default };
