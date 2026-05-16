import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '@/types';

const EXPENSES_KEY = '@tripy/expenses';

export async function loadExpenses(): Promise<Expense[]> {
  const raw = await AsyncStorage.getItem(EXPENSES_KEY);
  return raw ? (JSON.parse(raw) as Expense[]) : [];
}

export async function saveExpenses(expenses: Expense[]): Promise<void> {
  await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}
