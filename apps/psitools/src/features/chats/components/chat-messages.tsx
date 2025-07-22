'use client';
import { useSubscription } from '@trpc/tanstack-react-query';
import { Fragment, useRef, useState } from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ChatBubble, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { usePatient } from '@/hooks/use-patient';
import { useTRPC } from '@/trpc/react';

import type { Message } from './chat';

interface ChatMessagesProps {
  chatId: string;
  chatMessages: Message[];
}

function formatMessageDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  if (isSameDay(date, today)) return 'Oggi';
  if (isSameDay(date, yesterday)) return 'Ieri';

  return date.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
  });
}

export const ChatMessages = (props: ChatMessagesProps) => {
  const { chatId, chatMessages } = props;
  const messagesRef = useRef<HTMLDivElement>(null);
  const api = useTRPC();
  const { patient } = usePatient({ id: chatId });
  const [messages, setMessages] = useState<Message[]>(chatMessages);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useSubscription(
    api.chat.onAdd.subscriptionOptions(
      { chatId: chatId },
      {
        onData: (newMessage) => {
          setMessages([...messages, newMessage]);
        },
      },
    ),
  );

  useSubscription(
    api.chat.onUserStatus.subscriptionOptions(undefined, {
      onData: (data) => {
        if (data.userId === chatId && data.chatId === chatId)
          setIsTyping(data.status === 'isTyping');
      },
    }),
  );

  return (
    <div className="overflow-y-auto">
      <ChatMessageList ref={messagesRef} className="no-scrollbar">
        {messages.length === 0 && (
          <p className="text-center">Nessun Messaggio</p>
        )}

        {messages.length > 0 &&
          messages.map((message, index) => {
            const currentDate = new Date(message.createdAt);
            const prevMessage = messages[index - 1];
            const prevDate = prevMessage
              ? new Date(prevMessage.createdAt)
              : null;

            const isNewDay =
              !prevDate ||
              currentDate.toDateString() !== prevDate.toDateString();

            return (
              <Fragment key={index}>
                {isNewDay && (
                  <div className="sticky top-0 z-10 my-4 flex justify-center">
                    <span className="min-w-24 rounded-full bg-primary-200 px-3 py-1 text-center text-xs text-gray-600 shadow">
                      {formatMessageDate(currentDate)}
                    </span>
                  </div>
                )}

                <ChatBubble
                  className="w-full max-w-full"
                  variant={
                    message.senderType === 'therapist' ? 'sent' : 'received'
                  }
                >
                  <Avatar>
                    <AvatarFallback className="text-xs">
                      {message.initials}
                    </AvatarFallback>
                  </Avatar>
                  <ChatBubbleMessage className="flex flex-col gap-2 text-xs">
                    <div
                      dangerouslySetInnerHTML={{ __html: message.content }}
                    />
                    <p className="text-right text-[8px]">
                      {currentDate.getHours().toString().padStart(2, '0')}:
                      {currentDate.getMinutes().toString().padStart(2, '0')}
                    </p>
                  </ChatBubbleMessage>
                </ChatBubble>
              </Fragment>
            );
          })}
        {isTyping && (
          <ChatBubble className="w-full max-w-full" variant={'received'}>
            <Avatar>
              <AvatarFallback className="text-xs">
                {patient?.user?.firstName[0].toUpperCase() ?? ''}
                {''}
                {patient?.user?.lastName[0].toUpperCase() ?? ''}
              </AvatarFallback>
            </Avatar>
            <ChatBubbleMessage
              isLoading
              className="flex flex-col gap-2 text-xs"
            />
          </ChatBubble>
        )}
      </ChatMessageList>
    </div>
  );
};
