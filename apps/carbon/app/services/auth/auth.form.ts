import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const loginValidator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email"),
    password: z.string().min(6, { message: "Password is too short" }),
    redirectTo: z.string(),
  })
);

export const forgotPasswordValidator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email"),
  })
);

export const resetPasswordValidator = withZod(
  z.object({
    password: z.string().min(6, { message: "Password is too short" }),
  })
);

export const callbackValidator = withZod(
  z.object({
    refreshToken: z.string(),
  })
);
