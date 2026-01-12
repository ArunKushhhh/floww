import z from "zod";

export const createCredentialSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(30, "Name must be at most 30 characters long"),
  value: z
    .string()
    .min(1, "Value is required")
    .max(500, "Value must be at most 500 characters long"),
});
