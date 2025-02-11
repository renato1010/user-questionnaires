'use server';
import { getUser } from '@/lib/auth/queries';
import { findAllQuestionnaires, findQuestionsByQuestionnaireId } from '@/lib/db/queries';
import { saveManyAnswers, findAnswersByQuestionIdsAndUserId } from '@/lib/db/queries/answers';
import { SaveAnswers } from '@/lib/db/types';

export async function getAllQuestionnaires() {
  const user = await getUser();
  if (!user) {
    return { ok: false, message: 'Unauthorized', data: null };
  }
  try {
    const data = await findAllQuestionnaires();
    return { ok: true, message: 'success', data };
  } catch (error) {
    return { ok: false, message: 'error getting data', data: null };
  }
}

export async function getQuestionsByQuestionnaireId(id: number) {
  const user = await getUser();
  if (!user) {
    return { ok: false, message: 'Unauthorized', data: null };
  }
  try {
    const data = await findQuestionsByQuestionnaireId(id);
    return { ok: true, message: 'success', data };
  } catch (error) {
    return { ok: false, message: 'error getting data', data: null };
  }
}

export async function saveAnswers(answers: SaveAnswers) {
  try {
    // save answers
    await saveManyAnswers(answers);
    return { ok: true, message: `success saving answers`, data: null };
  } catch (error) {
    return { ok: false, message: 'error saving answers', data: null };
  }
}

export async function getAnwersByQuestionsAndUserIds(uniqueQuestionIds: number[]) {
  const user = await getUser();
  if (!user) {
    return { ok: false, message: 'Unauthorized', data: null };
  }
  try {
    const answers = await findAnswersByQuestionIdsAndUserId(uniqueQuestionIds, user.id);
    return { ok: true, message: 'success', data: answers };
  } catch (error) {
    return { ok: false, message: 'error getting data', data: null };
  }
}
