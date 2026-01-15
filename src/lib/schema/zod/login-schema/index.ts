import { z } from "zod";

// Regex to block HTML tags
const NO_HTML_REGEX = /<[^>]*>/;

export const loginSchema = z.object({
    email: z
        .email({ message: "Please enter a valid email address" })
        .min(1, { message: "Email is required" })
        .max(254, { message: "Email is too long" })
        .refine((val) => !NO_HTML_REGEX.test(val), {
            message: "HTML tags are not allowed",
        }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters" })
        .max(128, { message: "Password is too long" })
        .refine((val) => !NO_HTML_REGEX.test(val), {
            message: "HTML tags are not allowed",
        }),

    rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
