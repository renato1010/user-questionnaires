import prisma from '@/lib/db/db';
import { SaveAnswers } from '@/lib/db/types';

export async function saveManyAnswers(data: SaveAnswers) {
  for (const { answerOptions, answerText, userId, questionId } of data) {
    await prisma.answer.upsert({
      where: {
        userId_questionId: {
          userId: userId,
          questionId: questionId!
        }
      },
      update: {
        answerText: answerText ?? '',
        ansOptions: {
          set: [],
          connect: answerOptions.map((option) => ({ id: option.id }))
        }
      },
      create: {
        questionId,
        answerText: answerText ?? '',
        userId,
        ansOptions: {
          connect: answerOptions.map((option) => ({ option: option.option }))
        }
      }
    });
  }
}

export async function findAnswersByQuestionIdsAndUserId(questionIds: number[], userId: number) {
  return prisma.answer.findMany({
    where: {
      userId,
      questionId: {
        in: questionIds
      }
    },
    select: {
      questionId: true,
      answerText: true,
      ansOptions: {
        select: {
          option: true,
          id: true
        }
      }
    }
  });
}
