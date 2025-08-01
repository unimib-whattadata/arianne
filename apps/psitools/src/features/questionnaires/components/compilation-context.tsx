import { createContext, useContext } from 'react';

interface NewCompilationContextType {
  therapistName?: string;
  therapistLastname?: string;
}

const NewCompilationContext = createContext<NewCompilationContextType>({});

export const NewCompilationProvider = ({
  children,
  therapistName,
  therapistLastname,
}: {
  children: React.ReactNode;
  therapistName?: string;
  therapistLastname?: string;
}) => {
  return (
    <NewCompilationContext.Provider
      value={{ therapistName, therapistLastname }}
    >
      {children}
    </NewCompilationContext.Provider>
  );
};

export const useNewCompilationContext = () => useContext(NewCompilationContext);
