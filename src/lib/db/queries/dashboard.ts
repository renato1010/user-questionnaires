import prisma from '@/lib/db/db';

export async function getAllRegularUsers() {
  const data = await prisma.user.findMany({
    where: {
      role: 'USER'
    },
    select: {
      username: true,
      Answer: {
        select: {
          answerText: true,
          questionId: true,
          ansOptions: {
            select: {
              option: true,
              id: true
            }
          }
        }
      }
    }
  });
  return data;
}
