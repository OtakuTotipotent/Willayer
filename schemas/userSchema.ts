import { z } from "zod";

export const UserCreateSchema = z.object({
    name: z.string().min(2).max(60),
    email: z.email("Invalid email format"),
    role: z.enum(["user", "admin"]).optional().default("user"),
});

export type UserCreateInput = z.infer<typeof UserCreateSchema>;
