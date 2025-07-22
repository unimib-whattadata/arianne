'use client';

import { ExportProvider } from '@/features/questionnaires/context/export-context';

interface Props {
  children: React.ReactNode;
}

export default function PatientLayout(props: Props) {
  const { children } = props;

  return (
    <ExportProvider>
      <div className="h-[calc(100svh_-_var(--header-height))]">{children}</div>
    </ExportProvider>
  );
}
