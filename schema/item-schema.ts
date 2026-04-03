import z from "zod";

export const itemSchema = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters long" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 characters long" }),
  price: z
    .number()
    .nonnegative({ message: "Price must be a positive number" })
    .multipleOf(0.01, { message: "Price must be a multiple of 0.01" }),
  stock: z
    .number()
    .nonnegative({ message: "Stock must be a positive number" })
    .int({ message: "Stock must be a whole number" }),
});
