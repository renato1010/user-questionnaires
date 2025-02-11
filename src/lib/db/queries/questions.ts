import prisma from '@/lib/db/db';

export async function getListOfQuestions(listofIds: number[]) {
  const list = await prisma.question.findMany({
    where: { id: { in: listofIds } },
    select: {
      id: true,
      questionText: true
    }
  });
  return list;
}
