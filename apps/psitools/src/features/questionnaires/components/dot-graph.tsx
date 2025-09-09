import * as d3 from 'd3';
import { useLayoutEffect, useRef } from 'react';

export type DotGraphDataSingle = {
  /**
   * The index of the data point.
   */
  index: string;
  /**
   * The value of the data point.
   */
  value: number;
}[];

export type DotGraphDataComparison = {
  /**
   * The index of the data point.
   */
  index: string;
  /**
   * The previous value of the data point.
   */
  prev: number;
  /**
   * The next value of the data point.
   */
  next: number;
}[];

/**
 * Props for the DotGraph component.
 */
type DotGraphProps =
  | {
      /**
       * A single number representing a specific value.
       */
      T: number;
      /**
       * An array of data points.
       */
      data: DotGraphDataSingle;
      /**
       * The domain (range) of the graph.
       */
      domain: [number, number];
      containerId?: string;
      height?: number;
      axis?: number;
    }
  | {
      /**
       * A tuple of two numbers representing a range or comparison values.
       */
      T: [number, number];
      /**
       * An array of data points.
       */
      data: DotGraphDataComparison;
      /**
       * The domain (range) of the graph.
       */
      domain: [number, number];
      containerId?: string;
      height?: number;
      axis?: number;
    };

const hasComparison = (
  data: DotGraphProps['data'],
): data is {
  index: string;
  prev: number;
  next: number;
}[] => {
  return 'prev' in data[0] && 'next' in data[0];
};

export const DotGraph = (props: DotGraphProps) => {
  const { data, domain, T, height = 500 } = props;

  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!container.current) return;

    // set the dimensions and margins of the graph
    const margin = { top: 50, right: 10, bottom: 10, left: 55 },
      width = container.current.clientWidth - margin.left - margin.right,
      height = container.current.clientHeight - margin.top - margin.bottom;

    // append the svg object to the body of the page
    const parent = d3.select(container.current);
    parent.select('svg').remove();

    const svg = parent
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const legend = svg.append('g');

    if (typeof T === 'number') {
      //single
      legend
        .append('g')
        .append('circle')
        .attr('r', 6)
        .attr('cx', 0)
        .attr('cy', -44)
        .classed('fill-primary', true);
      legend
        .insert('text', ':first-child')
        .text(`T${T}`)
        .attr('x', 10)
        .attr('y', -40)
        .classed('fill-space-gray text-[0.7rem]', true);
    } else {
      //comparison
      legend
        .append('g')
        .append('circle')
        .attr('r', 6)
        .attr('cx', 0)
        .attr('cy', -44)
        .classed('fill-primary-500', true);
      legend
        .insert('text', ':first-child')
        .text(`T${T[0]}`)
        .attr('x', 10)
        .attr('y', -40)
        .classed('fill-space-gray text-[0.7rem]', true);

      legend
        .append('g')
        .append('circle')
        .attr('r', 6)
        .attr('cx', 45)
        .attr('cy', -44)
        .classed('fill-primary', true);
      legend
        .insert('text', ':first-child')
        .text(`T${T[1]}`)
        .attr('x', 55)
        .attr('y', -40)
        .classed('fill-space-gray text-[0.7rem]', true);
    }

    // Add X axis
    const x = d3.scaleLinear().domain(domain).range([0, width]);
    const xAxis = d3
      .axisTop(x)
      .ticks(props.axis ?? 3)
      .tickPadding(10)
      .tickSize(0);
    svg
      .append('g')
      .call(xAxis)
      .append('text')
      .text('Punteggio')
      .classed('fill-space-gray text-[1rem]', true)
      .attr('x', width / 2)
      .attr('y', -30);

    // Y axis
    const y = d3
      .scaleBand()
      .range([0, height])
      .domain(
        data.map(function (d) {
          return d.index;
        }),
      );
    const yAxis = d3.axisLeft(y).tickSize(0).tickPadding(20);
    svg
      .append('g')
      .call(yAxis)
      .append('text')
      .text('Items')
      .classed(
        'fill-space-gray text-[1rem] [writing-mode:vertical-rl] transform-fill origin-center rotate-180',
        true,
      )
      .attr('x', -45)
      .attr('y', height / 2);

    const xAxisGrid = d3
      .axisTop(x)
      .tickSize(height)
      .ticks(props.axis ?? 3)
      .tickPadding(100);
    const yAxisGrid = d3
      .axisLeft(y)
      .tickSize(-width - 30)
      .tickPadding(100);

    //grid
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxisGrid)
      .classed('text-gray-200', true);
    svg
      .append('g')
      .attr('transform', `translate(${-15},0)`)
      .call(yAxisGrid)
      .classed('text-gray-200', true);

    svg.selectAll('line').each(function (d, i) {
      if (i === 0) {
        d3.select(this).remove();
      }
    });

    // Remove path around the graph
    svg.selectAll('.domain').remove();

    if (hasComparison(data)) {
      // Lines
      svg
        .selectAll('myline')
        .data(data)
        .enter()
        .append('line')
        .attr('x1', (d) => x(d.prev))
        .attr('x2', (d) => x(d.next))
        .attr('y1', function (d) {
          return (y(d.index) ?? 0) + y.bandwidth() / 2;
        })
        .attr('y2', function (d) {
          return (y(d.index) ?? 0) + y.bandwidth() / 2;
        })
        .classed('stroke-2 stroke-primary-300', true);

      // Circles 1
      svg
        .selectAll('mycircle')
        .data(data)
        .join('circle')
        .attr('cx', (d) => x(d.prev))
        .attr('cy', function (d) {
          return (y(d.index) ?? 0) + y.bandwidth() / 2;
        })
        .attr('r', '6')
        .classed('fill-primary-500', true);

      // Circles 2
      svg
        .selectAll('mycircle')
        .data(data)
        .join('circle')
        .attr('cx', (d) => x(d.next))
        .attr('cy', function (d) {
          return (y(d.index) ?? 0) + y.bandwidth() / 2;
        })
        .attr('r', '6')
        .classed('fill-primary', true);
    } else {
      svg
        .selectAll('mycircle')
        .data(data)
        .join('circle')
        .attr('cx', function (d) {
          return x(d.value);
        })
        .attr('cy', function (d) {
          return (y(d.index) ?? 0) + y.bandwidth() / 2;
        })
        .attr('r', '6')
        .classed('fill-primary', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, container]);

  return (
    <div
      ref={container}
      id={props.containerId ? props.containerId : 'container'}
      style={{ height: `${height}px` }}
    ></div>
  );
};
