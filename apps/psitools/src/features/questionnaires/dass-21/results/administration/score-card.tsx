'use client';

import { AlignLeft, LoaderCircle } from 'lucide-react';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

import { Chart } from './chart';
import { Graph } from './graph';

interface Props {
  score: {
    anxiety: number;
    depression: number;
    stress: number;
  };
}
export const ScoreCard = (props: Props) => {
  const { score } = props;

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
              score={score.anxiety + score.depression + score.stress}
              label="Distress generale"
            />
            <Separator orientation="vertical" className="w-1px mt-7 h-28" />
            <Chart score={score.depression} label="Depressione" />
            <Chart score={score.anxiety} label="Ansia" />
            <Chart score={score.stress} label="Stress" />
          </>
        ) : (
          <div className="grid space-y-4">
            <Graph
              label="Distress generale"
              score={score.anxiety + score.depression + score.stress}
            />
            <Separator className="w-full" />
            <Graph score={score.depression} label="Depressione" />
            <Graph score={score.anxiety} label="Ansia" />
            <Graph score={score.stress} label="Stress" />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
