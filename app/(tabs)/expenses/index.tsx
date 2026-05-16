import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { GroupCard } from '@/components/expenses/group-card';
import { EmptyState } from '@/components/ui/empty-state';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGroups } from '@/context/groups-context';
import { useExpenses } from '@/context/expenses-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ACCENT } from '@/constants/theme';

export default function ExpensesScreen() {
  const router = useRouter();
  const { groups } = useGroups();
  const { getGroupExpenses } = useExpenses();
  const bg = useThemeColor({}, 'background');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['bottom']}>
      {groups.length === 0 ? (
        <EmptyState
          icon="wallet.pass.fill"
          title="No trips yet"
          subtitle="Create a trip to start splitting expenses with your group."
        />
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {groups.map((group) => {
            const expenses = getGroupExpenses(group.id);
            const total = expenses.reduce((sum, e) => sum + e.amount, 0);
            return (
              <GroupCard
                key={group.id}
                group={group}
                totalSpent={total}
                onPress={() => router.push(`/(tabs)/expenses/${group.id}`)}
              />
            );
          })}
        </ScrollView>
      )}

      {/* FAB */}
      <Pressable
        style={[styles.fab, { backgroundColor: ACCENT }]}
        onPress={() => router.push('/(tabs)/expenses/new-group')}>
        <IconSymbol name="plus" size={28} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: 16, paddingBottom: 100 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
});
