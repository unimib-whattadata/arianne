'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

import {
  Dialog as DialogComponent,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Props {
  containerRef: React.RefObject<HTMLDivElement>;
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const Dialog = (props: Props) => {
  const { containerRef, trigger, children, className } = props;
  const [open, setOpen] = useState(false);
  return (
    <DialogComponent open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => e.preventDefault()}
        portalProps={{
          container: containerRef.current,
          className: 'absolute m-3',
        }}
        overlayProps={{
          className: 'absolute',
        }}
        closeComponent={<X className="h-6 w-6 text-red-800" />}
        className={className}
      >
        <DialogHeader>
          <DialogTitle>Istruzioni</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </DialogComponent>
  );
};
