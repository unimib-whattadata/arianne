import type { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    disabled?: boolean;
    badge?: number;
    isActive?: boolean;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
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
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
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
                  <Link href={item.url} onClick={closeSidebar}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuButton>
              {item.badge !== undefined ? (
                <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
              ) : null}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
