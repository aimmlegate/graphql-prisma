export const getUserName = name => name.split(" ")[0];

export const isValidPassword = pass => {
  return pass.length >= 8 && !pass.toLowerCase().includes("password");
};
