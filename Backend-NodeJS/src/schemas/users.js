import z from "zod";
import validator from "validator";

const userSchema = z.object({
  id: z
    .string()
    .nonempty({ message: "Id is required" })
    .refine((val) => typeof val === "string", {
      message: "Id must be a string",
    }),
  username: z
    .string()
    .nonempty({ message: "Username is required" })
    .min(4, { message: "Username too short" })
    .refine((val) => typeof val === "string", {
      message: "Username must be a string",
    }),
  password: z
    .string()
    .nonempty({ message: "Password is required" })
    .min(6, { message: "Password too short" })
    .refine((val) => typeof val === "string", {
      message: "Password must be a string",
    }),
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .min(6, { message: "Email too short" })
    .refine((val) => typeof val === "string", {
      message: "Email must be a string",
    }),
  fullname: z
    .string()
    .nonempty({ message: "Fullname is required" })
    .min(4, { message: "Fullname too short" })
    .refine((val) => typeof val === "string", {
      message: "Fullname must be a string",
    }),
  level: z
    .number()
    .min(0, { message: "Level must be at least 0" })
    .refine((val) => typeof val === "number", {
      message: "Level must be a number",
    }),
    active: z
    .number()
    .min(0, { message: "Active must be at least 0" })
    .max(1, { message: "Active must be at most 1" })
    .refine((val) => typeof val === "number", {
      message: "Active must be a number",
    }),
  });

export function validateUser(input) {
  return userSchema.safeParse(input);
}

export function validatePartialUser(input) {
  return userSchema.partial().safeParse(input);
}

export const validatePassword = (value) => {
  if (
    validator.isStrongPassword(value, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    return true;
  } else {
    return false;
  }
};
