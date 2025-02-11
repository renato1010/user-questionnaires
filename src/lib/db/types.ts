import { type User as UserModel } from '@prisma/client/edge';
import { Prisma } from '@prisma/client';

export type UserFrontend = Pick<UserModel, 'id' | 'role' | 'username'>;

export type SaveAnswers = (Prisma.AnswerCreateManyInput & {
  answerOptions: { option: string; id: number }[];
})[];
