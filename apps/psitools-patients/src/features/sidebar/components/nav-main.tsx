'use client';

import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
  useSubMenu,
} from '@/components/ui/sidebar';

export interface SibebarMenuItems {
  name?: string;
  items: {
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
      icon?: LucideIcon;
      disabled?: boolean;
      isActive?: boolean;
    }[];
  }[];
}

export function NavMain({ name, items }: SibebarMenuItems) {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter(Boolean);

  const isActive = (url: string) => {
    if (url === '/' && pathSegments.length === 0) return true;
    const urlSegment = url.split('/').at(-1) ?? '';
    return pathSegments.at(-1) === urlSegment;
  };

  const { toggleSidebar, isMobile } = useSidebar();
  const closeSidebar = () => {
    if (!isMobile) return;
    return toggleSidebar();
  };

  const { isCollapsed, toggleCollapse } = useSubMenu();

  return (
    <SidebarGroup>
      {name ? (
        <SidebarGroupLabel className="mb-1 text-base">{name}</SidebarGroupLabel>
      ) : null}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={isCollapsed(item.title)}
            onOpenChange={(open) => toggleCollapse(item.title, open)}
            defaultOpen
          >
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild={!item.disabled}
                tooltip={item.title}
                isActive={item.isActive ?? isActive(item.url)}
                disabled={item.disabled}
              >
                {item.disabled ? (
                  <>
                    <item.icon />
                    <span>{item.title}</span>
                  </>
                ) : (
                  <Link
                    href={item.url}
                    onClick={closeSidebar}
                    replace={item.replace}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
              {item.badge ? (
                <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
              ) : null}
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction
                      className="text-foreground z-10 data-[state=open]:rotate-90"
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
                            isActive={subItem.isActive ?? isActive(subItem.url)}
                          >
                            <Link
                              href={item.url + subItem.url}
                              onClick={closeSidebar}
                              replace={item.replace}
                            >
                              {subItem.icon && <subItem.icon />}
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
