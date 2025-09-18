import { Chat } from '@/features/chat/components/chat';
import { ChatInput } from '@/features/chat/components/chat-input';
import { api } from '@/trpc/server';

export default async function Page() {
  const patient = await api.patients.get();

  if (!patient?.therapist) return null;

  if (patient) {
    return (
      <main className="h-full-safe relative mx-auto grid w-full grid-rows-[_auto,1fr,_auto] p-2">
        <Chat profileId={patient.profileId} />
        <ChatInput
          patientProfileId={patient.profileId}
          therapistProfileId={patient.therapist.profileId}
        />
      </main>
    );
  }

  return (
    <main className="h-full-safe relative mx-auto grid w-full grid-rows-[_auto,1fr,_auto] p-2">
      Error on loading chat
    </main>
  );
}
