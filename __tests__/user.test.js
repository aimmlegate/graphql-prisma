import { getUserName, isValidPassword } from "../src/utils/user";

test("Should return first name", () => {
  const firstName = getUserName("Petr Porosenkov");

  expect(firstName).toBe("Petr");
});

test("Should return first name when given first name", () => {
  const firstName = getUserName("Petr");

  expect(firstName).toBe("Petr");
});

test("Should reject ease password", () => {
  const isValid = isValidPassword("password");

  expect(isValid).toBe(false);
});

test("Should reject short password", () => {
  const isValid = isValidPassword("ass");

  expect(isValid).toBe(false);
});

test("Should accept password", () => {
  const isValid = isValidPassword("asdasd123c32rew");

  expect(isValid).toBe(true);
});
