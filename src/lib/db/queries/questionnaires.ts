import prisma from '@/lib/db/db';

export async function findAllQuestionnaires() {
  return prisma.questionnaire.findMany();
}

export async function questionnaireTitleById(id: number) {
  return prisma.questionnaire.findUnique({
    where: { id },
    select: { title: true }
  });
}