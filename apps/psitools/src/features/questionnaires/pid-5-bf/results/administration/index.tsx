'use client';

import { List, ScatterChart } from 'lucide-react';
import type { NextPage } from 'next';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/sckeleton';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  AdministrationContent,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/questionnaires/components/administration';
import type { DotGraphDataSingle } from '@/features/questionnaires/components/dot-graph';
import { DotGraph } from '@/features/questionnaires/components/dot-graph';
import type { ItemsListQuestions } from '@/features/questionnaires/components/items-list';
import { ItemsList } from '@/features/questionnaires/components/items-list';
import { ScoreCard } from '@/features/questionnaires/components/score-card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/features/questionnaires/components/select';
import { useAdministration } from '@/features/questionnaires/hooks/use-administration';
import type { FormValues } from '@/features/questionnaires/pid-5-bf/item';
import { QUESTIONS } from '@/features/questionnaires/pid-5-bf/questions';
import DOMAIN_MAP from '@/features/questionnaires/pid-5-bf/settings';

const RESPONSES_DICT = {
  0: 'Sempre o spesso falso',
  1: 'Talvolta o abbastanza falso',
  2: 'Talvolta o abbastanza vero',
  3: 'Sempre o spesso vero',
} as const;

type TValue = keyof typeof RESPONSES_DICT;

const Value = ({ value }: { value: TValue }) => {
  return (
    <div className="flex h-full">
      <Separator className="h-full w-px bg-slate-300" />
      <span className="flex px-2 font-semibold">{RESPONSES_DICT[value]}</span>
    </div>
  );
};

const AdministrationResultsPid5BF: NextPage = () => {
  const [toggleValue, setToggleValue] = useState('dots');
  const [selectedDomain, setSelectedDomain] = useState<string>('domini');

  const { administration, isLoading } = useAdministration<FormValues>();

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

  const { response, score } = administration.records;
  if (!response || !score) return null;

  const renderScoreCards = () => {
    const allDomains = DOMAIN_MAP.domini;

    const mediaTotale =
      allDomains.reduce((sum, { scoreKey }) => {
        const facetScore = score[scoreKey] ?? 0;
        const media = facetScore / 5;
        return sum + media;
      }, 0) / allDomains.length;
    const mediaTotaleArrotondata = parseFloat(mediaTotale.toFixed(2));

    const sommaPunteggiGrezzi = allDomains.reduce((sum, { scoreKey }) => {
      const facetScore = score[scoreKey] ?? 0;
      return sum + facetScore;
    }, 0);

    return (
      <div className="relative grid grid-cols-[220px_220px_220px_220px] place-items-stretch gap-4">
        {allDomains.map(({ label, scoreKey, id }) => {
          const facetScore = score[scoreKey] ?? 0;
          const numberOfIds = id.length;

          const media = facetScore / numberOfIds;
          const mediaRounded = parseFloat(media.toFixed(2));

          return (
            <ScoreCard
              key={label}
              label={label}
              className="m-0 rounded-md border border-slate-100"
              score={mediaRounded}
            >
              <p className="mb-4 text-center text-sm">
                Punteggio grezzo = {facetScore}
              </p>
            </ScoreCard>
          );
        })}

        <ScoreCard
          key="Totale"
          label="Totale"
          className="m-0 rounded-md bg-slate-100"
          score={mediaTotaleArrotondata}
        >
          <p className="text-center text-sm">
            Punteggio grezzo = {sommaPunteggiGrezzi}
          </p>
        </ScoreCard>
      </div>
    );
  };

  const filterQuestionsByFacet = () => {
    if (selectedDomain === 'domini') {
      // Se è selezionato 'domini', restituisci tutti gli item
      return Object.entries(response).map(([key, value]) => ({
        index: key.split('-')[1],
        value: +value,
      }));
    }

    // Recupera i dati del sottogruppo selezionato
    const facetGroup = DOMAIN_MAP.domini; // Sempre lavoriamo su 'domini'
    const facetData = facetGroup.find(
      (facet) => facet.scoreKey === selectedDomain,
    );

    if (!facetData) {
      console.error(`No  data found for domain: ${selectedDomain}`);
      return [];
    }

    const facetIDs = facetData.id;

    return Object.entries(response)
      .filter(([key]) => {
        const indexNumber = parseInt(key.split('-')[1], 10);
        return facetIDs.includes(indexNumber);
      })
      .map(([key, value]) => ({
        index: key.split('-')[1],
        value: +value,
      })) satisfies DotGraphDataSingle;
  };

  const renderDotGraph = () => {
    const data = filterQuestionsByFacet();

    const graphHeight = selectedDomain === 'domini' ? 1000 : 400;

    return (
      <DotGraph
        T={administration.T ?? 0}
        domain={[0, 3]}
        data={data}
        height={graphHeight}
      />
    );
  };

  // Item List
  const filteredQuestions = () => {
    const facetEntry = DOMAIN_MAP.domini.find(
      (facet) => facet.scoreKey === selectedDomain,
    );

    if (!facetEntry) {
      return Object.entries(response).map(([key, value], index) => {
        const question = QUESTIONS[index];

        return {
          id: `${key.split('-')[1]}`,
          text: question.text,
          value: <Value value={+value as TValue} />,
        };
      });
    }

    const filteredIDs = facetEntry.id;

    return Object.entries(response)
      .filter(([key]) => {
        const indexNumber = parseInt(key.split('-')[1], 10);
        return filteredIDs.includes(indexNumber);
      })
      .map(([key, value]) => {
        const question = QUESTIONS.find(
          (q) => q.id === parseInt(key.split('-')[1], 10),
        );

        if (!question) {
          throw new Error('Question not found');
        }

        return {
          id: `${key.split('-')[1]}`,
          text: question.text,
          value: <Value value={+value as TValue} />,
        };
      }) satisfies ItemsListQuestions;
  };

  const renderItemsList = () => {
    const data = filteredQuestions();
    return <ItemsList questions={data} />;
  };

  const renderGraph = () => {
    if (toggleValue === 'dots') return renderDotGraph();
    return renderItemsList();
  };

  return (
    <AdministrationContent
      isLoading={isLoading}
      type="pid-5-bf"
      date={administration.date}
      T={administration.T}
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Punteggio</CardTitle>
          </div>
        </CardHeader>

        <CardContent>
          <div>{renderScoreCards()}</div>
        </CardContent>

        <CardFooter>
          <div className="flex justify-between">
            <div className="my-3">
              <Select
                onValueChange={(value) => {
                  setSelectedDomain(value);
                }}
                value={selectedDomain}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tutti i domini" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Domini</SelectLabel>
                    <SelectItem value="domini">Tutti i domini</SelectItem>
                    <SelectItem value="affettivita">
                      Affettività negativa
                    </SelectItem>
                    <SelectItem value="distacco">Distacco</SelectItem>
                    <SelectItem value="antagonismo">Antagonismo</SelectItem>
                    <SelectItem value="disinibizione">Disinibizione</SelectItem>
                    <SelectItem value="psicoticismo">Psicoticismo</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <ToggleGroup
              type="single"
              variant="outline"
              value={toggleValue}
              onValueChange={(value) => setToggleValue(value)}
              className="justify-end p-4 pr-0"
            >
              <ToggleGroupItem value="dots">
                <ScatterChart className="mr-1 h-6 w-6" /> Sintesi
              </ToggleGroupItem>
              <ToggleGroupItem value="list">
                <List className="mr-1 h-6 w-6" /> Dettagli
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="grid items-center gap-4"></div>
          {renderGraph()}
        </CardFooter>
      </Card>
    </AdministrationContent>
  );
};

export default AdministrationResultsPid5BF;
