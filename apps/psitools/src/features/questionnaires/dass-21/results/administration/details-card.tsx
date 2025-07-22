'use client';

import { AlignLeft, ScatterChart } from 'lucide-react';
import { createContext, useContext, useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { FormValues } from '@/features/questionnaires/dass-21/item';

import { DetailsDots } from './details-dots';
import { DetailsList } from './details-list';

interface Context {
  scale: string;
  view: string;
  T: number;
  response: FormValues['response'];
}

const cardContext = createContext<Context>({
  scale: 'general',
  view: 'dots',
  T: 0,
  response: {},
});

interface ContextProviderProps {
  children: React.ReactNode;
  response: FormValues['response'];
  T: number;
  view: string;
  scale: string;
}
const ContextProvider = ({
  children,
  response,
  T,
  view,
  scale,
}: ContextProviderProps) => (
  <cardContext.Provider
    value={{
      scale,
      view,
      T,
      response,
    }}
  >
    {children}
  </cardContext.Provider>
);

const getItems = (response: FormValues['response'], scale: string) => {
  const anxiety = [2, 4, 7, 9, 15, 19, 20];
  const depression = [3, 5, 10, 13, 16, 17, 21];
  const stress = [1, 6, 8, 11, 12, 14, 18];

  if (scale === 'anxiety') {
    return Object.fromEntries(
      Object.entries(response).filter(([key]) =>
        anxiety.includes(+key.split('-')[1]),
      ),
    );
  }
  if (scale === 'depression') {
    return Object.fromEntries(
      Object.entries(response).filter(([key]) =>
        depression.includes(+key.split('-')[1]),
      ),
    );
  }
  if (scale === 'stress') {
    return Object.fromEntries(
      Object.entries(response).filter(([key]) =>
        stress.includes(+key.split('-')[1]),
      ),
    );
  }

  return response;
};

const Scale = () => {
  const { response, scale, view, T } = useContext(cardContext);

  const items = getItems(response, scale);

  return view === 'dots' ? (
    <DetailsDots T={T} responses={items} />
  ) : (
    <DetailsList responses={items} />
  );
};

interface Props {
  response: FormValues['response'];
  T: number;
}
export const DetailsCard = (props: Props) => {
  const { response, T } = props;

  const [scale, setScale] = useState<string>('general');
  const [view, setView] = useState<string>('dots');

  return (
    <ContextProvider response={response} T={T} view={view} scale={scale}>
      <Card className="w-fit">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Sintomi espressi
            <div className="flex items-center text-sm font-normal">
              <ToggleGroup
                type="single"
                value={view}
                onValueChange={(value) => setView(value)}
                className="justify-end gap-0 rounded-md bg-input pr-0"
              >
                <ToggleGroupItem value="dots" size="sm">
                  <ScatterChart className="mr-1 h-5 w-5" /> Sintesi
                </ToggleGroupItem>
                <ToggleGroupItem value="list" size="sm">
                  <AlignLeft className="mr-1 h-5 w-5" /> Dettagli
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid w-[50rem] items-center gap-4">
          <ToggleGroup
            type="single"
            value={scale}
            onValueChange={(value) => setScale(value)}
            className="flex w-full gap-0 rounded-md bg-input"
          >
            <ToggleGroupItem value="general" size="sm" className="flex-1">
              Distress generale
            </ToggleGroupItem>
            <ToggleGroupItem value="depression" size="sm" className="flex-1">
              Depressione
            </ToggleGroupItem>
            <ToggleGroupItem value="anxiety" size="sm" className="flex-1">
              Ansia
            </ToggleGroupItem>
            <ToggleGroupItem value="stress" size="sm" className="flex-1">
              Stress
            </ToggleGroupItem>
          </ToggleGroup>
          <Scale />
        </CardContent>
      </Card>
    </ContextProvider>
  );
};
