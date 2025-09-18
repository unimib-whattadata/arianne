import { Loader2 } from 'lucide-react';

import { ChatHeader } from '@/features/chat/components/chat-header';
import { ChatMessages } from '@/features/chat/components/chat-messages';
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
  profileId: string;
}

export const Chat = async (props: ChatProps) => {
  const { profileId } = props;

  const patient = await api.patients.findUnique({
    where: { id: profileId },
  });

  if (!patient) return null;
  if (!patient.therapist) return null;

  const chat = await api.chats.getOrCreate({
    patientProfileId: patient.profileId,
    therapistProfileId: patient.therapist.profileId,
  });

  return (
    <>
      {chat && <ChatHeader therapistId={patient.therapist.profileId} />}
      {chat && (
        <ChatMessages
          patientProfileId={patient.profileId}
          therapistProfileId={patient.therapist.profileId}
          chatMessages={chat.messages}
        />
      )}
      {!chat && <Loader2 className="text-primary h-8 w-8 animate-spin" />}
    </>
  );
};
