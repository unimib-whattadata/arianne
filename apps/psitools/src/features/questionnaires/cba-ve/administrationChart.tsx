import * as d3 from 'd3';
import React, { useEffect, useRef } from 'react';

type GraphLine = [number, number, number, number, number];
type GraphData = {
  data: SingleGraphData[];
  color: string;
}[];
interface SingleGraphData {
  array: number[];
  inverse: boolean;
}

interface AdministrationChartProps {
  firstLineData: GraphLine;
  secondLineData?: GraphLine | null;
}

const Graph = (props: AdministrationChartProps) => {
  const { firstLineData, secondLineData = null } = props;
  const graphRef = useRef<HTMLDivElement | null>(null);

  const width = 1000;
  const height = 780;
  const marginTop = 0;
  const marginRight = 20;
  const marginLeft = 20;
  const titleHeight = 20;
  const rightTitleWidth = 100;
  const rectMargin = 20;

  const itemHeightBlocks = [15, 15, 20, 15];

  const checkData = (lineData: GraphLine): GraphLine => {
    const [ansia, benessere, cambiamento, depressione, disagio] = lineData;
    // check first value
    if (ansia > 48) lineData[0] = 48;
    if (ansia < 14) lineData[0] = 14;
    // check second value
    if (benessere > 31) lineData[1] = 31;
    if (benessere < 3) lineData[1] = 3;
    // check third value
    if (cambiamento > 30) lineData[2] = 30;
    if (cambiamento < 0) lineData[2] = 0;
    // check fourth value
    if (depressione > 57) lineData[3] = 57;
    if (depressione < 21) lineData[3] = 21;
    // check fifth value
    if (disagio > 55) lineData[4] = 55;
    if (disagio < 15) lineData[4] = 15;

    return lineData;
  };

  // define data
  const red_data = [
    {
      array: [48, -1, 46, -1, 44, -1, 42, -1, 40, -1, 38, -1, 36],
      inverse: true,
    },
    { array: [3, -1, 5, -1, 7, -1, 9, 10], inverse: false },
    { array: [0, -1, 2, -1, 4, -1, 6, -1, 8, -1, 10, 11], inverse: false },
    {
      array: [57, -1, 55, -1, 53, -1, 51, -1, 49, -1, 47, -1, 45, -1, 43],
      inverse: true,
    },
    {
      array: [55, -1, 53, -1, 51, -1, 49, -1, 47, -1, 45, -1, 43, 42],
      inverse: true,
    },
  ];
  const orange_data = [
    { array: [35, -1, -1, 32, -1, -1, 29, -1, -1, 26, 25], inverse: true },
    { array: [11, -1, 13, -1, 15, -1, 17, -1, 19, 20], inverse: false },
    { array: [12, -1, 14, -1, 16, -1, 18, 19], inverse: false },
    { array: [42, -1, -1, 39, -1, -1, 36, -1, -1, 33, 32], inverse: true },
    {
      array: [41, -1, 39, -1, -1, -1, 35, -1, -1, -1, 31, -1, -1, -1, 27, 26],
      inverse: true,
    },
  ];
  const yellow_data = [
    { array: [24, -1, 22, 21], inverse: true },
    { array: [21, -1, 23, 24], inverse: false },
    { array: [20, -1, 22, 23], inverse: false },
    { array: [31, -1, 29, 28], inverse: true },
    { array: [25, -1, 23, 22], inverse: true },
  ];
  const green_data = [
    { array: [20, -1, 18, -1, 16, -1, 14], inverse: true },
    { array: [25, -1, 27, -1, 29, -1, 31], inverse: false },
    { array: [24, -1, 26, -1, 28, -1, 30], inverse: false },
    { array: [27, -1, 25, -1, 23, -1, 21], inverse: true },
    { array: [21, -1, 19, -1, 17, -1, 15], inverse: true },
  ];

  const headers = [
    'Ansia',
    'Benessere',
    'Cambiamento',
    'Depressione',
    'Disagio',
  ];
  const rightHeaders = [
    'Sintomi/Disagio più gravi',
    'Sintomi/Disagio moderati',
    'Punteggi al limite del normale',
    'Punteggi nella norma',
  ];

  const all_data = [
    { data: red_data, color: '#e68d7f' },
    { data: orange_data, color: '#f4b691' },
    { data: yellow_data, color: '#f5e598' },
    { data: green_data, color: '#94dc9c' },
  ];

  const getRectHeight = (
    data: SingleGraphData[],
    curretBlockIndex: number,
    rectMarginTop: number,
    rectMarginBottom: number,
  ): number => {
    let maxValue = 0;
    data.forEach((sequence) => {
      if (sequence.array.length > maxValue) {
        maxValue = sequence.array.length;
      }
    });
    const currentBlock = itemHeightBlocks[curretBlockIndex];
    if (currentBlock === undefined) return 0;
    return maxValue * currentBlock + rectMarginTop + rectMarginBottom;
  };

  const findRange = (data: GraphLine, all_data: GraphData): number[] => {
    const ranges: number[] = [];
    for (let i = 0; i < data.length; i++) {
      all_data.forEach((currentData, currentDataIndex) => {
        const currentValue = currentData.data[i];
        if (currentValue === undefined) return;
        const value1 = currentValue.array[0];
        const value2 = currentValue.array[currentValue.array.length - 1];
        const currentIthData = data[i];
        if (
          value1 === undefined ||
          value2 === undefined ||
          currentIthData === undefined
        )
          return;
        if (
          (currentIthData <= value1 && currentIthData >= value2) ||
          (currentIthData <= value2 && currentIthData >= value1)
        ) {
          ranges.push(currentDataIndex);
        }
      });
    }
    return ranges;
  };

  const findMinMax = (data: number[]) => {
    const deletedMinusOne = data.filter((element) => element !== -1);
    const minimum = Math.min.apply(null, deletedMinusOne);
    const maximum = Math.max.apply(null, deletedMinusOne);

    return [maximum, minimum];
  };

  const findPosition = (
    all_data: {
      data: { array: number[]; inverse: boolean }[];
      color: string;
    }[],
    data: GraphLine,
    ranges: number[],
  ) => {
    const positions = [];
    for (let i = 0; i < data.length; i++) {
      const currentRange = ranges[i];
      if (currentRange === undefined) continue;
      const currentRangeData = all_data[currentRange];
      if (currentRangeData === undefined) continue;
      const currentRangeDataIth = currentRangeData.data[i];
      if (currentRangeDataIth === undefined) continue;
      const [max, min] = findMinMax(currentRangeDataIth.array);
      if (max === undefined || min === undefined) continue;
      const diff = max - min;
      let position = 0;
      for (let j = min; j <= max; j++) {
        if (j === data[i]) {
          if (currentRangeDataIth.inverse) {
            positions.push(diff - position);
          } else {
            positions.push(position);
          }
        }
        position += 1;
      }
    }
    return positions;
  };

  const prepareData = (
    data: GraphLine,
    all_data: GraphData,
  ): [number, number][] => {
    const ranges = findRange(data, all_data);
    const positions = findPosition(all_data, data, ranges);
    const chartData: [number, number][] = [];
    for (let i = 0; i < data.length; i++) {
      const range = ranges[i];
      const position = positions[i];
      if (range === undefined || position === undefined) continue;
      chartData.push([range, position]);
    }
    return chartData;
  };

  useEffect(() => {
    if (graphRef.current === null) return;
    if (graphRef.current.hasChildNodes()) return;
    const svg = d3
      .select(graphRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', '0 0 1200 900');

    const getRect = (
      data: SingleGraphData[],
      x: number,
      y: number,
      curretBlockIndex: number,
      rightHeaders: string[],
      color: string,
    ) => {
      const currentRightHeader = rightHeaders[curretBlockIndex];
      if (currentRightHeader === undefined) return;
      svg
        .append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('width', width - marginRight - rightTitleWidth)
        .attr(
          'height',
          getRectHeight(data, curretBlockIndex, rectMargin, rectMargin),
        )
        .attr('fill', color);

      svg
        .append('text')
        .attr('x', width - marginRight - rightTitleWidth + 10)
        .attr(
          'y',
          y + getRectHeight(data, curretBlockIndex, rectMargin, rectMargin) / 2,
        )
        .style('font-size', '1rem')
        .style('fill', '#2C3246')
        .style('font-weight', 'bold')
        .text(currentRightHeader);

      const sequenceSpace = (width - marginLeft - marginRight) / data.length;

      data.forEach((sequence, index_first) => {
        sequence.array.forEach((number, index_second) => {
          if (number !== -1) {
            const currentHeightBlock = itemHeightBlocks[curretBlockIndex];
            if (currentHeightBlock === undefined) return;
            svg
              .append('text')
              .attr('x', marginLeft + index_first * sequenceSpace)
              .attr(
                'y',
                y + currentHeightBlock + index_second * currentHeightBlock,
              )
              .text(number);
          }
        });
      });
    };

    const drawChart = (
      all_data: GraphData,
      headers: string[],
      rightHeaders: string[],
    ) => {
      let updatedHeight = titleHeight;
      all_data.forEach((currentData, currentBlockIndex) => {
        getRect(
          currentData.data,
          0,
          updatedHeight,
          currentBlockIndex,
          rightHeaders,
          currentData.color,
        );
        updatedHeight +=
          getRectHeight(
            currentData.data,
            currentBlockIndex,
            rectMargin,
            rectMargin,
          ) + rectMargin;
      });

      const sequenceSpace = (width - marginLeft - marginRight) / 5;

      headers.forEach((header, index) => {
        svg
          .append('text')
          .attr('x', marginLeft + marginRight + index * sequenceSpace)
          .attr('y', marginTop)
          .style('font-size', '1rem')
          .style('text-anchor', 'middle')
          .style('fill', '#2C3246')
          .style('font-weight', 'bold')
          .text(header);
      });
    };

    const drawLine = (points: [number, number][], dashed = false) => {
      points.forEach((_, index) => {
        if (index < points.length - 1) {
          const firstPoint = points[index];
          const secondPoint = points[index + 1];
          if (firstPoint === undefined || secondPoint === undefined) return;
          const x1 = firstPoint[0];
          const y1 = firstPoint[1];
          const x2 = secondPoint[0];
          const y2 = secondPoint[1];
          if (
            x1 === undefined ||
            y1 === undefined ||
            x2 === undefined ||
            y2 === undefined
          )
            return;
          svg
            .append('line')
            .style('stroke', '#26344b')
            .attr('stroke-width', 4)
            .style(dashed ? 'stroke-dasharray' : 'stroke-width', `${8} ${4}`)
            .attr('x1', x1 + 5)
            .attr('y1', y1 + 5)
            .attr('x2', x2 + 5)
            .attr('y2', y2 + 5);
        }
      });
    };

    const drawPoint = (all_data: GraphData, line_data: [number, number][]) => {
      const points: [number, number][] = [];
      let updatedHeight = titleHeight;
      const sequenceSpace =
        (width - marginLeft - marginRight) / line_data.length;
      line_data.forEach((lineCurrentData, lineIndex) => {
        const first = lineCurrentData[0];
        const second = lineCurrentData[1];
        updatedHeight = titleHeight;
        all_data.forEach((currentData, currentDataIndex) => {
          if (first === currentDataIndex) {
            const currentLineData = currentData.data[lineIndex];
            if (currentLineData === undefined) return;
            const [max, min] = findMinMax(currentLineData.array);
            if (max === undefined || min === undefined) return;
            const diff = max - min;
            const blockHeight = itemHeightBlocks[currentDataIndex];
            if (blockHeight === undefined) return;
            const binLength =
              (blockHeight * currentLineData.array.length) / (diff + 1);
            const y = updatedHeight + binLength * second;
            const x = marginLeft + sequenceSpace * lineIndex;
            points.push([x, y]);
            svg
              .append('rect')
              .attr('x', x)
              .attr('y', y)
              .attr('width', 10)
              .attr('height', 10)
              .attr('fill', '#26344b');
          }
          updatedHeight +=
            getRectHeight(
              currentData.data,
              currentDataIndex,
              rectMargin,
              rectMargin,
            ) + rectMargin;
        });
      });
      return points;
    };

    const draw = (
      all_data: GraphData,
      line: GraphLine,
      headers: string[],
      rightHeaders: string[],
      secondLine: GraphLine | null = null,
    ) => {
      const datachecked = checkData(line);
      const chartData = prepareData(datachecked, all_data);
      drawChart(all_data, headers, rightHeaders);
      drawLine(drawPoint(all_data, chartData));
      if (secondLine) {
        const datacheckedSecond = checkData(secondLine);
        const chartDataSecond = prepareData(datacheckedSecond, all_data);
        drawLine(drawPoint(all_data, chartDataSecond), true);
      }
    };

    draw(all_data, firstLineData, headers, rightHeaders, secondLineData);
  });

  return <div ref={graphRef}></div>;
};

export const AdministrationChart = (props: AdministrationChartProps) => {
  const { firstLineData, secondLineData = null } = props;

  return (
    <Graph firstLineData={firstLineData} secondLineData={secondLineData} />
  );
};
