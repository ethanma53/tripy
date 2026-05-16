import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Avatar } from '@/components/ui/avatar';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ACCENT } from '@/constants/theme';
import { Expense, Member } from '@/types';
import { formatCurrency } from '@/utils/currency';

interface ExpenseItemProps {
  expense: Expense;
  members: Member[];
  onLongPress?: () => void;
}

export function ExpenseItem({ expense, members, onLongPress }: ExpenseItemProps) {
  const border = useThemeColor({ light: '#e5e7eb', dark: '#2a2d2e' }, 'icon');
  const payer = members.find((m) => m.id === expense.paidById);

  const date = new Date(expense.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <Pressable
      onLongPress={onLongPress}
      style={({ pressed }) => [styles.container, { borderBottomColor: border }, pressed && styles.pressed]}>
      <View style={styles.left}>
        {payer && <Avatar name={payer.name} size={40} />}
        <View style={styles.info}>
          <ThemedText style={styles.title}>{expense.title}</ThemedText>
          <ThemedText style={styles.meta}>
            Paid by {payer?.name ?? 'Unknown'} · {date}
          </ThemedText>
        </View>
      </View>
      <ThemedText style={[styles.amount, { color: ACCENT }]}>
        {formatCurrency(expense.amount)}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  pressed: { opacity: 0.7 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  info: { gap: 3, flex: 1 },
  title: { fontSize: 15, fontWeight: '600' },
  meta: { fontSize: 12, opacity: 0.55 },
  amount: { fontSize: 16, fontWeight: '700' },
});
