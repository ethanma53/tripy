import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Expense, Split, SplitType } from '@/types';
import { loadExpenses, saveExpenses } from '@/storage/expenses';
import { generateId } from '@/utils/id';
import { computeEqualSplits } from '@/utils/balance';

// ── State ──────────────────────────────────────────────────────────────────

interface ExpensesState {
  expenses: Expense[];
  loaded: boolean;
}

// ── Actions ────────────────────────────────────────────────────────────────

type AddExpensePayload = {
  groupId: string;
  title: string;
  amount: number;
  paidById: string;
  splitType: SplitType;
  memberIds: string[];
  customSplits?: Split[];
};

type ExpensesAction =
  | { type: 'LOAD'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: AddExpensePayload }
  | { type: 'DELETE_EXPENSE'; payload: { expenseId: string } }
  | { type: 'DELETE_GROUP_EXPENSES'; payload: { groupId: string } };

function expensesReducer(state: ExpensesState, action: ExpensesAction): ExpensesState {
  switch (action.type) {
    case 'LOAD':
      return { expenses: action.payload, loaded: true };

    case 'ADD_EXPENSE': {
      const { groupId, title, amount, paidById, splitType, memberIds, customSplits } =
        action.payload;
      const splits: Split[] =
        splitType === 'equal' ? computeEqualSplits(amount, memberIds) : (customSplits ?? []);

      const newExpense: Expense = {
        id: generateId(),
        groupId,
        title: title.trim(),
        amount,
        paidById,
        splitType,
        splits,
        createdAt: new Date().toISOString(),
      };
      return { ...state, expenses: [newExpense, ...state.expenses] };
    }

    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter((e) => e.id !== action.payload.expenseId),
      };

    case 'DELETE_GROUP_EXPENSES':
      return {
        ...state,
        expenses: state.expenses.filter((e) => e.groupId !== action.payload.groupId),
      };

    default:
      return state;
  }
}

// ── Context ────────────────────────────────────────────────────────────────

interface ExpensesContextValue {
  expenses: Expense[];
  loaded: boolean;
  addExpense: (payload: AddExpensePayload) => void;
  deleteExpense: (expenseId: string) => void;
  deleteGroupExpenses: (groupId: string) => void;
  getGroupExpenses: (groupId: string) => Expense[];
}

const ExpensesContext = createContext<ExpensesContextValue | null>(null);

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(expensesReducer, { expenses: [], loaded: false });

  useEffect(() => {
    loadExpenses().then((expenses) => dispatch({ type: 'LOAD', payload: expenses }));
  }, []);

  useEffect(() => {
    if (state.loaded) {
      saveExpenses(state.expenses);
    }
  }, [state.expenses, state.loaded]);

  const value: ExpensesContextValue = {
    expenses: state.expenses,
    loaded: state.loaded,
    addExpense: (payload) => dispatch({ type: 'ADD_EXPENSE', payload }),
    deleteExpense: (expenseId) => dispatch({ type: 'DELETE_EXPENSE', payload: { expenseId } }),
    deleteGroupExpenses: (groupId) =>
      dispatch({ type: 'DELETE_GROUP_EXPENSES', payload: { groupId } }),
    getGroupExpenses: (groupId) => state.expenses.filter((e) => e.groupId === groupId),
  };

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
}

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error('useExpenses must be used within ExpensesProvider');
  return ctx;
}
