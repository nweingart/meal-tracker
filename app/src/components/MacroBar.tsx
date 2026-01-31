import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MacroBarProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
}

export function MacroBar({ label, current, target, color, unit = 'g' }: MacroBarProps) {
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
  const isOver = current > target;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, isOver && styles.overValue]}>
          {Math.round(current)}/{target}{unit === 'kcal' ? '' : unit}
        </Text>
      </View>
      <View style={styles.barBackground}>
        <View
          style={[
            styles.barFill,
            { width: `${percentage}%`, backgroundColor: isOver ? '#ef4444' : color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  value: {
    fontSize: 14,
    color: '#6b7280',
  },
  overValue: {
    color: '#ef4444',
  },
  barBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
});
