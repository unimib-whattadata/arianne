'use client';

import type { LucideIcon } from 'lucide-react';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { NavMain } from '@/features/sidebar/components/nav-main';
import { NavSecondary } from '@/features/sidebar/components/nav-secondary';
import { NavUser } from '@/features/sidebar/components/nav-user';
import { useMenu } from '@/features/sidebar/default';
import { useSession } from '@/hooks/use-session';

export interface SubMenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  badge?: number;
  disabled?: boolean;
  isActive?: boolean;
  replace?: boolean;
  items?: {
    title: string;
    url: string;
    disabled?: boolean;
  }[];
}

export interface SubMenu {
  name?: string;
  items: SubMenuItem[];
}

export default function AppSidebarDefaultSlot({
  searchParams,
}: {
  searchParams: Promise<{ hideUI: boolean }>;
}) {
  const { hideUI } = React.use<{ hideUI: boolean }>(searchParams);
  const { session, loading } = useSession();
  const { toggleSidebar, isMobile } = useSidebar();
  const { NAV_MAIN, NAV_EXERCISE, NAV_SECONDARY } = useMenu('home');
  const closeSidebar = () => {
    if (!isMobile) return;
    return toggleSidebar();
  };

  if (hideUI) {
    return null;
  }

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex">
            <SidebarMenuButton
              size="lg"
              asChild
              className="group-data-[collapsible=icon]:hidden"
            >
              <Link href="/" onClick={closeSidebar}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted text-sidebar-primary-foreground">
                  <Heart className="fill-slate-300 stroke-0" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-semibold">
                    PsiTools
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuButton size="lg" asChild className="w-min">
              <SidebarTrigger size="icon" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={NAV_MAIN} />
        <NavMain items={NAV_EXERCISE} name="Compiti" />
        <NavSecondary items={NAV_SECONDARY} className="mt-auto" />
      </SidebarContent>
      <Separator className="mx-auto h-0.5 w-[calc(100%-theme(spacing.6))] bg-muted" />
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
