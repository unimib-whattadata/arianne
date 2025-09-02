'use client';

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';

import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer } from '@/components/ui/chart';

const normalizeInput = ({
  input,
  min,
  max,
}: {
  input: number;
  min: number;
  max: number;
}): number => {
  const outputMin = 180;
  const outputMax = -180;

  return ((input - min) * (outputMax - outputMin)) / (max - min) + outputMin;
};

interface Props {
  score: number;
  label: string;
}

export const Chart = (props: Props) => {
  const { score, label } = props;

  const chartData = [{ score }];

  const chartConfig = {
    score: { label },
  } satisfies ChartConfig;

  const getScoreColor = (score: number): string => {
    if (label === 'Depressione') {
      if (score < 10) return 'fill-green-400';
      if (score < 14) return 'fill-yellow-400';
      if (score < 21) return 'fill-orange-400';
      return 'fill-red-400';
    }

    if (label === 'Ansia') {
      if (score < 8) return 'fill-green-400';
      if (score < 10) return 'fill-yellow-400';
      if (score < 15) return 'fill-orange-400';
      return 'fill-red-400';
    }

    if (label === 'Stress') {
      if (score < 15) return 'fill-green-400';
      if (score < 19) return 'fill-yellow-400';
      if (score < 26) return 'fill-orange-400';
      return 'fill-red-400';
    }

    return 'fill-primary';
  };

  const normalizedScore = () => {
    if (label === 'Distress generale') {
      return normalizeInput({
        input: score,
        min: 0,
        max: 126,
      });
    }
    return normalizeInput({
      input: score,
      min: 0,
      max: 42,
    });
  };

  const severity = () => {
    if (label === 'Depressione') {
      if (score < 10) return 'Normale';
      if (score < 14) return 'Lieve';
      if (score < 21) return 'Moderata';
      if (score < 28) return 'Grave';
      return 'Molto grave';
    }

    if (label === 'Ansia') {
      if (score < 8) return 'Normale';
      if (score < 10) return 'Lieve';
      if (score < 15) return 'Moderata';
      if (score < 20) return 'Grave';
      return 'Molto grave';
    }

    if (label === 'Stress') {
      if (score < 15) return 'Normale';
      if (score < 19) return 'Lieve';
      if (score < 26) return 'Moderata';
      if (score < 34) return 'Grave';
      return 'Molto grave';
    }
  };

  return (
    <div className="grid place-content-center space-y-2">
      <div className="grid place-content-center">
        <span className="text-center font-bold">{label}</span>
        <small className="min-h-[1.2rem] text-center">{severity()}</small>
      </div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square min-w-[132px] flex-1"
      >
        <RadialBarChart
          data={chartData}
          startAngle={180}
          endAngle={normalizedScore()}
          innerRadius={60}
          outerRadius={90}
        >
          <PolarGrid
            gridType="circle"
            radialLines={false}
            stroke="none"
            className="first:fill-muted last:fill-background"
            polarRadius={[66, 54]}
          />
          <RadialBar
            dataKey="score"
            background
            cornerRadius={10}
            className={getScoreColor(score)}
          />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-xl font-bold"
                      >
                        {score}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
        </RadialBarChart>
      </ChartContainer>
    </div>
  );
};
