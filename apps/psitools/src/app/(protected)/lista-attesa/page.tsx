'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import NewPatientsList from '@/features/waiting-list/components/new-patient-list';
import PatientRequests from '@/features/waiting-list/components/patient-requests';
import InvitationSheet from '@/features/waiting-list/components/invitation-sheet';

export default function WaitingListPage() {
  const [isInvitationSheetOpen, setIsInvitationSheetOpen] = useState(false);

  const handleSaveInvitation = async (data: {
    patientName: string;
    patientEmail: string;
  }) => {
    await fetch('/api/invitations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  };

  return (
    <div className="h-full-safe relative grid grid-rows-[repeat(2,min-content)] overflow-auto p-4 pt-0">
      <div className="bg-background sticky top-0 z-10 pb-3">
        <h1 className="mb-3 text-2xl font-semibold">Liste d'attesa</h1>
        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => setIsInvitationSheetOpen(true)}
          >
            <Plus /> Invita paziente
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-3"></div>
        <NewPatientsList onInviteAgain={() => setIsInvitationSheetOpen(true)} />

        <PatientRequests />

        <InvitationSheet
          isOpen={isInvitationSheetOpen}
          onClose={() => setIsInvitationSheetOpen(false)}
          onSave={handleSaveInvitation}
        />
      </div>
    </div>
  );
}
