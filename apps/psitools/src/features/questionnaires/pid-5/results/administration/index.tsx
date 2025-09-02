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
import type { FormValues } from '@/features/questionnaires/pid-5/item';
import { QUESTIONS } from '@/features/questionnaires/pid-5/questions';
import DOMAIN_MAP from '@/features/questionnaires/pid-5/settings';

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

const AdministrationResultsPid5: NextPage = () => {
  const [toggleValue, setToggleValue] = useState('dots');
  const [selectedDomain, setSelectedDomain] = useState<string>('domini');
  const [selectedFacet, setSelectedFacet] = useState<string>('tutti');

  const { administration, isLoading } = useAdministration<FormValues>();

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

  const { response, score } = administration.records;
  if (!response || !score) return null;

  // Mappa dei domini
  const DOMAIN_LABELS: Record<string, string> = {
    affettivita: 'Affettività negativa',
    distacco: 'Distacco',
    antagonismo: 'Antagonismo',
    disinibizione: 'Disinibizione',
    psicoticismo: 'Psicoticismo',
  };
  const renderScoreCards = () => {
    const keysToShow = DOMAIN_MAP[selectedDomain];

    const isSpecialDomain = [
      'affettivita',
      'distacco',
      'antagonismo',
      'disinibizione',
      'psicoticismo',
    ].includes(selectedDomain);

    // Calcolo la media totale dominio
    const mediaTotale =
      keysToShow.reduce((sum, { scoreKey, id }) => {
        const facetScore = score[scoreKey] ?? 0;
        const numberOfIds = id.length;
        const media = facetScore / numberOfIds;
        return sum + media;
      }, 0) / keysToShow.length;

    const mediaTotaleArrotondata = parseFloat(mediaTotale.toFixed(2));

    // Calcolo somma dei punteggi grezzi dominio
    const sommaPunteggiGrezzi = keysToShow.reduce((sum, { scoreKey }) => {
      const facetScore = score[scoreKey] ?? 0;
      return sum + facetScore;
    }, 0);

    return (
      <div className="relative grid grid-cols-[220px_220px_220px_220px] place-items-stretch gap-4">
        {isSpecialDomain && (
          <>
            <ScoreCard
              key={`${
                DOMAIN_LABELS[selectedDomain] || selectedDomain
              } (Totale)`}
              label={`${
                DOMAIN_LABELS[selectedDomain] || selectedDomain
              } (Totale)`}
              className="m-0 rounded-md bg-slate-100"
              score={mediaTotaleArrotondata}
            >
              <p className="text-center text-sm">
                Punteggio grezzo = {sommaPunteggiGrezzi}
              </p>
            </ScoreCard>
          </>
        )}

        {keysToShow.map(({ label, scoreKey, id }) => {
          const facetScore = score[scoreKey] ?? 0;
          const numberOfIds = id.length;

          // Calcolo media facet
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
      </div>
    );
  };

  const filterQuestionsByFacet = () => {
    if (selectedFacet === 'tutti') {
      return Object.entries(response).map(([key, value]) => ({
        index: key.split('-')[1],
        value: +value,
      }));
    }

    // Dot Graph
    const facetData = DOMAIN_MAP[selectedDomain].find(
      (facet) => facet.scoreKey === selectedFacet,
    );

    if (!facetData) return [];

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

    const graphHeight = selectedFacet === 'tutti' ? 6000 : 500;

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
      (facet) => facet.scoreKey === selectedFacet,
    );

    if (!facetEntry) {
      return Object.entries(response).map(([key, value], index) => {
        const question = QUESTIONS[index];
        const reverseValue = question.reverse ? 3 - +value : +value;

        return {
          id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
          text: question.text,
          value: <Value value={reverseValue as TValue} />,
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

        const reverseValue = question.reverse ? 3 - +value : +value;

        return {
          id: `${key.split('-')[1]}${question.reverse ? 'R' : ''}`,
          text: question.text,
          value: <Value value={reverseValue as TValue} />,
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
      type="pid-5"
      date={administration.date}
      T={administration.T}
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Punteggio</CardTitle>
            <Select
              onValueChange={(value) => {
                setSelectedDomain(value);
                setSelectedFacet('tutti');
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
                  <SelectItem value="altro">Altro</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        {/* Score cards */}
        <CardContent>
          <div>{renderScoreCards()}</div>
        </CardContent>

        {/* Dettagli */}
        <CardFooter>
          <div className="flex justify-between">
            <div className="my-3">
              <Select
                onValueChange={(value) => setSelectedFacet(value)}
                value={selectedFacet}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tutti i facet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Facet</SelectLabel>
                    <SelectItem value="tutti">Tutti i facet</SelectItem>
                    {DOMAIN_MAP[selectedDomain].map((facet) => (
                      <SelectItem key={facet.scoreKey} value={facet.scoreKey}>
                        {facet.label}
                      </SelectItem>
                    ))}
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

export default AdministrationResultsPid5;
