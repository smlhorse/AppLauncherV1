import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import type { DivinationType, DivinationRequest, DivinationResponse } from '@applauncher/shared-types';
import { FormField } from '../components/FormField';
import { StrokeInfoView } from '../components/StrokeInfoView';
import { GuaInfoView } from '../components/GuaInfoView';
import { apiService } from '../services/api';

const defaultRequest: DivinationRequest = {
  divination_type: 'personal',
  nameA: '',
  nameB: '',
  person_numberA: '',
  person_numberB: '',
};

export const HomeScreen: React.FC = () => {
  const [tab, setTab] = useState<DivinationType>('personal');
  const [form, setForm] = useState<DivinationRequest>(defaultRequest);
  const [result, setResult] = useState<DivinationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 切換標簽
  const handleTabChange = (type: DivinationType) => {
    setTab(type);
    // 切換標籤時保留使用者填寫的資訊，僅更新占卜類型
    setForm({ ...form, divination_type: type });
    setResult(null);
    setError('');
  };

  // 清除表單資料
  const handleClearForm = () => {
    setForm({ ...defaultRequest, divination_type: tab });
    setError('');
  };

  // 處理表單輸入變更
  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  // 驗證表單
  function validateForm(): string | null {
    if (tab === 'personal') {
      const hasName = form.nameA.trim() || form.nameB.trim();
      const hasNumber = form.person_numberA.trim();
      if (!hasName && !hasNumber) return '請至少輸入姓名或數字';
    } else {
      const hasName = form.nameA.trim() || form.nameB.trim();
      const hasNumber = form.person_numberA.trim() || form.person_numberB.trim();
      if (!hasName && !hasNumber) return '請至少輸入姓名或數字';
    }
    return null;
  }

  // 提交表單
  const handleSubmit = async () => {
    setError('');
    setResult(null);
    
    const validationMsg = validateForm();
    if (validationMsg) {
      setError(validationMsg);
      return;
    }
    
    setLoading(true);
    
    try {
      const res = await apiService.calculate(form);
      setResult(res);
    } catch (err: any) {
      console.error('API 請求失敗:', err);
      const errorMessage = err?.response?.data?.error || 'API 請求失敗';
      setError(errorMessage);
      Alert.alert('錯誤', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.container}>
          <Text style={styles.title}>易經算命程式</Text>
          
          {/* 標籤切換 */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => handleTabChange('personal')}
              style={[
                styles.tabButton,
                tab === 'personal' ? styles.activeTab : styles.inactiveTab
              ]}
            >
              <Text style={[
                styles.tabText,
                tab === 'personal' ? styles.activeTabText : styles.inactiveTabText
              ]}>個人占卜</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => handleTabChange('pair')}
              style={[
                styles.tabButton,
                tab === 'pair' ? styles.activeTab : styles.inactiveTab
              ]}
            >
              <Text style={[
                styles.tabText,
                tab === 'pair' ? styles.activeTabText : styles.inactiveTabText
              ]}>配對占卜</Text>
            </TouchableOpacity>
          </View>

          {/* 表單 */}
          <View style={styles.formContainer}>
            {tab === 'personal' ? (
              <>
                <FormField
                  label="姓"
                  name="nameA"
                  value={form.nameA}
                  onChangeText={(text) => handleChange('nameA', text)}
                />
                <FormField
                  label="名"
                  name="nameB"
                  value={form.nameB}
                  onChangeText={(text) => handleChange('nameB', text)}
                />
                <FormField
                  label="數字"
                  name="person_numberA"
                  value={form.person_numberA}
                  onChangeText={(text) => handleChange('person_numberA', text)}
                />
                <Text style={styles.formHint}>請至少填寫姓名或數字</Text>
              </>
            ) : (
              <>
                <FormField
                  label="姓名A"
                  name="nameA"
                  value={form.nameA}
                  onChangeText={(text) => handleChange('nameA', text)}
                />
                <FormField
                  label="姓名B"
                  name="nameB"
                  value={form.nameB}
                  onChangeText={(text) => handleChange('nameB', text)}
                />
                <FormField
                  label="數字A"
                  name="person_numberA"
                  value={form.person_numberA}
                  onChangeText={(text) => handleChange('person_numberA', text)}
                />
                <FormField
                  label="數字B"
                  name="person_numberB"
                  value={form.person_numberB}
                  onChangeText={(text) => handleChange('person_numberB', text)}
                />
                <Text style={styles.formHint}>請至少填寫姓名或數字</Text>
              </>
            )}

            {/* 按鈕區域 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>開始占卜</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClearForm}
                disabled={loading}
              >
                <Text style={styles.clearButtonText}>清除</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* 錯誤信息 */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          {/* 結果顯示 */}
          {result && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>結果</Text>
              
              {/* 筆劃資訊 */}
              <StrokeInfoView strokeInfo={result.stroke_info} />
              
              {/* 本卦 */}
              <View style={{ marginTop: 16 }}>
                <Text style={styles.guaSectionTitle}>本卦</Text>
                <GuaInfoView gua={result.gua_info.current_gua} type="current" />
              </View>
              
              {/* 變卦 */}
              <View style={{ marginTop: 16 }}>
                <Text style={styles.guaSectionTitle}>變卦</Text>
                <GuaInfoView gua={result.gua_info.changing_gua} type="changing" />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  container: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#e0e7ef',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 4,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#1976d2',
    letterSpacing: 2,
    fontWeight: '700',
    fontSize: 28,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
    justifyContent: 'center',
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 2,
  },
  activeTab: {
    borderColor: '#1976d2',
    backgroundColor: '#e3f2fd',
  },
  inactiveTab: {
    borderColor: '#bdbdbd',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#1976d2',
  },
  inactiveTabText: {
    color: '#333',
  },
  formContainer: {
    marginBottom: 32,
  },
  formHint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    flex: 3,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#1976d2',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e3f2fd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 2,
  },
  clearButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  clearButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  resultContainer: {
    marginTop: 24,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#e0e7ef',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  resultTitle: {
    color: '#1976d2',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  guaSectionTitle: {
    color: '#333',
    marginBottom: 8,
    backgroundColor: '#e3f2fd',
    padding: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: '600',
  },
});
