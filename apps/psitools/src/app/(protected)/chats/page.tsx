'use client';

import { Loader2 } from 'lucide-react';

import { PatientChatButton } from '@/features/chats/components/PatientChatButton';
import { useTherapist } from '@/hooks/use-therapist';

export default function ChatsPage() {
  const { user, isLoading } = useTherapist();

  if (isLoading) {
    return (
      <main className="h-full-safe relative grid grid-rows-[auto_auto_1fr_auto] gap-3 p-4">
        <h1 className="text-xl font-semibold">Chats</h1>
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="h-full-safe relative grid grid-rows-[auto_auto_1fr_auto] gap-3 p-4">
      <h1 className="text-xl font-semibold">Chats</h1>
      <div className="grid grid-cols-1 gap-2">
        {user && user.patients.length > 0 ? (
          user.patients.map(
            (patient, index) =>
              patient.profile && (
                <PatientChatButton
                  key={index}
                  patientId={patient.profile.id}
                  fullName={`${patient.profile.firstName} ${patient.profile.lastName}`}
                />
              ),
          )
        ) : (
          <p>No Patients Found</p>
        )}
      </div>
    </main>
  );
}
