import { QuestionsList, RegularUsersList } from '@/lib/db/types';

type Answers = RegularUsersList[0]['Answer'];
export function mergeAnswersWithQuestions(answers: Answers, questions: QuestionsList) {
  const merged = answers.map((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);
    if (!question) {
      return { ...answer, questionText: 'Question not found' };
    }
    return {
      ...answer,
      questionText: question.questionText
    };
  });
  return merged;
}
