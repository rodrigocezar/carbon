import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";

export const createEmployeeValidator = withZod(
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Must be a valid email"),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    employeeType: z.string().min(36, { message: "Employee type is required" }),
  })
);

export const employeeTypeValidator = withZod(
  z.object({
    id: z.string(),
    name: z.string().min(1, { message: "Name is required" }),
    color: z.string(),
    data: z
      .string()
      .startsWith("[", { message: "Invalid JSON" })
      .endsWith("]", { message: "Invalid JSON" }),
  })
);

export const employeeValidator = withZod(
  z.object({
    id: z.string(),
    data: z
      .string()
      .startsWith("{", { message: "Invalid JSON" })
      .endsWith("}", { message: "Invalid JSON" }),
  })
);
