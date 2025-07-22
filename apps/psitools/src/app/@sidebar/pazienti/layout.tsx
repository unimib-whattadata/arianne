'use client';

import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';

import { authClient } from '@/auth/client';
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

export default function AppSidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending: loading } = authClient.useSession();
  const { NAV_MAIN, NAV_SECONDARY } = useMenu();

  const { toggleSidebar, isMobile } = useSidebar();
  const closeSidebar = () => {
    if (!isMobile) return;
    return toggleSidebar();
  };
  const searchParams = useSearchParams();

  const hideUI = searchParams.get('hideUI') === 'true';

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
        {children}
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
