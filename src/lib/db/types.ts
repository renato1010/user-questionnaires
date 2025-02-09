import { type User as UserModel } from '@prisma/client/edge';

export type UserFrontend = Pick<UserModel, 'id' | 'role' | 'username'>;
