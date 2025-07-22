import type { RefObject } from 'react';
import { useLayoutEffect, useState } from 'react';

export const useIsOverflow = (
  ref: RefObject<HTMLElement>,
  callback?: (arg: boolean) => unknown,
) => {
  const [isOverflow, setIsOverflow] = useState<boolean | undefined>(undefined);
  const [scrolledToBottom, setScrolledToBottom] = useState<boolean>(false);

  useLayoutEffect(() => {
    const { current } = ref;
    if (!current) return;

    const trigger = () => {
      const hasOverflow = current.scrollHeight > current.clientHeight;

      setIsOverflow(hasOverflow);

      if (callback) callback(hasOverflow);
    };

    if ('ResizeObserver' in window) {
      new ResizeObserver(trigger).observe(current);
    }

    current.onscroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = current;
      const scrolledToBottom = scrollTop + clientHeight >= scrollHeight;

      setScrolledToBottom(scrolledToBottom);
    };

    trigger();
  }, [callback, ref]);

  return { isOverflow, scrolledToBottom };
};
