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
  statistics?: {
    avarage: number;
    standardDeviation: number;
  };
}

export const Chart = (props: Props) => {
  const { score, statistics, label } = props;

  const chartData = [{ score }];

  const chartConfig = {
    score: { label },
  } satisfies ChartConfig;

  const getScoreColor = (score: number): string => {
    if (!statistics) return 'fill-primary';

    const { avarage, standardDeviation } = statistics;
    const pσ1 = avarage + standardDeviation;
    const pσ2 = avarage + 2 * standardDeviation;

    if (score < pσ1) return 'fill-green-400';
    if (score < pσ2) return 'fill-yellow-400';
    return 'fill-red-400';
  };

  const normalizedScore = () => {
    switch (label) {
      case 'IU Prospettica':
        return normalizeInput({
          input: score,
          min: 7,
          max: 35,
        });
      case 'IU Inibitoria':
        return normalizeInput({
          input: score,
          min: 5,
          max: 25,
        });
      default:
        return normalizeInput({
          input: score,
          min: 12,
          max: 60,
        });
    }
  };

  return (
    <div className="grid place-content-start space-y-2">
      <span className="text-center font-bold">{label}</span>
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
