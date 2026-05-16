import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGroups } from '@/context/groups-context';
import { useExpenses } from '@/context/expenses-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ACCENT } from '@/constants/theme';
import { Split, SplitType } from '@/types';
import { formatCurrency } from '@/utils/currency';

export default function AddExpenseScreen() {
  const { groupId } = useLocalSearchParams<{ groupId: string }>();
  const router = useRouter();
  const { getGroup } = useGroups();
  const { addExpense } = useExpenses();

  const bg = useThemeColor({}, 'background');
  const border = useThemeColor({ light: '#e5e7eb', dark: '#2a2d2e' }, 'icon');
  const icon = useThemeColor({}, 'icon');

  const group = getGroup(groupId);

  const [title, setTitle] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [paidById, setPaidById] = useState(group?.members[0]?.id ?? '');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});

  if (!group) return null;

  const amount = parseFloat(amountStr) || 0;

  const customSplits: Split[] = group.members.map((m) => ({
    memberId: m.id,
    amount: parseFloat(customAmounts[m.id] ?? '0') || 0,
  }));
  const customTotal = customSplits.reduce((s, sp) => s + sp.amount, 0);
  const customRemaining = Math.round((amount - customTotal) * 100) / 100;

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter a description.');
      return;
    }
    if (amount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid amount.');
      return;
    }
    if (splitType === 'custom') {
      if (Math.abs(customRemaining) > 0.01) {
        Alert.alert(
          'Split mismatch',
          `Amounts must add up to ${formatCurrency(amount)}. ${customRemaining > 0 ? formatCurrency(customRemaining) + ' unallocated.' : formatCurrency(Math.abs(customRemaining)) + ' over-allocated.'}`
        );
        return;
      }
    }

    addExpense({
      groupId,
      title,
      amount,
      paidById,
      splitType,
      memberIds: group.members.map((m) => m.id),
      customSplits: splitType === 'custom' ? customSplits : undefined,
    });
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input
          label="Description"
          placeholder="e.g. Dinner at La Mer"
          value={title}
          onChangeText={setTitle}
          autoFocus
          returnKeyType="next"
        />

        <Input
          label="Amount"
          placeholder="0.00"
          value={amountStr}
          onChangeText={setAmountStr}
          keyboardType="decimal-pad"
          returnKeyType="done"
        />

        {/* Paid by */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>Paid by</ThemedText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberScroll}>
            <View style={styles.memberRow}>
              {group.members.map((m) => {
                const selected = paidById === m.id;
                return (
                  <Pressable
                    key={m.id}
                    style={[
                      styles.memberChip,
                      { borderColor: selected ? ACCENT : border },
                      selected && { backgroundColor: ACCENT + '15' },
                    ]}
                    onPress={() => setPaidById(m.id)}>
                    <Avatar name={m.name} size={28} />
                    <ThemedText
                      style={[styles.chipLabel, selected && { color: ACCENT, fontWeight: '700' }]}>
                      {m.name}
                    </ThemedText>
                    {selected && (
                      <IconSymbol name="checkmark" size={14} color={ACCENT} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* Split type */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionLabel}>Split</ThemedText>
          <View style={styles.splitToggle}>
            {(['equal', 'custom'] as SplitType[]).map((type) => {
              const selected = splitType === type;
              return (
                <Pressable
                  key={type}
                  style={[
                    styles.splitBtn,
                    { borderColor: selected ? ACCENT : border },
                    selected && { backgroundColor: ACCENT },
                  ]}
                  onPress={() => setSplitType(type)}>
                  <IconSymbol
                    name={type === 'equal' ? 'equal.circle.fill' : 'slider.horizontal.3'}
                    size={16}
                    color={selected ? '#fff' : icon}
                  />
                  <ThemedText
                    style={[styles.splitBtnLabel, selected && { color: '#fff', fontWeight: '700' }]}>
                    {type === 'equal' ? 'Equal' : 'Custom'}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Custom split editor */}
        {splitType === 'custom' && (
          <View style={styles.section}>
            <View style={styles.customHeader}>
              <ThemedText style={styles.sectionLabel}>Amounts</ThemedText>
              <ThemedText
                style={[
                  styles.remaining,
                  { color: Math.abs(customRemaining) < 0.01 ? '#10b981' : '#ef4444' },
                ]}>
                {Math.abs(customRemaining) < 0.01
                  ? 'Balanced'
                  : customRemaining > 0
                    ? `${formatCurrency(customRemaining)} left`
                    : `${formatCurrency(Math.abs(customRemaining))} over`}
              </ThemedText>
            </View>
            {group.members.map((m) => (
              <View key={m.id} style={styles.customRow}>
                <Avatar name={m.name} size={32} />
                <ThemedText style={styles.customName}>{m.name}</ThemedText>
                <Input
                  placeholder="0.00"
                  value={customAmounts[m.id] ?? ''}
                  onChangeText={(val) =>
                    setCustomAmounts((prev) => ({ ...prev, [m.id]: val }))
                  }
                  keyboardType="decimal-pad"
                  style={styles.customInput}
                />
              </View>
            ))}
          </View>
        )}

        <Button label="Add Expense" onPress={handleSave} fullWidth />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, gap: 24 },
  section: { gap: 10 },
  sectionLabel: { fontSize: 14, fontWeight: '600', opacity: 0.7 },
  memberScroll: { marginHorizontal: -4 },
  memberRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 4, paddingVertical: 2 },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  chipLabel: { fontSize: 14 },
  splitToggle: { flexDirection: 'row', gap: 10 },
  splitBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  splitBtnLabel: { fontSize: 15 },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remaining: { fontSize: 13, fontWeight: '600' },
  customRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  customName: { flex: 1, fontSize: 15 },
  customInput: { width: 100 },
});
