import { createQuestionnaireJunction } from '@/lib/db/scripts/create-questionnaire-junction';
import { createQuestionnaires } from '@/lib/db/scripts/create-questionnaires';
import { createQuestions } from '@/lib/db/scripts/create-questions';
import { createUsers } from '@/lib/db/scripts/create-user';

async function main() {
  await createUsers();
  await createQuestionnaires();
  await createQuestions();
  await createQuestionnaireJunction();
}

(async () => {
  await main();
})();
