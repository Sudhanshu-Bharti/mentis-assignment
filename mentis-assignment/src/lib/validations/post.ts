import * as z from "zod";

export const postFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  body: z
    .string()
    .min(1, "Content is required")
    .max(1000, "Content is too long"),
  userId: z.coerce.number().default(1),
});

export type PostFormInput = z.infer<typeof postFormSchema>;
