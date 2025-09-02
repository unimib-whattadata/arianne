'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function SiteHeader() {
  const pathname = usePathname();

  const breadcrumbItems = pathname.split('/').filter(Boolean);

  const isHome = breadcrumbItems.length === 0;
  const searchParams = useSearchParams();

  const hideUI = searchParams.get('hideUI') === 'true';

  if (hideUI) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 flex w-full items-center bg-background px-4">
      <div className="flex h-[var(--header-height)] w-full items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              {isHome ? (
                <BreadcrumbPage>Home</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {breadcrumbItems.map((segment, index) => {
              const href = '/' + breadcrumbItems.slice(0, index + 1).join('/');
              const capitalizedSegment = (
                segment.charAt(0).toUpperCase() + segment.slice(1)
              ).replaceAll('-', ' ');
              return (
                <Fragment key={href}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {index < breadcrumbItems.length - 1 ? (
                      <BreadcrumbLink asChild>
                        <Link href={href} className="">
                          {capitalizedSegment}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage>{capitalizedSegment}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
