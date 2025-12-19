"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface BalanceVisibilityContextType {
  isBalanceHidden: boolean;
  toggleBalanceVisibility: () => void;
  maskAmount: (amount: string) => string;
}

const BalanceVisibilityContext = createContext<BalanceVisibilityContextType | undefined>(undefined);

export function BalanceVisibilityProvider({ children }: { children: ReactNode }) {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const toggleBalanceVisibility = useCallback(() => {
    setIsBalanceHidden(prev => !prev);
  }, []);

  const maskAmount = useCallback((amount: string) => {
    if (!isBalanceHidden) return amount;
    return "₵••••••";
  }, [isBalanceHidden]);

  return (
    <BalanceVisibilityContext.Provider value={{ isBalanceHidden, toggleBalanceVisibility, maskAmount }}>
      {children}
    </BalanceVisibilityContext.Provider>
  );
}

export function useBalanceVisibility() {
  const context = useContext(BalanceVisibilityContext);
  if (context === undefined) {
    throw new Error("useBalanceVisibility must be used within a BalanceVisibilityProvider");
  }
  return context;
}
