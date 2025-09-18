import { Chat } from '@/features/chats/components/chat';
import { ChatInput } from '@/features/chats/components/chat-input';
import { api } from '@/trpc/server';

export default async function ChatsPatientPage({
  params,
}: {
  params: Promise<{ profileId: string }>;
}) {
  const { profileId } = await params;
  const patient = await api.patients.findUnique({
    where: { id: profileId },
  });

  if (!patient) return null;
  if (!patient.therapist) return null;

  return (
    <main className="h-full-safe relative mx-auto grid w-full grid-rows-[auto_1fr_auto] p-2">
      <Chat
        patientProfileName={patient.profile.name}
        therapistProfileId={patient.therapist.profileId}
        patientProfileId={profileId}
      />
      <ChatInput
        therapistProfileId={patient.therapist.profileId}
        patientProfileId={profileId}
      />
    </main>
  );
}
