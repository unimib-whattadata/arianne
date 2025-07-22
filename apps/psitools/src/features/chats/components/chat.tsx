'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { ChatHeader } from '@/features/chats/components/chat-header';
import { ChatMessages } from '@/features/chats/components/chat-messages';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

export interface Message {
  chatId: string;
  content: string;
  senderType: 'patient' | 'therapist';
  id: string;
  createdAt: Date;
  updatedAt: Date;
  initials: string;
  index: number;
  senderId: string;
}

interface ChatProps {
  chatId: string;
}

export const Chat = (props: ChatProps) => {
  const { chatId } = props;
  const api = useTRPC();
  const { data } = useQuery(
    api.chat.getOrCreate.queryOptions({
      patientId: chatId,
    }),
  );
  const { patient } = usePatient({ id: chatId });
  return (
    <>
      {patient?.user && (
        <ChatHeader
          patientId={chatId}
          fullName={`${patient.user.firstName} ${patient.user.lastName}`}
        />
      )}
      {data && <ChatMessages chatMessages={data.messages} chatId={chatId} />}
      {!data && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
    </>
  );
};
