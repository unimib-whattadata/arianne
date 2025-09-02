'use client';
import { useParams } from 'next/navigation';

import { Chat } from '@/features/chats/components/chat';
import { ChatInput } from '@/features/chats/components/chat-input';

export default function ChatsPatientPage() {
  const { userId } = useParams<{ userId: string }>();

  return (
    <main className="relative mx-auto grid h-full-safe w-full grid-rows-[auto_1fr_auto] p-2">
      <Chat chatId={userId} />
      <ChatInput chatId={userId} />
    </main>
  );
}
