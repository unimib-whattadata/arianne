import { Loader2 } from 'lucide-react';

import { ChatHeader } from '@/features/chats/components/chat-header';
import { ChatMessages } from '@/features/chats/components/chat-messages';
import { api } from '@/trpc/server';

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

export const Chat = async (props: ChatProps) => {
  const { chatId } = props;
  const patient = await api.patients.findUnique({
    where: { id: chatId },
  });

  if (!patient) return null;
  if (!patient.therapistId) return null;

  const chat = await api.chats.getOrCreate({
    patientId: patient.id,
    therapistId: patient.therapistId,
  });

  console.log('Chat data:', { chatId, patient: patient.id });

  return (
    <>
      {patient?.profile && (
        <ChatHeader patientId={chatId} fullName={patient.profile.name} />
      )}
      {chat && <ChatMessages chatMessages={chat.messages} chatId={chatId} />}
      {!chat && <Loader2 className="text-primary h-8 w-8 animate-spin" />}
    </>
  );
};
