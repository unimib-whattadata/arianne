import { createContext, createRef } from 'react';

export const RootContainerRefContext =
  createContext<React.RefObject<HTMLDivElement>>(createRef());
