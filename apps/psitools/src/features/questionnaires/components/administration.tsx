'use client';

import type { Administration } from '@prisma/client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card as CardComponent,
  CardContent as CardContentComponent,
  CardDescription as CardDescriptionComponent,
  CardFooter as CardFooterComponent,
  CardHeader as CardHeaderComponent,
  CardTitle as CardTitleComponent,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/sckeleton';
import { useColumnsCompare } from '@/features/questionnaires/components/table/columns';
import type { available } from '@/features/questionnaires/settings';
import { dateFormatting } from '@/utils/date-formatter';

import { AdministrationCardDetail } from './administration-card-detail';
import { AdministrationResultsTable } from './table/table';

interface AdministrationContentProps {
  isLoading: boolean;
  children: React.ReactNode;
  date: Date;
  type: (typeof available)[number];
  T: number;
}
export const AdministrationContent = (props: AdministrationContentProps) => {
  const { isLoading, type, children, T, date } = props;
  return (
    <div className="space-y-8 p-4 pt-0">
      {isLoading ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <AdministrationCardDetail
          testType={type}
          testNumber={`T${T}`}
          date={dateFormatting(date, 'dd/MM/yyyy')}
        />
      )}
      {children}
    </div>
  );
};

interface AdministrationContentCompareProps {
  isLoading: boolean;
  type: (typeof available)[number];
  administrations: [Administration, Administration];
  children: React.ReactNode;
  title: string;
}
export const AdministrationContentCompare = (
  props: AdministrationContentCompareProps,
) => {
  const { isLoading, type, administrations, title, children } = props;
  const columnsCompare = useColumnsCompare();
  return (
    <div className="space-y-8 p-4 pt-0">
      {isLoading ? (
        <Skeleton className="h-full w-full" />
      ) : (
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="font-h2 pb-4">{title}</h2>
            <div className="flex w-1/3 flex-col">
              <AdministrationResultsTable
                columns={columnsCompare}
                data={administrations}
                questionnaire={type}
              />
            </div>
          </section>
        </div>
      )}
      {children}
    </div>
  );
};

interface CardProps {
  children: React.ReactNode;
}
export const Card = (props: CardProps) => (
  <CardComponent className="w-fit">{props.children}</CardComponent>
);

interface CardFooterProps {
  children: React.ReactNode;
}
export const CardFooter = (props: CardFooterProps) => (
  <CardFooterComponent className="px-4 pb-0">
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="expandible" className="border-b-0">
        <AccordionTrigger>Dettagli</AccordionTrigger>
        <AccordionContent>{props.children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  </CardFooterComponent>
);

interface CardHeaderProps {
  children: React.ReactNode;
}
export const CardHeader = (props: CardHeaderProps) => (
  <CardHeaderComponent className="p-4">{props.children}</CardHeaderComponent>
);
export const CardTitle = CardTitleComponent;
export const CardDescription = CardDescriptionComponent;

interface CardContentProps {
  children: React.ReactNode;
}
export const CardContent = (props: CardContentProps) => (
  <CardContentComponent className="p-4 pt-0">
    {props.children}
  </CardContentComponent>
);
