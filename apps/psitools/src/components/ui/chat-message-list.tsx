import { ArrowDown } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useAutoScroll } from '@/hooks/useAutoScroll';

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  smooth?: boolean;
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, children, smooth = false, ...props }, _ref) => {
    const { scrollRef, isAtBottom, scrollToBottom, disableAutoScroll } =
      useAutoScroll({
        smooth,
        content: children,
      });

    return (
      <div className="relative h-full w-full">
        <div
          className={`flex h-full w-full flex-col overflow-y-auto p-4 ${className}`}
          ref={scrollRef}
          onWheel={disableAutoScroll}
          onTouchMove={disableAutoScroll}
          {...props}
        >
          <div className="flex flex-col gap-6">{children}</div>
        </div>

        {!isAtBottom && (
          <Button
            onClick={() => {
              scrollToBottom();
            }}
            size="icon"
            variant="outline"
            className="absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 transform rounded-full shadow-md"
            aria-label="Scroll to bottom"
          >
            <ArrowDown className="size-4" />
          </Button>
        )}
      </div>
    );
  },
);

ChatMessageList.displayName = 'ChatMessageList';

export { ChatMessageList };
