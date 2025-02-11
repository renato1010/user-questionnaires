import prisma from '@/lib/db/db';

export async function findQuestionsByQuestionnaireId(questionnaireId: number) {
  return prisma.questionnaireQuestion.findMany({
    orderBy: [
      {
        priority: 'asc'
      }
    ],
    where: {
      questionnaireId
    },
    include: {
      question: {
        select: {
          id: true,
          questionText: true,
          type: true,
          QuestionOptions: {
            select: {
              id: true,
              option: true
            }
          }
        }
      }
    }
  });
}
