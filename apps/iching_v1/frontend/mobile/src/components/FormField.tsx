import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  onChangeText,
  placeholder
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <View style={styles.labelIndicator} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  labelIndicator: {
    width: 4,
    height: 16,
    backgroundColor: '#1976d2',
    marginRight: 6,
    borderRadius: 2,
  },
  label: {
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdbdbd',
    fontSize: 16,
  },
});
