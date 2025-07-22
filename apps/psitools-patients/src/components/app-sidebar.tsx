'use client';

import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  Heart,
  LifeBuoy,
  MessageCircleMore,
  NotebookPen,
  Route,
  Smile,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAssignedTask } from '@/hooks/use-assigned-task';
import { useSession } from '@/hooks/use-session';

import { Skeleton } from './ui/skeleton';

type AppSidebarProps = React.ComponentProps<typeof Sidebar>;

export function AppSidebar({ ...props }: AppSidebarProps) {
  const { session, loading } = useSession();
  const { toggleSidebar, isMobile } = useSidebar();
  const closeSidebar = () => {
    if (!isMobile) return;
    return toggleSidebar();
  };

  const { tasksNums } = useAssignedTask();

  const data = {
    navMain: [
      {
        title: 'Calendario',
        url: '/calendario',
        icon: CalendarDays,
        disabled: true,
      },
      {
        title: 'Chat',
        url: '/chat',
        icon: MessageCircleMore,
        disabled: true,
      },
      {
        title: 'Stato',
        url: '/stato',
        icon: Route,
        disabled: true,
      },
    ],
    exercises: [
      {
        title: 'Questionari',
        url: '/questionari',
        icon: ClipboardList,
        badge: tasksNums,
      },
      {
        title: "Stati d'animo",
        url: '/stati-animo',
        icon: Smile,
        disabled: true,
      },
      {
        title: 'Psicoeducazione',
        url: '/psicoeducazione',
        icon: BookOpen,
        disabled: true,
      },
      {
        title: 'Diari',
        url: '/diari',
        icon: NotebookPen,
        items: [
          { title: 'Diario Alimentare', url: '/diario-alimentare' },
          {
            title: 'Diario Cognitivo-Comportamentale',
            url: '/diario-cognitivo-comportamentale',
          },
          { title: 'Diario del sonno-mattina', url: '/diario-sonno-mattina' },
          { title: 'Diario del sonno-sera', url: '/diario-sonno-sera' },
        ],
      },
    ],
    navSecondary: [
      {
        title: 'Support',
        url: '#',
        icon: LifeBuoy,
        disabled: true,
      },
    ],
  };

  const searchParams = useSearchParams();

  const hideUI = searchParams.get('hideUI') === 'true';

  if (hideUI) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" onClick={closeSidebar}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted text-sidebar-primary-foreground">
                  <Heart className="fill-slate-300 stroke-0" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">PEnguIN</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavMain items={data.exercises} name="Esercizi" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {loading || !session?.user ? (
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Skeleton className="h-8 w-full rounded-lg" />
          </SidebarMenuButton>
        ) : (
          <NavUser user={session.user} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
