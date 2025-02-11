import {
  getAnwersByQuestionsAndUserIds,
  getQuestionsByQuestionnaireId
} from '@/app/(forms)/user-forms/actions';
import { questionnaireTitleById } from '@/lib/db/queries';
import { QuestionsForm } from './questions-form';

export default async function FormByIdPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const questionsData = await getQuestionsByQuestionnaireId(parseInt(id));
  const questionnaireTitle = await questionnaireTitleById(parseInt(id));

  if (!questionsData.ok || !questionsData.data || !questionnaireTitle) {
    return <div>There was an error: {questionsData.message}</div>;
  }
  const { data } = questionsData;
  // unique questionId's
  const uniqueQuestionIds = Array.from(new Set(data.map((d) => d.questionId)));
  const { data: answers } = await getAnwersByQuestionsAndUserIds(uniqueQuestionIds);

  return (
    <QuestionsForm
      questionnaireTitle={questionnaireTitle.title}
      questionnaireId={id}
      data={data}
      savedAnswers={answers}
    />
  );
}
