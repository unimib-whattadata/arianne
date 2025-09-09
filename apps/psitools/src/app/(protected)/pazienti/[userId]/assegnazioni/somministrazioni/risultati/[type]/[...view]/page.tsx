'use client';

import dynamic from 'next/dynamic';
import { use } from 'react';

import { NewQuestionnaireLoader } from '@/features/questionnaires/components/new-questionnair-loader';
import type { available } from '@/features/questionnaires/settings';
import type { TView } from '@/types/view-types';

const getContent = ({
  type,
  view,
}: {
  type: (typeof available)[number];
  view: TView;
}) => {
  if (!type || !view) return () => <NewQuestionnaireLoader />;
  const [viewType] = view;
  return dynamic(
    () => import(`@/features/questionnaires/${type}/results/${viewType}`),
    {
      ssr: false,
      loading: NewQuestionnaireLoader,
    },
  );
};

export default function ViewAdministrationPage({
  params,
}: {
  params: Promise<{ type: (typeof available)[number]; view: TView }>;
}) {
  const { type, view } = use(params);

  const Content = getContent({ type, view });

  // Render the client component, passing props
  return <Content />;
}
