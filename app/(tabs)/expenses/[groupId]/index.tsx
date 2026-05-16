import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ExpenseItem } from '@/components/expenses/expense-item';
import { BalanceSummary } from '@/components/expenses/balance-summary';
import { Avatar } from '@/components/ui/avatar';
import { EmptyState } from '@/components/ui/empty-state';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGroups } from '@/context/groups-context';
import { useExpenses } from '@/context/expenses-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ACCENT } from '@/constants/theme';
import { computeBalances } from '@/utils/balance';
import { formatCurrency } from '@/utils/currency';

type Tab = 'expenses' | 'balances';

export default function GroupDetailScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const router = useRouter();
  const navigation = useNavigation();
  const { getGroup } = useGroups();
  const { getGroupExpenses, deleteExpense } = useExpenses();
  const bg = useThemeColor({}, 'background');
  const border = useThemeColor({ light: '#e5e7eb', dark: '#2a2d2e' }, 'icon');

  const [activeTab, setActiveTab] = useState<Tab>('expenses');

  const group = getGroup(groupId);
  const expenses = getGroupExpenses(groupId);
  const balances = group ? computeBalances(group.members, expenses) : [];
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  useEffect(() => {
    if (group) {
      navigation.setOptions({ title: group.name });
    }
  }, [group, navigation]);

  if (!group) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
        <EmptyState icon="xmark" title="Trip not found" />
      </SafeAreaView>
    );
  }

  const handleDeleteExpense = (expenseId: string, title: string) => {
    Alert.alert('Delete expense?', `Remove "${title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteExpense(expenseId) },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['bottom']}>
      {/* Summary header */}
      <View style={[styles.header, { borderBottomColor: border }]}>
        <View style={styles.avatarRow}>
          {group.members.slice(0, 6).map((m, i) => (
            <View key={m.id} style={[styles.avatarWrap, { marginLeft: i === 0 ? 0 : -10 }]}>
              <Avatar name={m.name} size={34} />
            </View>
          ))}
        </View>
        <ThemedText style={styles.totalLabel}>Total spent</ThemedText>
        <ThemedText style={[styles.totalAmount, { color: ACCENT }]}>
          {formatCurrency(total)}
        </ThemedText>
      </View>

      {/* Tab bar */}
      <View style={[styles.tabBar, { borderBottomColor: border }]}>
        {(['expenses', 'balances'] as Tab[]).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && { borderBottomColor: ACCENT, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab)}>
            <ThemedText
              style={[styles.tabLabel, activeTab === tab && { color: ACCENT, fontWeight: '700' }]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {/* Content */}
      {activeTab === 'expenses' ? (
        expenses.length === 0 ? (
          <EmptyState
            icon="dollarsign.circle.fill"
            title="No expenses yet"
            subtitle="Tap + to add the first expense."
          />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} style={styles.flex}>
            {expenses.map((expense) => (
              <ExpenseItem
                key={expense.id}
                expense={expense}
                members={group.members}
                onLongPress={() => handleDeleteExpense(expense.id, expense.title)}
              />
            ))}
          </ScrollView>
        )
      ) : (
        <ScrollView contentContainerStyle={styles.balancesContent} showsVerticalScrollIndicator={false}>
          <BalanceSummary balances={balances} />
        </ScrollView>
      )}

      {/* FAB */}
      <Pressable
        style={[styles.fab, { backgroundColor: ACCENT }]}
        onPress={() => router.push(`/(tabs)/expenses/${groupId}/add-expense`)}>
        <IconSymbol name="plus" size={28} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 6,
    borderBottomWidth: 1,
  },
  avatarRow: { flexDirection: 'row', marginBottom: 4 },
  avatarWrap: { borderRadius: 19, borderWidth: 2, borderColor: '#fff' },
  totalLabel: { fontSize: 13, opacity: 0.5 },
  totalAmount: { fontSize: 28, fontWeight: '800', lineHeight: 36 },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabLabel: { fontSize: 15, fontWeight: '500', opacity: 0.6 },
  balancesContent: { padding: 16, paddingBottom: 100 },
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
