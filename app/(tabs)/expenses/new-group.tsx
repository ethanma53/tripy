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
import { useRouter } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useGroups } from '@/context/groups-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { ACCENT } from '@/constants/theme';

export default function NewGroupScreen() {
  const router = useRouter();
  const { addGroup } = useGroups();
  const bg = useThemeColor({}, 'background');
  const surface = useThemeColor({}, 'surface');
  const icon = useThemeColor({}, 'icon');

  const [tripName, setTripName] = useState('');
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState<string[]>([]);

  const addMember = () => {
    const name = memberInput.trim();
    if (!name) return;
    if (members.includes(name)) {
      Alert.alert('Duplicate', `${name} is already in the group.`);
      return;
    }
    setMembers((prev) => [...prev, name]);
    setMemberInput('');
  };

  const removeMember = (name: string) => {
    setMembers((prev) => prev.filter((m) => m !== name));
  };

  const handleCreate = () => {
    if (!tripName.trim()) {
      Alert.alert('Missing name', 'Please enter a trip name.');
      return;
    }
    if (members.length < 2) {
      Alert.alert('Need members', 'Add at least 2 members to split expenses.');
      return;
    }
    addGroup(tripName, members);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { backgroundColor: bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input
          label="Trip Name"
          placeholder="e.g. Paris 2025"
          value={tripName}
          onChangeText={setTripName}
          autoFocus
          returnKeyType="next"
        />

        <View style={styles.section}>
          <ThemedText style={styles.label}>Members</ThemedText>
          <View style={styles.memberInput}>
            <Input
              placeholder="Enter name and tap +"
              value={memberInput}
              onChangeText={setMemberInput}
              returnKeyType="done"
              onSubmitEditing={addMember}
              style={styles.nameField}
            />
            <Pressable
              style={[styles.addBtn, { backgroundColor: ACCENT }]}
              onPress={addMember}>
              <IconSymbol name="plus" size={22} color="#fff" />
            </Pressable>
          </View>

          {members.length > 0 && (
            <View style={styles.memberList}>
              {members.map((name) => (
                <View key={name} style={[styles.memberChip, { backgroundColor: surface }]}>
                  <Avatar name={name} size={32} />
                  <ThemedText style={styles.memberName}>{name}</ThemedText>
                  <Pressable onPress={() => removeMember(name)} hitSlop={8}>
                    <IconSymbol name="xmark" size={16} color={icon} />
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>

        <Button label="Create Trip" onPress={handleCreate} fullWidth />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: 20, gap: 24 },
  section: { gap: 10 },
  label: { fontSize: 14, fontWeight: '600', opacity: 0.7 },
  memberInput: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  nameField: { flex: 1 },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberList: { gap: 8 },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  memberName: { flex: 1, fontSize: 15, fontWeight: '500' },
});
