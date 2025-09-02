import React from 'react';

import { cn } from '@/utils/cn';

const DEFAULT_DURATION_MS = 1600;
const DEFAULT_HEIGHT = 400;
const DEFAULT_WIDTH = 400;

export interface ShimmerProps {
  /**
   * Height of the shimmer
   * @default 400px
   * */
  height?: number;
  /**
   * Width of the shimmer
   * @default 400px
   * */
  width?: number;
  /**
   * Additional class name
   * */
  className?: string;
  /**
   * Duration of the shimmer animation
   * @default 1600ms
   * */
  duration?: number;
}

const calcShimmerStyle = (
  width: number,
  height: number,
  duration = DEFAULT_DURATION_MS,
) => ({
  backgroundSize: `${width * 10}px ${height}px`,
  animationDuration: `${(duration / 1000).toFixed(1)}s`,
});

export const Shimmer = ({
  className,
  duration,
  height = DEFAULT_HEIGHT,
  width = DEFAULT_WIDTH,
}: ShimmerProps) => {
  const shimmerStyle = calcShimmerStyle(width, height, duration);
  const style = { ...shimmerStyle, ...{ height, width } };

  return (
    <div
      className={cn(
        'from-8% via-18% to-18% animate-shimmering bg-[#78b6f4] bg-gradient-to-r from-[rgb(238_238_238)] via-[rgb(203,203,203)] to-[rgb(238_238_238)]',
        className,
      )}
      style={style}
    />
  );
};
