'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import { ChatHeader } from '@/features/chat/components/chat-header';
import { ChatMessages } from '@/features/chat/components/chat-messages';
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

  return (
    <>
      {data && <ChatHeader chatId={chatId} therapistId={data.therapistId} />}
      {data && (
        <ChatMessages
          therapistId={data.therapistId}
          chatMessages={data.messages}
          chatId={chatId}
        />
      )}
      {!data && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
    </>
  );
};
