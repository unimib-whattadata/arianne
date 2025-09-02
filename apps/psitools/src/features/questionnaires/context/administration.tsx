'use client';

import type { Dispatch } from 'react';
import { createContext, useContext, useReducer } from 'react';

type Action =
  | {
      type: 'set_id';
      payload: {
        id: string;
      };
    }
  | {
      type: 'set_sent';
      payload: {
        sent: boolean;
      };
    }
  | {
      type: 'set_state';
      payload: {
        id: string;
        sent: boolean;
      };
    }
  | {
      type: 'set_submitting';
      payload: {
        isSubmitting: boolean;
      };
    };

interface State {
  id: string;
  sent: boolean;
  isSubmitting: boolean;
}

const initialState: State = {
  id: '',
  sent: false,
  isSubmitting: false,
} satisfies State;

interface Context {
  id: string;
  sent: boolean;
  isSubmitting: boolean;
  dispatch: Dispatch<Action>;
}

const AdministrationContext = createContext({} as Context);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'set_id':
      return { ...state, id: action.payload.id };
    case 'set_sent':
      return { ...state, sent: action.payload.sent };
    case 'set_state':
      return { ...state, ...action.payload };
    case 'set_submitting':
      return { ...state, ...action.payload };
    default:
      throw new Error();
  }
};

export const AdministrationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AdministrationContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AdministrationContext.Provider>
  );
};

export const useAdministrationContext = () => {
  return useContext(AdministrationContext);
};
