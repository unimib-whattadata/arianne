'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

interface PatientChatButtonProps {
  patientId: string;
  fullName?: string;
  updates?: number;
}

export const PatientChatButton = (props: PatientChatButtonProps) => {
  const router = useRouter();
  const { patientId, fullName, updates } = props;
  return (
    <Button
      className="flex flex-row items-center justify-between rounded-lg p-6"
      onClick={() => router.push(`/chats/${patientId}`)}
    >
      {fullName && <p>{fullName}</p>}
      {updates && (
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-500 p-4">
          {updates}
        </div>
      )}
    </Button>
  );
};
