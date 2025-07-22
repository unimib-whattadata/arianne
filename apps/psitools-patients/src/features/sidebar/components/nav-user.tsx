'use client';

import type { Session } from '@arianne/auth';
import { clientConfig } from '@arianne/auth';
import { useQuery } from '@tanstack/react-query';
import {
  Bell,
  ChevronsUpDown,
  HeartIcon,
  LogOut,
  UserCogIcon,
} from 'lucide-react';
import { redirect } from 'next/navigation';

import { authClient } from '@/auth/client';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { env } from '@/env.mjs';
import { useTRPC } from '@/trpc/react';

export function NavUser({ user }: { user: Session['user'] }) {
  const { isMobile } = useSidebar();
  const api = useTRPC();
  const { data: account } = useQuery(
    api.user.getAccount.queryOptions({ userId: user.id }),
  );

  const avatar = <HeartIcon className="fill-slate-300 stroke-0" />;

  const signOut = async () => {
    const searchParams = new URLSearchParams();
    searchParams.set('post_logout_redirect_uri', env.NEXT_PUBLIC_LANDING_URL);
    searchParams.set('id_token_hint', account?.idToken || '');

    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          redirect(`${clientConfig.logoutUrl}?${searchParams.toString()}`);
        },
      },
    });
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">{avatar}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    {avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem disabled>
                <UserCogIcon />
                Profilo
              </DropdownMenuItem>
              <DropdownMenuItem disabled>
                <Bell />
                Notifiche
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
