'use client';
import { FormEvent, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/auth/user-context';
import { findQuestionsByQuestionnaireId } from '@/lib/db/queries';
import { getAnwersByQuestionsAndUserIds, saveAnswers } from '@/app/(forms)/user-forms/actions';
import { delay } from '@/lib/utils';

type Data = Awaited<ReturnType<typeof findQuestionsByQuestionnaireId>>;
type Answers = Awaited<ReturnType<typeof getAnwersByQuestionsAndUserIds>>['data'];

type QuestionsFormProps = {
  questionnaireTitle: string;
  questionnaireId: string;
  data: Data;
  savedAnswers: Answers;
};
export function QuestionsForm({
  questionnaireTitle,
  data,
  savedAnswers,
  questionnaireId
}: QuestionsFormProps) {
  const { user } = useUser();
  if (!user) {
    return (
      <div className="w-full h-full grid place-content-center">
        <h2 className="text-2xl text-black">Unauthorized</h2>
      </div>
    );
  }
  const router = useRouter();
  const [error, setError] = useState<{ message: string }>({ message: '' });
  const [success, setSuccess] = useState<{ message: string }>({ message: '' });
  const [isPending, startTransition] = useTransition();

  const onSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const userId = user?.id;
    const form = evt.target as HTMLFormElement;
    // read form data
    const formData = new FormData(form);
    const objData = Array.from(formData.entries());

    type ReduceResult = {
      userId: number;
      questionId: number;
      questionnaireId: number;
      answerText: string;
      answerOptions: { option: string; id: number }[];
    };
    const answers = objData
      .map(([key, value]) => {
        const [questionnaireId, questionId, type] = key.split('_');
        if (type === 'input') {
          return {
            userId,
            questionId: parseInt(questionId),
            questionnaireId: parseInt(questionnaireId),
            answerText: value.toString(),
            answerOptions: []
          };
        }
        const answerOptions = JSON.parse(value.toString()) as { option: string; id: number };
        return {
          userId,
          questionId: parseInt(questionId),
          questionnaireId: parseInt(questionnaireId),
          answerText: '',
          answerOptions: [answerOptions]
        };
      })
      .reduce<ReduceResult[]>((acc, curr) => {
        const currentQuestionId = curr.questionId;
        const foundAnotherQuestionId = acc.find((a) => a.questionId === currentQuestionId);
        if (foundAnotherQuestionId) {
          foundAnotherQuestionId?.answerOptions?.push(...(curr.answerOptions ?? []));
          return acc;
        }
        return [...acc, curr];
      }, []);

    startTransition(async () => {
      const { ok, message } = await saveAnswers(answers);
      if (!ok) {
        setError({ message });
      } else {
        setSuccess({ message });
      }
      await delay(2000); // wait to let show user success/error saving answers
      router.push('/user-forms');
    });
  };
  return (
    <section className="max-w-md mx-auto mt-20">
      <h1 className="text-2xl font-bold text-center">
        Form # {questionnaireId} <span className="capitalize">{questionnaireTitle}</span>
      </h1>
      <form onSubmit={onSubmit} method="post">
        {data.map(({ question, questionId, questionnaireId }) => {
          // use saved answers to pre-fill form questions based on questionId
          let savedAnswer = savedAnswers?.find((a) => a.questionId === questionId);
          const type = question.type; // 'mcq' | 'input'
          const key = `${questionnaireId}_${questionId}_${type}`;
          return type === 'input'
            ? input(key, question.questionText, savedAnswer?.answerText ?? '')
            : mcq(
                key,
                question.questionText,
                question.QuestionOptions.map((option) => ({ ...option })),
                savedAnswer?.ansOptions.map((option) => ({ ...option })) ?? []
              );
        })}
        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
      {error.message ? <p className="text-destructive text-base">{error.message}</p> : null}
      {success.message ? <p className="text-emerald-700 text-base">{success.message}</p> : null}
    </section>
  );
}

const input = (key: string, questionText: string, savedAnswerText?: string) => {
  return (
    <div key={key} className="flex flex-col my-5">
      <label className="mb-2 uppercase font-bold text-lg text-grey-darkest">{questionText}</label>
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
      focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        type="text"
        required
        name={key}
        defaultValue={savedAnswerText ?? ''}
      />
    </div>
  );
};

const mcq = (
  key: string,
  questionText: string,
  options: { option: string; id: number }[],
  savedOptions: { option: string; id: number }[] = []
) => {
  const defaultcomposeValue = savedOptions.map(({ option, id }) => JSON.stringify({ option, id }));
  return (
    <div key={key} className="flex flex-col my-5">
      <label className="mb-2 uppercase font-bold text-lg text-grey-darkest">{questionText}</label>
      <select
        className="bg-gray-50 border border-gray-300 
    text-gray-900 text-sm rounded-lg focus:ring-blue-500 
    focus:border-blue-500 block w-full p-2.5"
        multiple={true}
        name={key}
        required
        defaultValue={defaultcomposeValue}
      >
        {options.map(({ option, id }) => (
          <option key={`${option}_${id}`} value={JSON.stringify({ option, id })}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
