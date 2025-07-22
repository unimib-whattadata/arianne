import { createContext, useContext } from 'react';

interface NewCompilationContextType {
  therapistName?: string;
  therapistLastName?: string;
}

const NewCompilationContext = createContext<NewCompilationContextType>({});

export const NewCompilationProvider = ({
  children,
  therapistName,
  therapistLastName,
}: {
  children: React.ReactNode;
  therapistName?: string;
  therapistLastName?: string;
}) => {
  return (
    <NewCompilationContext.Provider
      value={{ therapistName, therapistLastName }}
    >
      {children}
    </NewCompilationContext.Provider>
  );
};

export const useNewCompilationContext = () => useContext(NewCompilationContext);
