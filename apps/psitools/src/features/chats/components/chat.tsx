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
  patientProfileId: string;
  therapistProfileId: string;
  patientProfileName: string;
}

export const Chat = async (props: ChatProps) => {
  const { patientProfileId, therapistProfileId, patientProfileName } = props;

  const chat = await api.chats.getOrCreate({
    patientProfileId: patientProfileId,
    therapistProfileId: therapistProfileId,
  });

  return (
    <>
      <ChatHeader fullName={patientProfileName} />
      {chat && (
        <ChatMessages
          chatMessages={chat.messages}
          therapistProfileId={therapistProfileId}
          patientProfileId={patientProfileId}
        />
      )}
      {!chat && <Loader2 className="text-primary h-8 w-8 animate-spin" />}
    </>
  );
};
