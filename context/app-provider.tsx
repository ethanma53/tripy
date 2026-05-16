import React from 'react';
import { GroupsProvider } from './groups-context';
import { ExpensesProvider } from './expenses-context';

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <GroupsProvider>
      <ExpensesProvider>{children}</ExpensesProvider>
    </GroupsProvider>
  );
}
