import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GuaInfoProps {
  gua: any;
  type?: 'current' | 'changing';
}

export const GuaInfoView: React.FC<GuaInfoProps> = ({ gua, type = 'current' }) => {
  if (!gua) return <Text style={styles.noData}>無資料</Text>;

  // 根據類型使用不同配色
  const borderColor = type === 'current' ? '#b3e0ff' : '#ffe0b2';
  const headingColor = type === 'current' ? '#1976d2' : '#e65100';
  const backgroundColor = type === 'current' ? '#f0f7ff' : '#fff8e1';

  return (
    <View style={[styles.container, { borderColor }]}>
      <View style={styles.contentRow}>
        {/* 左側卦象 */}
        <View style={styles.guaSymbolContainer}>
          {renderBinary(gua.binary, type)}
        </View>
        
        {/* 右側卦名與資訊 */}
        <View style={styles.infoContainer}>
          <Text style={[styles.guaName, { color: headingColor, borderBottomColor: borderColor }]}>
            {gua.name}
          </Text>
          <View style={styles.gridContainer}>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>上卦：</Text>
              {gua.name_heaven}（{gua.binary_heaven}）
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>下卦：</Text>
              {gua.name_earth}（{gua.binary_earth}）
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>五行：</Text>
              上卦：{gua.natural_heaven}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoLabel}>五行：</Text>
              下卦：{gua.natural_earth}
            </Text>
          </View>
        </View>
      </View>
      
      {/* 解釋部分 */}
      <View style={[styles.descriptionContainer, { borderTopColor: borderColor }]}>
        <Text style={styles.descriptionTitle}>解釋：</Text>
        <Text style={[styles.description, { backgroundColor }]}>
          {gua.description}
        </Text>
      </View>
    </View>
  );
};

// 渲染卦象的二進制表示
function renderBinary(binary: string, type: 'current' | 'changing' = 'current') {
  // 0: 陰爻（虛線），1: 陽爻（實線）
  const yangColor = type === 'current' ? '#1976d2' : '#e65100';
  const yinColor = type === 'current' ? '#666' : '#996600';
  
  // 反轉爻序列，使其從下往上顯示（符合易經傳統順序）
  const reversedBinary = [...binary].reverse();
  
  return (
    <View style={styles.binaryContainer}>
      {reversedBinary.map((b, i) => (
        <View key={i} style={styles.yaoContainer}>
          {b === '1' ? (
            // 陽爻：實線
            <View style={[styles.yangYao, { backgroundColor: yangColor }]} />
          ) : (
            // 陰爻：虛線
            <View style={styles.yinContainer}>
              <View style={[styles.yinYaoLeft, { backgroundColor: yinColor }]} />
              <View style={[styles.yinYaoRight, { backgroundColor: yinColor }]} />
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1.5,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  guaSymbolContainer: {
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  guaName: {
    fontWeight: '600',
    fontSize: 24,
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  gridContainer: {
    gap: 12,
  },
  infoText: {
    color: '#333',
    marginBottom: 4,
  },
  infoLabel: {
    fontWeight: 'bold',
  },
  descriptionContainer: {
    color: '#444',
    marginTop: 16,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  descriptionTitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    padding: 12,
    borderRadius: 4,
  },
  noData: {
    color: '#888',
    fontStyle: 'italic',
  },
  binaryContainer: {
    flexDirection: 'column',
    gap: 2,
    alignItems: 'center',
  },
  yaoContainer: {
    width: 70,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yangYao: {
    height: 6,
    width: '100%',
    borderRadius: 2,
  },
  yinContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  yinYaoLeft: {
    height: 6,
    width: '40%',
    borderRadius: 2,
  },
  yinYaoRight: {
    height: 6,
    width: '40%',
    borderRadius: 2,
  },
});
