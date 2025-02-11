import Link from 'next/link';
import { SquareArrowOutUpRight } from 'lucide-react';
import { getAllQuestionnaires } from '@/app/(forms)/user-forms/actions';
import { getUser } from '@/lib/auth/queries';

export default async function UserFormsPage() {
  const user = await getUser();
  const { data } = await getAllQuestionnaires();

  if (!user) {
    return (
      <div className="w-full h-full grid place-content-center">
        <h2 className="text-2xl text-black">Unauthorized</h2>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h2 className="text-2xl text-black">
        Hi <b>{user.username}</b> these are the forms available for you
      </h2>
      <div className="w-full max-w-md mx-auto relative overflow-x-auto mt-10">
        <table className="w-full text-sm text-left text-gray-500 border border-zinc-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-zinc-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Form #
              </th>
              <th scope="col" className="px-6 py-3">
                Drug name
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((form) => (
              <tr className="bg-white" key={form.id}>
                <td className="px-6 py-4">{form.id}</td>
                <td className="px-6 py-4">
                  <Link
                    className="text-sky-700 flex justify-start items-center gap-1"
                    href={`/user-forms/${form.id}`}
                  >
                    {form.title}
                    <SquareArrowOutUpRight className="size-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
