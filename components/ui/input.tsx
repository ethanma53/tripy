import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, style, ...props }: InputProps) {
  const text = useThemeColor({}, 'text');
  const bg = useThemeColor({}, 'background');
  const icon = useThemeColor({}, 'icon');
  const tint = useThemeColor({}, 'tint');

  return (
    <View style={styles.wrapper}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}
      <TextInput
        placeholderTextColor={icon}
        style={[
          styles.input,
          {
            color: text,
            backgroundColor: bg,
            borderColor: error ? '#ef4444' : icon + '44',
          },
          style,
        ]}
        selectionColor={tint}
        {...props}
      />
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    color: '#ef4444',
  },
});
