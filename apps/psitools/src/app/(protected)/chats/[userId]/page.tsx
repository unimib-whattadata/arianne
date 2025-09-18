import { Chat } from '@/features/chats/components/chat';
import { ChatInput } from '@/features/chats/components/chat-input';
import { api } from '@/trpc/server';

export default async function ChatsPatientPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const patient = await api.patients.findUnique({
    where: { id: userId },
  });

  if (!patient) return <div>Patient not found</div>;

  return (
    <main className="h-full-safe relative mx-auto grid w-full grid-rows-[auto_1fr_auto] p-2">
      <Chat chatId={patient.id} />
      <ChatInput chatId={patient.id} />
    </main>
  );
}
