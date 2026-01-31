import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MacroBar } from './MacroBar';
import { MacroTotals, MacroTargets } from '../types';

interface DailyTotalsProps {
  totals: MacroTotals;
  targets: MacroTargets;
}

export function DailyTotals({ totals, targets }: DailyTotalsProps) {
  return (
    <View style={styles.container}>
      <View style={styles.calorieHeader}>
        <Text style={styles.calorieValue}>{Math.round(totals.calories)}</Text>
        <Text style={styles.calorieLabel}>/ {targets.calories} kcal</Text>
      </View>
      <View style={styles.macros}>
        <MacroBar
          label="Protein"
          current={totals.protein}
          target={targets.protein}
          color="#3b82f6"
        />
        <MacroBar
          label="Carbs"
          current={totals.carbs}
          target={targets.carbs}
          color="#f59e0b"
        />
        <MacroBar
          label="Fat"
          current={totals.fat}
          target={targets.fat}
          color="#10b981"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  calorieHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  calorieValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
  },
  calorieLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginLeft: 4,
  },
  macros: {
    gap: 8,
  },
});
