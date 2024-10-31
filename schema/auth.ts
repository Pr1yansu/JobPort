import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(1, {
    message: "Please enter your password",
  }),
});

export const registerSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter your username",
  }),
  email: z.string().email({
    message: "Invalid email address",
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters",
  }),
});
