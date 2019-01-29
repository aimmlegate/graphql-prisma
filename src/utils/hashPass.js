import bcrypt from "bcryptjs";

export default async pass => {
  if (pass.length < 8) {
    console.log("sdsdsd");
    throw new Error("Password must be 8 char or longer");
  }
  return bcrypt.hash(pass, 10);
};
