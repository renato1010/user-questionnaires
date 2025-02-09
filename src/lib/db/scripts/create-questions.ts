'use server';
import prisma from '@/lib/db/db';
import questionsStrings from '@/lib/db/data/questionnaire_questions.json';

type QuestionFromJson = { type: 'mcq' | 'input'; options: string[]; question: string };
// Note: Need to tweak the data/questionnaire_questions.json file to have the correct shape
const questionsJson = questionsStrings.map((questionString) => {
  let question = JSON.parse(questionString.question) as QuestionFromJson;
  question = { ...question, options: question.options ?? [] };
  return {
    id: parseInt(questionString.id),
    ...question
  };
});

export async function createQuestions() {
  try {
    for (const question of questionsJson) {
      const hasOptions = question.options.length > 0;
      if (hasOptions) {
        await prisma.question.create({
          data: {
            id: question.id,
            type: question.type,
            questionText: question.question,
            QuestionOptions: {
              create: question.options.map((option) => ({
                option: option
              }))
            }
          }
        });
      } else {
        await prisma.question.create({
          data: {
            id: question.id,
            type: question.type,
            questionText: question.question
          }
        });
      }
    }
    console.log(`Questions created successfully`);
  } catch (error) {
    console.error('Error creating Questions', error);
  } finally {
    await prisma.$disconnect();
  }
}
