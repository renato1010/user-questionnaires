import { type User as UserModel } from '@prisma/client';

export type UserFrontend = Pick<UserModel, 'id' | 'role' | 'username'>;
