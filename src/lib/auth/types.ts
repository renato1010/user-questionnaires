import type { FieldError, UseFormRegister } from 'react-hook-form';

// Sign In Form
export type SignInFormData = {
  username: string;
  password: string;
};

export type FormFieldProps<T extends Record<string, unknown>> = {
  type: string;
  placeholder: string;
  name: ValidFieldNames;
  register: UseFormRegister<T>;
  error: FieldError | undefined;
  valueAsNumber?: boolean;
};

// can add more field names here
export type ValidFieldNames = 'username' | 'password';
