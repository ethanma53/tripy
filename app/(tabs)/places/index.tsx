import { SafeAreaView, StyleSheet } from 'react-native';
import { EmptyState } from '@/components/ui/empty-state';

export default function PlacesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        icon="mappin"
        title="Places Coming Soon"
        subtitle="Log, review, and take notes on places you visit during your trip."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
