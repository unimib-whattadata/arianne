'use client';

import { AlignLeft, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { Chart } from './chart';
import { Graph } from './graph';

interface Props {
  prevScore: {
    anxiety: number;
    depression: number;
    stress: number;
  };
  nextScore: {
    anxiety: number;
    depression: number;
    stress: number;
  };
  prevT: number;
  nextT: number;
}
export const ScoreCard = (props: Props) => {
  const { prevScore, nextScore, prevT, nextT } = props;

  const [toggleGraph, setToggleGraph] = useState<string>('chart');

  return (
    <Card className="w-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Punteggio
          <div className="flex items-center text-sm font-normal">
            <ToggleGroup
              type="single"
              value={toggleGraph}
              onValueChange={(value) => setToggleGraph(value)}
              className="justify-end gap-0 rounded-md bg-input pr-0"
            >
              <ToggleGroupItem value="chart" size="sm">
                <LoaderCircle className="mr-1 h-5 w-5" /> Sintesi
              </ToggleGroupItem>
              <ToggleGroupItem value="list" size="sm">
                <AlignLeft className="mr-1 h-5 w-5" /> Dettagli
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex w-200 items-center gap-12">
        {toggleGraph === 'chart' ? (
          <>
            <Chart
              prevScore={
                prevScore.anxiety + prevScore.depression + prevScore.stress
              }
              nextScore={
                nextScore.anxiety + nextScore.depression + nextScore.stress
              }
              label="Distress generale"
            />
            <Separator orientation="vertical" className="w-1px mt-7 h-28" />
            <Chart
              label="Depressione"
              prevScore={prevScore.depression}
              nextScore={nextScore.depression}
            />
            <Chart
              label="Ansia"
              prevScore={prevScore.anxiety}
              nextScore={nextScore.anxiety}
            />
            <Chart
              label="Stress"
              prevScore={prevScore.stress}
              nextScore={nextScore.stress}
            />
          </>
        ) : (
          <div className="grid space-y-4">
            <Graph
              prevScore={
                prevScore.anxiety + prevScore.depression + prevScore.stress
              }
              nextScore={
                nextScore.anxiety + nextScore.depression + nextScore.stress
              }
              label="Distress generale"
              prevT={prevT}
              nextT={nextT}
            />
            <Separator className="w-full" />
            <Graph
              label="Depressione"
              prevScore={prevScore.depression}
              nextScore={nextScore.depression}
              prevT={prevT}
              nextT={nextT}
            />
            <Graph
              label="Ansia"
              prevScore={prevScore.anxiety}
              nextScore={nextScore.anxiety}
              prevT={prevT}
              nextT={nextT}
            />
            <Graph
              label="Stress"
              prevScore={prevScore.stress}
              nextScore={nextScore.stress}
              prevT={prevT}
              nextT={nextT}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
