'use client';

import { Chat } from '@/features/chat/components/chat';
import { ChatInput } from '@/features/chat/components/chat-input';
import { useSession } from '@/hooks/use-session';

export default function Page() {
  const { session } = useSession();

  if (session?.user) {
    return (
      <main className="relative mx-auto grid h-full-safe w-full grid-rows-[_auto,1fr,_auto] p-2">
        <Chat chatId={session.user.id} />
        <ChatInput chatId={session.user.id} />
      </main>
    );
  }

  return (
    <main className="relative mx-auto grid h-full-safe w-full grid-rows-[_auto,1fr,_auto] p-2">
      Error on loading chat
    </main>
  );
}
