import { z } from 'zod';
const MIN_PASSWORD_LENGTH = 8;

export const signInSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 chars' })
    .max(20, { message: 'Username must be at most 20 chars' }),
  password: z.string().min(MIN_PASSWORD_LENGTH, {
    message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  })
});

export type SignInFormSchemaType = z.infer<typeof signInSchema>;
