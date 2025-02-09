'use server';
import prisma from '@/lib/db/db';
import questionnaireJunctions from '@/lib/db/data/questionnaire_junction.json';

// console.dir({ questionnaireJunctions }, { depth: Infinity });

export async function createQuestionnaireJunction() {
  try {
    for (const junction of questionnaireJunctions) {
      await prisma.questionnaireQuestion.create({
        data: {
          questionnaireId: parseInt(junction.questionnaire_id),
          questionId: parseInt(junction.question_id),
          priority: parseInt(junction.priority)
        }
      });
    }
    console.log(`Questionnaire Junctions created successfully`);
  } catch (error) {
    console.error('Error creating Questionnaire Junctions', error);
  } finally {
    await prisma.$disconnect();
  }
}
