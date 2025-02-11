import { type User as UserModel } from '@prisma/client/edge';
import { Prisma } from '@prisma/client';
import { getAllRegularUsers } from '@/lib/db/queries';
import { getListOfQuestions } from '@/lib/db/queries';

export type UserFrontend = Pick<UserModel, 'id' | 'role' | 'username'>;

export type SaveAnswers = (Prisma.AnswerCreateManyInput & {
  answerOptions: { option: string; id: number }[];
})[];

export type RegularUsersList = Awaited<ReturnType<typeof getAllRegularUsers>>;
export type QuestionsList = Awaited<ReturnType<typeof getListOfQuestions>>;