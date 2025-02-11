'use server';
import prisma from '@/lib/db/db';
import questionnaires from '@/lib/db/data/questionnaires.json';

/**
 * questionnaires is an array of objects with the following shape:
 * [{id:string(number), name:string},....]
 */

export async function createQuestionnaires() {
  for (const questionnaire of questionnaires) {
    try {
      await prisma.questionnaire.create({
        data: {
          title: questionnaire.name
        }
      });
      console.log(`Questionnaires created successfully`);
    } catch (error) {
      console.error('Error creating Questionnaires', error);
    } finally {
      await prisma.$disconnect();
    }
  }
}

/**
 * Note: This script relays on the ..data/questionnaires.json file
 * So, if need to re-seed db make sure first that the data/questionnaires.json file is up to date
 */
