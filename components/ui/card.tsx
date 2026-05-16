import { StyleSheet, View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface CardProps extends ViewProps {
  padded?: boolean;
}

export function Card({ style, padded = true, children, ...props }: CardProps) {
  const bg = useThemeColor({}, 'background');
  const border = useThemeColor({ light: '#e5e7eb', dark: '#2a2d2e' }, 'icon');

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: bg, borderColor: border },
        padded && styles.padded,
        style,
      ]}
      {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  padded: {
    padding: 16,
  },
});
