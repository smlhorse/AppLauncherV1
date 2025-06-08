import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { DivinationResponse } from '@applauncher/shared-types';

interface StrokeInfoViewProps {
  strokeInfo: DivinationResponse['stroke_info'];
}

export const StrokeInfoView: React.FC<StrokeInfoViewProps> = ({ strokeInfo }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>筆劃資訊</Text>
      <View style={styles.strokesContainer}>
        {/* A 部分 */}
        <View style={styles.strokeCard}>
          <Text style={styles.nameLabel}>A: {strokeInfo.A.name}</Text>
          <View style={styles.charactersContainer}>
            {strokeInfo.A.stroke.map((s, i) => (
              <View key={i} style={styles.characterBadge}>
                <Text style={styles.characterText}>{s.character}</Text>
                <Text style={styles.strokeCount}>({s.stroke})</Text>
              </View>
            ))}
          </View>
        </View>
        
        {/* B 部分 */}
        <View style={styles.strokeCard}>
          <Text style={styles.nameLabel}>B: {strokeInfo.B.name}</Text>
          <View style={styles.charactersContainer}>
            {strokeInfo.B.stroke.map((s, i) => (
              <View key={i} style={styles.characterBadge}>
                <Text style={styles.characterText}>{s.character}</Text>
                <Text style={styles.strokeCount}>({s.stroke})</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e7ef',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  title: {
    color: '#333',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e7ef',
    paddingBottom: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  strokesContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  strokeCard: {
    padding: 8,
    backgroundColor: '#f0f7ff',
    borderRadius: 6,
  },
  nameLabel: {
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 4,
  },
  charactersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  characterBadge: {
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#e3f2fd',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  characterText: {
    fontSize: 18,
  },
  strokeCount: {
    fontSize: 14,
    color: '#666',
  },
});
