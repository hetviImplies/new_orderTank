import { createContext, useCallback, useRef, useState } from 'react';

const ConditionContext = createContext();

const ConditionProvider = ({ children }) => {
  const [condition, setCondition] = useState(false);
  let floatRef = useRef(null)
  return (
    <ConditionContext.Provider value={{ condition, setCondition, floatRef }}>
      {children}
    </ConditionContext.Provider>
  );
};

export { ConditionProvider, ConditionContext };