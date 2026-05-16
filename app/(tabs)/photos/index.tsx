import { SafeAreaView, StyleSheet } from 'react-native';
import { EmptyState } from '@/components/ui/empty-state';

export default function PhotosScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <EmptyState
        icon="camera.fill"
        title="Photos Coming Soon"
        subtitle="Share photos with your group in a shared gallery."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
