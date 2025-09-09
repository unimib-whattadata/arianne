'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown, icons } from 'lucide-react';
import * as React from 'react';
import type { ClassNameValue } from 'tailwind-merge';

import { cn } from '@/utils/cn';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b', className)}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
    icon?: keyof typeof icons;
    iconClassName?: ClassNameValue;
    iconPosition?: 'left' | 'right' | 'none';
  }
>(
  (
    {
      className,
      children,
      icon,
      iconClassName,
      iconPosition = 'right',
      ...props
    },
    ref,
  ) => {
    // const Icon = icon ? icons[icon] : <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />;

    const IconComp = () => {
      let renderIcon = <></>;
      if (icon) {
        const Icon = icons[icon];
        renderIcon = (
          <Icon
            className={cn(
              'h-4 w-4 shrink-0 transition-transform duration-200',
              iconClassName,
            )}
          />
        );
      } else {
        renderIcon = (
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 transition-transform duration-200',
              iconClassName,
            )}
          />
        );
      }

      return renderIcon;
    };

    return (
      <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
          ref={ref}
          className={cn(
            'flex flex-1 items-center py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
            iconPosition === 'right' && 'justify-between',
            className,
          )}
          {...props}
        >
          {iconPosition === 'left' && <IconComp />}
          {children}
          {iconPosition === 'right' && <IconComp />}
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    );
  },
);
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));

AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
