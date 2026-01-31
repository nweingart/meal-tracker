import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  step?: number;
}

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  min = 0.5,
  step = 0.5,
}: QuantityStepperProps) {
  const canDecrement = value > min;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, !canDecrement && styles.buttonDisabled]}
        onPress={onDecrement}
        disabled={!canDecrement}
      >
        <Text style={[styles.buttonText, !canDecrement && styles.buttonTextDisabled]}>
          -
        </Text>
      </TouchableOpacity>
      <Text style={styles.value}>{value}</Text>
      <TouchableOpacity style={styles.button} onPress={onIncrement}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  buttonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  buttonTextDisabled: {
    color: '#9ca3af',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    minWidth: 40,
    textAlign: 'center',
  },
});
