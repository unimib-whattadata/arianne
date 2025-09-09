'use client';

import React, { createContext, useContext, useState } from 'react';

interface ExportContextType {
  exportMode: boolean;
  toggleExportMode: () => void;

  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;

  isAllSelected: Map<
    string,
    { isAllSelected: boolean; selectAll: (event: unknown) => void }
  >;
  setIsAllSelected: React.Dispatch<
    React.SetStateAction<
      Map<
        string,
        { isAllSelected: boolean; selectAll: (event: unknown) => void }
      >
    >
  >;
  selectAllGlobally: (select: boolean, event: unknown) => void;
}

const ExportContext = createContext<ExportContextType>({} as ExportContextType);

export const ExportProvider = ({ children }: { children: React.ReactNode }) => {
  const [exportMode, setExportMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(
    new Map<
      string,
      { isAllSelected: boolean; selectAll: (event: unknown) => void }
    >(),
  );

  const toggleExportMode = () => {
    setExportMode((prev) => !prev);
  };

  const selectAllGlobally = (select: boolean, event: unknown) => {
    isAllSelected.forEach((value) => {
      if (value.isAllSelected !== select) {
        value.selectAll(event);
      }
    });
  };

  return (
    <ExportContext.Provider
      value={{
        exportMode,
        toggleExportMode,

        selectedIds,
        setSelectedIds,

        isAllSelected,
        setIsAllSelected,

        selectAllGlobally,
      }}
    >
      {children}
    </ExportContext.Provider>
  );
};

export const useExport = () => {
  const context = useContext(ExportContext);
  if (!context) {
    throw new Error('useExport must be used within ExportProvider');
  }
  return context;
};
