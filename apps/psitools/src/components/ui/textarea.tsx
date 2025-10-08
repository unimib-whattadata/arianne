'use client';

import 'quill/dist/quill.snow.css';

import * as React from 'react';
import { useQuill } from 'react-quilljs';

import { cn } from '@/utils/cn';

export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange'
> & {
  onChange?: (e: { target: { value: string } }) => void;
  value?: string;
};

const Textarea = React.forwardRef<HTMLDivElement, TextareaProps>(
  ({ className, onChange, value, placeholder, disabled, ...props }, ref) => {
    const [isMounted, setIsMounted] = React.useState(false);

    console.log({ value });

    const { quill, quillRef } = useQuill({
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ color: [] }, { background: [] }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
        clipboard: {},
      },
      placeholder: placeholder || 'Scrivi qui il tuo testo',
    });

    React.useEffect(() => {
      setIsMounted(true);
    }, []);

    React.useEffect(() => {
      if (quill && value !== undefined) {
        const currentContent = quill.root.innerHTML;

        if (value !== currentContent) {
          quill.clipboard.dangerouslyPasteHTML(value);
        }
      }
    }, [quill, value]);

    React.useEffect(() => {
      if (quill) {
        quill.on('text-change', () => {
          if (onChange) {
            const value = quill.root.innerHTML;
            if (value === '<p><br></p>') {
              onChange({ target: { value: '' } });
              return;
            }
            // If the content is different, update the state
            onChange({ target: { value: quill.root.innerHTML } });
          }
        });
      }
    }, [quill, onChange]);

    React.useEffect(() => {
      if (quill) {
        quill.enable(!disabled);
      }
    }, [quill, disabled]);

    if (!isMounted) {
      return (
        <div
          className={cn(
            'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border bg-transparent text-base focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            className,
          )}
        />
      );
    }

    return (
      <div
        className={cn(
          'border-input placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border bg-transparent text-base focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
      >
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="h-full w-full"
        >
          <div
            ref={quillRef}
            className="w-full"
            {...(props as React.HTMLAttributes<HTMLDivElement>)}
          />
        </div>

        <style jsx global>{`
          .ql-container {
            border: none !important;
            font-size: inherit;
            height: 100%;
            font-family: inherit;
          }

          .ql-toolbar {
            border: none !important;
          }

          .ql-editor {
            min-height: 4rem;
            overflow-y: auto;
            padding-block-start: 0;
          }

          .ql-container.ql-focus {
            border: none !important;
          }

          .ql-snow.ql-toolbar button:hover,
          .ql-snow .ql-toolbar button:hover,
          .ql-snow.ql-toolbar button:focus,
          .ql-snow .ql-toolbar button:focus,
          .ql-snow.ql-toolbar button.ql-active,
          .ql-snow .ql-toolbar button.ql-active,
          .ql-snow.ql-toolbar .ql-picker-label:hover,
          .ql-snow .ql-toolbar .ql-picker-label:hover,
          .ql-snow.ql-toolbar .ql-picker-label.ql-active,
          .ql-snow .ql-toolbar .ql-picker-label.ql-active,
          .ql-snow.ql-toolbar .ql-picker-item:hover,
          .ql-snow .ql-toolbar .ql-picker-item:hover,
          .ql-snow.ql-toolbar .ql-picker-item.ql-selected,
          .ql-snow .ql-toolbar .ql-picker-item.ql-selected {
            color: hsl(var(--primary));
          }

          .ql-snow.ql-toolbar button:hover .ql-stroke,
          .ql-snow .ql-toolbar button:hover .ql-stroke,
          .ql-snow.ql-toolbar button:focus .ql-stroke,
          .ql-snow .ql-toolbar button:focus .ql-stroke,
          .ql-snow.ql-toolbar button.ql-active .ql-stroke,
          .ql-snow .ql-toolbar button.ql-active .ql-stroke,
          .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
          .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
          .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
          .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
          .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
          .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
          .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
          .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
          .ql-snow.ql-toolbar button:hover .ql-stroke-miter,
          .ql-snow .ql-toolbar button:hover .ql-stroke-miter,
          .ql-snow.ql-toolbar button:focus .ql-stroke-miter,
          .ql-snow .ql-toolbar button:focus .ql-stroke-miter,
          .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
          .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,
          .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
          .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
          .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
          .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
          .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
          .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
          .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
          .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
            stroke: hsl(var(--primary));
          }

          .ql-editor.ql-blank::before {
            font-style: normal;
          }
        `}</style>
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';

export { Textarea };
