import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { BalanceEntry } from '@/types';
import { formatCurrency } from '@/utils/currency';

interface BalanceSummaryProps {
  balances: BalanceEntry[];
}

export function BalanceSummary({ balances }: BalanceSummaryProps) {
  const icon = useThemeColor({}, 'icon');

  if (balances.length === 0) {
    return (
      <Card style={styles.settled}>
        <ThemedText style={styles.settledText}>All settled up!</ThemedText>
      </Card>
    );
  }

  return (
    <View style={styles.list}>
      {balances.map((entry, i) => (
        <Card key={i} style={styles.entry}>
          <View style={styles.row}>
            <Avatar name={entry.fromName} size={36} />
            <View style={styles.middle}>
              <ThemedText style={styles.name}>{entry.fromName}</ThemedText>
              <ThemedText style={styles.owes}>owes</ThemedText>
              <ThemedText style={styles.name}>{entry.toName}</ThemedText>
            </View>
            <IconSymbol name="chevron.right" size={16} color={icon} style={styles.arrow} />
            <View style={styles.right}>
              <Avatar name={entry.toName} size={36} />
              <ThemedText style={styles.amount}>{formatCurrency(entry.amount)}</ThemedText>
            </View>
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 10 },
  entry: { padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  middle: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' },
  name: { fontSize: 14, fontWeight: '600' },
  owes: { fontSize: 13, opacity: 0.5 },
  arrow: { marginHorizontal: 2 },
  right: { alignItems: 'center', gap: 4 },
  amount: { fontSize: 14, fontWeight: '700', color: '#ef4444' },
  settled: { alignItems: 'center', padding: 20 },
  settledText: { fontSize: 16, fontWeight: '600', opacity: 0.6 },
});
