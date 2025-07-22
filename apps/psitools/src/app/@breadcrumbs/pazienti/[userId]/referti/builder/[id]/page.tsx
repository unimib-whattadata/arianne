import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { api } from '@/trpc/server';

export default async function BreadcrumbSlot({
  params,
}: {
  params: Promise<{ userId: string; id: string }>;
}) {
  const { userId, id } = await params;
  const user = await api.user.findUnique({ where: { id: userId } });
  // const report = await api.reports.findUnique({ id });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/pazienti/${userId}/cartella-clinica`}>
            {user?.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/pazienti/${userId}/referti`}>
            Referti
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {/* <BreadcrumbPage>{report?.title}</BreadcrumbPage> */}
          <BreadcrumbPage>Template</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
