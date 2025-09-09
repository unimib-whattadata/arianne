import { Chat } from '@/features/chats/components/chat';
import { ChatInput } from '@/features/chats/components/chat-input';

export default async function ChatsPatientPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return (
    <main className="h-full-safe relative mx-auto grid w-full grid-rows-[auto_1fr_auto] p-2">
      <Chat chatId={userId} />
      <ChatInput chatId={userId} />
    </main>
  );
}
