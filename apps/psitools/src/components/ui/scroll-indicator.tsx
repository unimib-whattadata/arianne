'use client';

import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { ArrowDown } from 'lucide-react';

import { useIsOverflow } from '@/hooks/use-is-overflow';
import { cn } from '@/utils/cn';

interface Props {
  /**
   * The container element.
   * @type {React.RefObject<HTMLElement>}
   * @default null
   * @required
   */
  container: React.RefObject<HTMLElement>;
  /**
   * The height of the scroll indicator.
   */
  height?: number;
  className?: string;
}

export const ScrollIndicator = (props: Props) => {
  const { container: ref, height: max, className } = props;
  const { isOverflow, scrolledToBottom } = useIsOverflow(ref);

  const clientHeight =
    ref?.current?.clientHeight && ref.current.clientHeight - 110;

  const maxHeight = max ?? clientHeight ?? 150;

  const { scrollYProgress } = useScroll({
    container: ref,
    layoutEffect: false,
  });
  const height = useTransform(scrollYProgress, [0, 1], [maxHeight, 0]);

  return (
    <AnimatePresence>
      {isOverflow && !scrolledToBottom && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={cn(
            'text-primary absolute bottom-0 right-0 flex flex-col items-center',
            className,
          )}
        >
          <span className="mb-6 rotate-90 cursor-vertical-text uppercase text-current">
            scroll
          </span>
          <motion.div
            className="relative mb-4 w-0.5 bg-current"
            style={{ height }}
          />
          <ArrowDown className="relative h-7 w-7 animate-bounce rounded-full border-2 border-current p-1 text-current" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
