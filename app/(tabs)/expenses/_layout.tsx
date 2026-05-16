import { Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function ExpensesLayout() {
  const bg = useThemeColor({}, 'background');
  const text = useThemeColor({}, 'text');

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: bg },
        headerTintColor: text,
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="index" options={{ title: 'My Trips' }} />
      <Stack.Screen name="new-group" options={{ title: 'New Trip', presentation: 'modal' }} />
      <Stack.Screen name="[groupId]/index" options={{ title: '' }} />
      <Stack.Screen
        name="[groupId]/add-expense"
        options={{ title: 'Add Expense', presentation: 'modal' }}
      />
    </Stack>
  );
}
