import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Group } from '@/types';
import { formatCurrency } from '@/utils/currency';

interface GroupCardProps {
  group: Group;
  totalSpent: number;
  onPress: () => void;
}

export function GroupCard({ group, totalSpent, onPress }: GroupCardProps) {
  const icon = useThemeColor({}, 'icon');

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.info}>
            <ThemedText style={styles.name}>{group.name}</ThemedText>
            <ThemedText style={styles.meta}>
              {group.members.length} member{group.members.length !== 1 ? 's' : ''} ·{' '}
              {formatCurrency(totalSpent)} total
            </ThemedText>
            <View style={styles.avatarRow}>
              {group.members.slice(0, 5).map((m, i) => (
                <View key={m.id} style={[styles.avatarWrap, { marginLeft: i === 0 ? 0 : -8 }]}>
                  <Avatar name={m.name} size={28} />
                </View>
              ))}
              {group.members.length > 5 && (
                <ThemedText style={[styles.meta, { marginLeft: 4 }]}>
                  +{group.members.length - 5}
                </ThemedText>
              )}
            </View>
          </View>
          <IconSymbol name="chevron.right" size={20} color={icon} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  pressed: { opacity: 0.8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: { gap: 6, flex: 1 },
  name: { fontSize: 17, fontWeight: '700' },
  meta: { fontSize: 13, opacity: 0.55 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  avatarWrap: { borderRadius: 15.5, borderWidth: 1.5, borderColor: '#fff' },
});
