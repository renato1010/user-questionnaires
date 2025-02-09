import { z } from 'zod';

const MIN_PASSWORD_LENGTH = 8;
const FIELD_VALIDATION = {
  TEST: {
    SPECIAL_CHAR: (value: string) => /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/.test(value),
    LOWERCASE: (value: string) => /[a-z]/.test(value),
    UPPERCASE: (value: string) => /[A-Z]/.test(value),
    NUMBER: (value: string) => /.*[0-9].*/.test(value)
  },
  MSG: {
    MIN_LEN: `Password must have ${MIN_PASSWORD_LENGTH} characters`,
    SPECIAL_CHAR: 'Password must contain atleast one special character',
    LOWERCASE: 'Password must contain at least one lowercase letter',
    UPPERCASE: 'Password must contain at least one uppercase letter',
    NUMBER: 'Password must contain at least one number',
    MATCH: 'Password must match'
  }
};

// this can also be used in server side validation
export const signUpSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 chars' })
    .max(20, { message: 'Username must be at most 20 chars' }),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, { message: FIELD_VALIDATION.MSG.MIN_LEN })
    .refine((value) => FIELD_VALIDATION.TEST.SPECIAL_CHAR(value), {
      message: FIELD_VALIDATION.MSG.SPECIAL_CHAR
    })
    .refine((value) => FIELD_VALIDATION.TEST.LOWERCASE(value), {
      message: FIELD_VALIDATION.MSG.LOWERCASE
    })
    .refine((value) => FIELD_VALIDATION.TEST.UPPERCASE(value), {
      message: FIELD_VALIDATION.MSG.UPPERCASE
    })
    .refine((value) => FIELD_VALIDATION.TEST.NUMBER(value), {
      message: FIELD_VALIDATION.MSG.NUMBER
    })
});

export type SignUpFormSchemaType = z.infer<typeof signUpSchema>;
