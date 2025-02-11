'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RegularUsersList } from '@/lib/db/types';
import { DialogDescription } from '@radix-ui/react-dialog';

type QAs = {
  questionText: string;
  answerText: string | null;
  questionId: number | null;
  ansOptions: {
    id: number;
    option: string;
  }[];
}[];
type DashboardCardProps = {
  regularUsersList: RegularUsersList;
  qas: QAs;
};
export function DashboardCard({ qas, regularUsersList }: DashboardCardProps) {
  const [showQAsModal, setShowQAsModal] = useState(false);
  const [qasByUserName, setQAsByUsername] = useState<RegularUsersList[number]>();

  function onUserSelect(username: string) {
    const answers = regularUsersList.find((user) => user.username === username);
    if (!answers) return;
    setQAsByUsername(answers);
    setShowQAsModal(true);
  }
  return (
    <>
      <div className="max-w-md w-full mx-auto relative overflow-x-auto mt-10">
        <table
          className="w-full text-sm text-left text-gray-500 border border-zinc-400
     rounded-sm  border-separate border-tools-table-outline"
        >
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-zinc-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                User
              </th>
              <th scope="col" className="px-6 py-3">
                Username
              </th>
            </tr>
          </thead>
          <tbody>
            {regularUsersList?.map((user, index) => (
              <tr className="bg-white" key={user.username}>
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">
                  <Button
                    onClick={() => onUserSelect(user.username)}
                    variant="ghost"
                    className="text-sky-700"
                  >
                    {user.username}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <QAsModal
        qas={qas}
        qasByUserName={qasByUserName}
        isOpen={showQAsModal}
        onClose={() => setShowQAsModal(false)}
      />
    </>
  );
}

interface QAsModalProps {
  qas: QAs;
  qasByUserName?: RegularUsersList[number];
  isOpen: boolean;
  onClose: () => void;
}
export function QAsModal({ qas, isOpen, onClose }: QAsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800 text-white p-0">
        <DialogDescription className="p-6 border-b border-zinc-800">
          Questions and Answers for User
        </DialogDescription>
        <DialogHeader className="p-6 border-b border-zinc-800">
          <DialogTitle className="text-xl font-medium">Question N Answers</DialogTitle>
        </DialogHeader>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
          <div className="space-y-4">
            {qas.map(({ questionText, answerText, ansOptions }) => (
              <QAItem
                key={questionText}
                questionText={questionText}
                answerText={answerText}
                ansOptions={ansOptions}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function QAItem({ ansOptions, questionText, answerText }: Omit<QAs[number], 'questionId'>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <CardTitle className="flex justify-between items-center text-lg">
          {questionText}
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CardTitle>
      </CardHeader>
      {isOpen && (
        <CardContent>
          <p className="text-muted-foreground">{answerText}</p>
          {ansOptions.length > 0 && (
            <ul>
              {ansOptions.map(({ id, option }) => (
                <li key={id}>{option}</li>
              ))}
            </ul>
          )}
        </CardContent>
      )}
    </Card>
  );
}
