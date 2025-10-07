import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { api } from '@/trpc/server';
import type { TView } from '@/types/view-types';

export default async function BreadcrumbSlot({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string; type: string; view: [TView, string] }>;
  searchParams: Promise<{ comparison?: [string, string] }>;
}) {
  const { userId, type, view } = await params;
  const user = await api.profiles.get({ id: userId });

  let ViewType = <></>;
  if (view[0] === 'administration') {
    const { administration } = await api.administrations.findUnique({
      where: { id: view[1] },
    });
    ViewType = (
      <BreadcrumbItem>
        <BreadcrumbPage>
          Risultati T{administration.T} {administration.type}
        </BreadcrumbPage>
      </BreadcrumbItem>
    );
  }

  if (view[0] === 'view') {
    const { administration } = await api.administrations.findUnique({
      where: { id: view[1] },
    });
    ViewType = (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink
            href={`/pazienti/${userId}/assegnazioni/somministrazioni/risultati/${type}/administration/${view[1]}`}
          >
            Risultati {type}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Compilazione T{administration.T}</BreadcrumbPage>
        </BreadcrumbItem>
      </>
    );
  }

  if (view[0] === 'compare') {
    const { comparison } = await searchParams;
    if (!comparison) return <></>;
    const [first, second] = comparison;
    const tCompared = await api.administrations.findMany({
      where: { OR: [{ id: first }, { id: second }] },
      orderBy: { T: 'asc' },
    });

    const [ta, tb] = tCompared;

    ViewType = (
      <BreadcrumbItem>
        <BreadcrumbPage>
          Comparazione T{ta.T} - T{tb.T} {type}
        </BreadcrumbPage>
      </BreadcrumbItem>
    );
  }

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
          <BreadcrumbLink href={`/pazienti/${userId}/assegnazioni`}>
            Assegnazioni
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href={`/pazienti/${userId}/assegnazioni/somministrazioni`}
          >
            Somministrazioni
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {ViewType}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
