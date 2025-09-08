'use client';

import { PatientsLists } from '@/features/patient/list';
// TODO: fix style
export default function PatientPage() {
  return (
    <main className="relative grid h-full-safe grid-rows-[auto_auto_1fr_auto] gap-3 p-4">
      <h1 className="text-xl font-semibold">Registro pazienti</h1>
      <PatientsLists />
    </main>
  );
}
