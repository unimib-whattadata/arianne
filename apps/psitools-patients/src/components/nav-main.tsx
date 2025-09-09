'use client';

import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';

import { Badge } from './ui/badge';

export function NavMain({
  name,
  items,
}: {
  name?: string;
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    badge?: number;
    disabled?: boolean;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      disabled?: boolean;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);
  const isActive = (url: string) => {
    const urlSegment = url.split('/')[1];
    return pathSegments.includes(urlSegment);
  };

  const { toggleSidebar, isMobile } = useSidebar();
  const closeSidebar = () => {
    if (!isMobile) return;
    return toggleSidebar();
  };

  return (
    <SidebarGroup>
      {name ? <SidebarGroupLabel>{name}</SidebarGroupLabel> : null}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem className="relative">
              {item.badge && item.badge > 0 ? (
                <Badge className="absolute -top-1 left-0 grid h-5 w-5 place-content-center rounded-full bg-primary p-2 text-primary-foreground">
                  {item.badge}
                </Badge>
              ) : null}
              <SidebarMenuButton
                asChild={!item.disabled}
                tooltip={item.title}
                isActive={isActive(item.url)}
                disabled={item.disabled}
              >
                {item.disabled ? (
                  <>
                    <item.icon />
                    <span>{item.title}</span>
                  </>
                ) : (
                  <Link href={item.url} onClick={closeSidebar}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction
                      className="data-[state=open]:rotate-90"
                      disabled={item.disabled}
                    >
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(subItem.url)}
                          >
                            <Link
                              href={item.url + subItem.url}
                              onClick={closeSidebar}
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
