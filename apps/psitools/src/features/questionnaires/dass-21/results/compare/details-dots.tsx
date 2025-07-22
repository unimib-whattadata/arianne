'use client';

import * as d3 from 'd3';
import { useLayoutEffect, useRef } from 'react';

interface Props {
  prevResponse: Record<string, string>;
  nextResponse: Record<string, string>;
  prevT: number;
  nextT: number;
}

/**
 * data = [
 {"name":"Accountants and auditors","max":"76129","min":"57370"},
 ...
 https://d3-graph-gallery.com/graph/lollipop_cleveland.html
 */

export const DetailsDots = (props: Props) => {
  const { prevResponse, nextResponse, prevT, nextT } = props;

  const data = Object.entries(prevResponse).map(([index, record]) => {
    const i = index.split('-')[1];
    return {
      index: i,
      prevRecord: record,
      nextRecord: nextResponse[index],
    };
  });

  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!container.current) return;
    // set the dimensions and margins of the graph
    const margin = { top: 50, right: 10, bottom: 10, left: 55 },
      width = container.current.clientWidth - margin.left - margin.right,
      height = container.current.clientHeight - margin.top - margin.bottom;

    // append the svg object to the body of the page
    d3.select('#container svg').remove();
    const svg = d3
      .select('#container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const legend = svg.append('g');

    // Legend for prevT
    legend
      .append('g')
      .append('circle')
      .attr('r', 6)
      .attr('cx', 45)
      .attr('cy', -44)
      .classed('fill-primary', true);
    legend
      .insert('text', ':first-child')
      .text(`T${prevT}`)
      .attr('x', 10)
      .attr('y', -40)
      .classed('fill-space-gray text-[0.7rem]', true);

    // Legend for nextT
    legend
      .append('g')
      .append('circle')
      .attr('r', 6)
      .attr('cx', 0)
      .attr('cy', -44)
      .classed('fill-primary-500', true);
    legend
      .insert('text', ':first-child')
      .text(`T${nextT}`)
      .attr('x', 55)
      .attr('y', -40)
      .classed('fill-space-gray text-[0.7rem]', true);

    // Add X axis
    const x = d3.scaleLinear().domain([0, 3]).range([0, width]);
    const xAxis = d3.axisTop(x).ticks(3).tickPadding(10).tickSize(0);
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
        'fill-space-gray text-[1rem] [writing-mode:vertical-rl] [transform-box:fill-box] origin-center rotate-180',
        true,
      )
      .attr('x', -45)
      .attr('y', height / 2);

    const xAxisGrid = d3.axisTop(x).tickSize(height).ticks(3).tickPadding(100);
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

    // Lines
    svg
      .selectAll('myline')
      .data(data)
      .enter()
      .append('line')
      .attr('x1', function (d) {
        const score = parseInt(d.prevRecord ?? '0');
        return x(score);
      })
      .attr('x2', function (d) {
        const score = parseInt(d.nextRecord ?? '0');
        return x(score);
      })
      .attr('y1', function (d) {
        return (y(d.index) ?? 0) + y.bandwidth() / 2;
      })
      .attr('y2', function (d) {
        return (y(d.index) ?? 0) + y.bandwidth() / 2;
      })
      .classed('stroke-2 stroke-primary-300', true);

    // Remove path around the graph
    svg.selectAll('.domain').remove();

    // Circles 1
    svg
      .selectAll('mycircle')
      .data(data)
      .join('circle')
      .attr('cx', function (d) {
        const score = parseInt(d.prevRecord ?? '0');
        return x(score);
      })
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
      .attr('cx', function (d) {
        const score = parseInt(d.nextRecord ?? '0');
        return x(score);
      })
      .attr('cy', function (d) {
        return (y(d.index) ?? 0) + y.bandwidth() / 2;
      })
      .attr('r', '6')
      .classed('fill-primary', true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, container]);

  return <div ref={container} id="container" className="h-[500px]"></div>;
};
