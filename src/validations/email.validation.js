import { z } from "zod";

export const sendEmailSchema = z.object({
  body: z.object({
    from: z.string().email().or(z.literal("")).optional(),
    to: z.string().email({ message: "Invalid recipient email address" }),
    subject: z.string().min(1, "Subject is required"),
    html: z.string().optional(),
    text: z.string().optional(),
  }).refine((data) => data.html || data.text, {
    message: "Either html or text content must be provided",
    path: ["html"],
  }),
});
