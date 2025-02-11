import { getAllUsers } from '@/app/(dashboard)/dashboard/actions';
import { getUser } from '@/lib/auth/queries';
import { DashboardCard } from '@/components/questions-answers-dialog';
import { mergeAnswersWithQuestions } from './utils';
import { getListOfQuestions } from '@/lib/db/queries';

export default async function DashboardPage() {
  const user = await getUser();
  // get all users with Role of 'USER'
  const { ok, data: regularUsersList } = await getAllUsers();
  if (!user) {
    return (
      <div className="w-full h-full grid place-content-center">
        <h2 className="text-2xl text-black">Unauthorized</h2>
      </div>
    );
  }
  if (!ok || !regularUsersList) {
    return <div>Failed to get users</div>;
  }
  const answersList = regularUsersList.map((user) => user.Answer).flat();
  const questionIdsList = regularUsersList
    .map((user) => user.Answer)
    .flat()
    .map((answer) => answer.questionId as number);
  const questionsList = await getListOfQuestions(questionIdsList);
  const questionsAndAnswers = await mergeAnswersWithQuestions(answersList, questionsList);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl text-black">
        Hi <b>{user.username}</b> This is the list of active users
      </h2>
      <DashboardCard qas={questionsAndAnswers} regularUsersList={regularUsersList} />
    </div>
  );
}
