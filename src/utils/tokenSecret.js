import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET;

export const OPTIONS = { expiresIn: "30d" };

export const genJwt = userId => jwt.sign({ userId }, JWT_SECRET, OPTIONS);
