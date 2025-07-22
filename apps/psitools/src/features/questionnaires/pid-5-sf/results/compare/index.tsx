'use client';

import { AlignLeft, List, LoaderCircle, ScatterChart } from 'lucide-react';
import { useState } from 'react';

import { Skeleton } from '@/components/ui/sckeleton';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  AdministrationContentCompare,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/features/questionnaires/components/administration';
import type { DotGraphDataComparison } from '@/features/questionnaires/components/dot-graph';
import { DotGraph } from '@/features/questionnaires/components/dot-graph';
import type { ItemsListQuestions } from '@/features/questionnaires/components/items-list';
import { ItemsList } from '@/features/questionnaires/components/items-list';
import { LineGraph } from '@/features/questionnaires/components/line-graph';
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
import type { FormValues } from '@/features/questionnaires/pid-5-sf/item';
import { QUESTIONS } from '@/features/questionnaires/pid-5-sf/questions';
import DOMAIN_MAP from '@/features/questionnaires/pid-5-sf/settings';
import { cn } from '@/utils/cn';

const RESPONSES_DICT = {
  0: 'Sempre o spesso falso',
  1: 'Talvolta o abbastanza falso',
  2: 'Talvolta o abbastanza vero',
  3: 'Sempre o spesso vero',
} as const;

type TValue = keyof typeof RESPONSES_DICT;

const Value = ({
  currentValue,
  otherValue,
}: {
  currentValue: TValue;
  otherValue: TValue;
}) => {
  // Inverts logic comparison `reverse`
  const isWorse = currentValue > otherValue;
  return (
    <div className="flex h-full space-x-2">
      <Separator className="h-full w-px bg-slate-300" />
      <span
        className={cn(
          'flex rounded-full px-2 font-semibold',
          isWorse && 'bg-red-200 text-red-500',
        )}
      >
        {RESPONSES_DICT[currentValue]}
      </span>
    </div>
  );
};

export default function AdministrationResultsPid5SFPage() {
  const [selectedDomain, setSelectedDomain] = useState<string>('domini');
  const [selectedFacet, setSelectedFacet] = useState<string>('tutti');
  const [toggleValue, setToggleValue] = useState('dots');
  const [toggleGraph, setToggleGraph] = useState<string>('chart');

  const { administration, isLoading } = useAdministration<FormValues>({
    isComparison: true,
  });

  if (!administration || isLoading)
    return <Skeleton className="h-full w-full" />;

  const [prevAdministration, nextAdministration] = administration;

  const prevScore = prevAdministration.records.score;
  const nextScore = nextAdministration.records.score;

  if (!prevAdministration || !nextAdministration)
    return (
      <p>
        Errore nel ritrovamento delle informazioni relative alle
        somministrazioni.
      </p>
    );

  const { response: prevResponse } = prevAdministration.records;
  const { response: nextResponse } = nextAdministration.records;

  if (
    prevResponse === undefined ||
    prevScore === undefined ||
    nextResponse === undefined ||
    nextScore === undefined
  )
    return null;

  const DOMAIN_LABELS: Record<string, string> = {
    affettivita: 'Affettività negativa',
    distacco: 'Distacco',
    antagonismo: 'Antagonismo',
    disinibizione: 'Disinibizione',
    psicoticismo: 'Psicoticismo',
  };

  // Score Cards
  const renderScoreCards = () => {
    const keysToShow = DOMAIN_MAP[selectedDomain];

    const isSpecialDomain = [
      'affettivita',
      'distacco',
      'antagonismo',
      'disinibizione',
      'psicoticismo',
    ].includes(selectedDomain);

    // Calculate total average for domain PREV
    const mediaTotalePrev =
      keysToShow.reduce((sum, { scoreKey, id }) => {
        const facetScorePrev = prevScore[scoreKey] ?? 0;
        const numberOfIds = id.length;
        const media = facetScorePrev / numberOfIds;
        return sum + media;
      }, 0) / keysToShow.length;

    const mediaTotaleArrotondataPrev = parseFloat(mediaTotalePrev.toFixed(2));

    // Calculate raw score sum for domain PREV
    const sommaPunteggiGrezziPrev = keysToShow.reduce((sum, { scoreKey }) => {
      const facetScorePrev = prevScore[scoreKey] ?? 0;
      return sum + facetScorePrev;
    }, 0);

    // Calculate total average for domain NEXT
    const mediaTotaleNext =
      keysToShow.reduce((sum, { scoreKey, id }) => {
        const facetScoreNext = nextScore[scoreKey] ?? 0;
        const numberOfIds = id.length;
        const media = facetScoreNext / numberOfIds;
        return sum + media;
      }, 0) / keysToShow.length;

    const mediaTotaleArrotondataNext = parseFloat(mediaTotaleNext.toFixed(2));

    // Calculate raw score sum for domain NEXT
    const sommaPunteggiGrezziNext = keysToShow.reduce((sum, { scoreKey }) => {
      const facetScoreNext = nextScore[scoreKey] ?? 0;
      return sum + facetScoreNext;
    }, 0);

    return (
      <div className="relative grid grid-cols-[220px_220px_220px_220px] place-items-stretch gap-4">
        {isSpecialDomain && (
          <ScoreCard
            label={`${
              DOMAIN_LABELS[selectedDomain] || selectedDomain
            } (Totale)`}
            className="m-0 rounded-md bg-slate-100"
            score={[mediaTotaleArrotondataPrev, mediaTotaleArrotondataNext]}
            baseText={`${
              DOMAIN_LABELS[selectedDomain] || selectedDomain
            } (Totale)`}
            comparisonText={{
              positive: 'I sintomi sono peggiorati',
              negative: 'I sintomi sono migliorati',
              indifferent: 'I sintomi sono rimasti invariati',
            }}
          >
            <p className="text-center text-sm">
              Punteggio grezzo =
              {[sommaPunteggiGrezziNext - sommaPunteggiGrezziPrev]}
            </p>
          </ScoreCard>
        )}

        {keysToShow.map(({ label, scoreKey, id }) => {
          const facetScorePrev = prevScore[scoreKey] ?? 0;
          const numberOfIds = id.length;

          // Calculate facet average PREV
          const mediaPrev = facetScorePrev / numberOfIds;
          const mediaRoundedPrev = parseFloat(mediaPrev.toFixed(2));

          const facetScoreNext = nextScore[scoreKey] ?? 0;

          // Calculate facet average NEXT
          const mediaNext = facetScoreNext / numberOfIds;
          const mediaRoundedNext = parseFloat(mediaNext.toFixed(2));

          return (
            <ScoreCard
              label={label}
              key={label}
              className="m-0 rounded-md border border-slate-100"
              score={[mediaRoundedPrev, mediaRoundedNext]}
              baseText={label}
              comparisonText={{
                positive: 'I sintomi sono peggiorati',
                negative: 'I sintomi sono migliorati',
                indifferent: 'I sintomi sono invariati',
              }}
            >
              <p className="mb-4 text-center text-sm">
                Punteggio grezzo = {[facetScoreNext - facetScorePrev]}
              </p>
            </ScoreCard>
          );
        })}
      </div>
    );
  };

  // Line Graph
  const rendeLineGraph = () => {
    const keysToShow = DOMAIN_MAP[selectedDomain];

    const isSpecialDomain = [
      'affettivita',
      'distacco',
      'antagonismo',
      'disinibizione',
      'psicoticismo',
    ].includes(selectedDomain);

    // Calculate raw score sum PREV
    const sommaPunteggiGrezziPrev = keysToShow.reduce((sum, { scoreKey }) => {
      const facetScorePrev = prevScore[scoreKey] ?? 0;
      return sum + facetScorePrev;
    }, 0);

    // Calculate raw score sum NEXT
    const sommaPunteggiGrezziNext = keysToShow.reduce((sum, { scoreKey }) => {
      const facetScoreNext = nextScore[scoreKey] ?? 0;
      return sum + facetScoreNext;
    }, 0);

    // Calculate maxScore for special domains
    const getMaxScoreForSpecialDomain = () => {
      if (isSpecialDomain) {
        const maxScoreSum = keysToShow.reduce(
          (sum, facet) => sum + (facet.maxScore ?? 0),
          0,
        );
        return maxScoreSum;
      }
      return 1;
    };

    const maxScoreSpecialDomain = getMaxScoreForSpecialDomain();
    return (
      <div className="flex flex-col gap-4 pt-4">
        {isSpecialDomain && (
          <>
            <LineGraph
              maxScore={maxScoreSpecialDomain}
              label={`${
                DOMAIN_LABELS[selectedDomain] || selectedDomain
              } (Totale)`}
              scores={[
                {
                  score: sommaPunteggiGrezziPrev,
                  T: prevAdministration.T,
                },
                {
                  score: sommaPunteggiGrezziNext,
                  T: nextAdministration.T,
                },
              ]}
              ticks={[]}
            />

            <Separator orientation="horizontal" className="h-[1px] w-full" />
          </>
        )}

        {keysToShow.map(({ label, scoreKey, maxScore }) => {
          const facetScorePrev = prevScore[scoreKey] ?? 0;
          const facetScoreNext = nextScore[scoreKey] ?? 0;

          return (
            <LineGraph
              maxScore={maxScore}
              key={label}
              label={label}
              scores={[
                {
                  score: facetScorePrev,
                  T: prevAdministration.T,
                },
                {
                  score: facetScoreNext,
                  T: nextAdministration.T,
                },
              ]}
              ticks={[]}
            />
          );
        })}
      </div>
    );
  };

  const filterQuestionsByFacet = () => {
    if (selectedFacet === 'tutti') {
      return Object.entries(prevResponse).map(([key, value]) => ({
        index: key.split('-')[1],
        prev: +value,
        next: +nextResponse[key],
      }));
    }

    // Dot Graph
    const facetData = DOMAIN_MAP[selectedDomain].find(
      (facet) => facet.scoreKey === selectedFacet,
    );

    if (!facetData) return [];

    const facetIDs = facetData.id;

    return Object.entries(prevResponse)
      .filter(([key]) => {
        const indexNumber = parseInt(key.split('-')[1], 10);
        return facetIDs.includes(indexNumber);
      })
      .map(([key, value]) => ({
        index: key.split('-')[1],
        prev: +value,
        next: +nextResponse[key],
      })) satisfies DotGraphDataComparison;
  };

  const renderDotGraph = () => {
    const data = filterQuestionsByFacet();

    const graphHeight = selectedFacet === 'tutti' ? 6000 : 500;

    return (
      <DotGraph
        T={[prevAdministration.T, nextAdministration.T]}
        domain={[0, 3]}
        data={data}
        height={graphHeight}
      />
    );
  };

  const filteredQuestions = () => {
    const facetEntry = DOMAIN_MAP.domini.find(
      (facet) => facet.scoreKey === selectedFacet,
    );

    if (!facetEntry) {
      return Object.entries(prevResponse).map(([key, value], index) => {
        const question = QUESTIONS[index];
        const reversePrevValue = +value;
        const reverseNextValue = +nextResponse[key];

        return {
          id: `${key.split('-')[1]}`,
          text: question.text,
          value: {
            prev: (
              <Value
                currentValue={reversePrevValue as TValue}
                otherValue={reverseNextValue as TValue}
              />
            ),
            next: (
              <Value
                currentValue={reverseNextValue as TValue}
                otherValue={reversePrevValue as TValue}
              />
            ),
          },
        };
      });
    }

    const filteredIDs = facetEntry.id;

    return Object.entries(prevResponse)
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
        const reversePrevValue = +value;
        const reverseNextValue = +nextResponse[key];

        return {
          id: `${key.split('-')[1]}`,
          text: question.text,
          value: {
            prev: (
              <Value
                currentValue={reversePrevValue as TValue}
                otherValue={reverseNextValue as TValue}
              />
            ),
            next: (
              <Value
                currentValue={reverseNextValue as TValue}
                otherValue={reversePrevValue as TValue}
              />
            ),
          },
        };
      }) satisfies ItemsListQuestions;
  };

  const renderItemsList = () => {
    const data = filteredQuestions();

    return (
      <ItemsList
        questions={data}
        T={[prevAdministration.T, nextAdministration.T]}
      />
    );
  };

  const renderGraph = () => {
    if (toggleValue === 'dots') return renderDotGraph();
    return renderItemsList();
  };
  return (
    <AdministrationContentCompare
      isLoading={isLoading}
      type="pid-5-sf"
      administrations={[prevAdministration, nextAdministration]}
      title="Inventario di personalità
per il DSM-5 Short Form
(PID-5-SF) – Adulto"
    >
      <Card>
        <CardHeader>
          <CardTitle>Punteggio</CardTitle>
          <div className="flex justify-between pt-4">
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
            <ToggleGroup
              type="single"
              variant="outline"
              value={toggleGraph}
              onValueChange={(value) => setToggleGraph(value)}
              className="h-9 justify-end p-4 pr-0"
            >
              <ToggleGroupItem
                value="chart"
                size="sm"
                className="h-9 px-[12px]"
              >
                <LoaderCircle className="mr-1 h-6 w-6" /> Sintesi
              </ToggleGroupItem>
              <ToggleGroupItem value="list" size="sm" className="h-9 px-[12px]">
                <AlignLeft className="mr-1 h-6 w-6" /> Dettagli
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardHeader>

        {/* Score cards */}

        <CardContent>
          {toggleGraph === 'chart' ? (
            <div>{renderScoreCards()}</div>
          ) : (
            <div>{rendeLineGraph()}</div>
          )}
        </CardContent>

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
          {renderGraph()}
        </CardFooter>
      </Card>
    </AdministrationContentCompare>
  );
}
