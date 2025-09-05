'use client';

import { use } from 'react';

import { SidebarGroup } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { NavMain } from '@/features/sidebar/components/nav-main';
import { usePatientMenu } from '@/features/sidebar/default';

export default function AppSidebarSlot({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const { items, name, isLoading } = usePatientMenu({
    userId,
    active: 'note',
  });

  if (isLoading) {
    return (
      <SidebarGroup>
        <Skeleton className="h-10 w-full" />
      </SidebarGroup>
    );
  }

  return <NavMain items={items} name={name} />;
}
