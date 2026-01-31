import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TrendCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: string;
}

export function TrendCard({ title, value, subtitle, trend, color = '#3b82f6' }: TrendCardProps) {
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '';
  const trendColor = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.valueContainer}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {trend && (
          <Text style={[styles.trend, { color: trendColor }]}>{trendIcon}</Text>
        )}
      </View>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  trend: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});
