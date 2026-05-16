import AsyncStorage from '@react-native-async-storage/async-storage';
import { Group } from '@/types';

const GROUPS_KEY = '@tripy/groups';

export async function loadGroups(): Promise<Group[]> {
  const raw = await AsyncStorage.getItem(GROUPS_KEY);
  return raw ? (JSON.parse(raw) as Group[]) : [];
}

export async function saveGroups(groups: Group[]): Promise<void> {
  await AsyncStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}
