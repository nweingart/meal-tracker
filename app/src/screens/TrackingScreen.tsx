import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { CalendarView } from '../components/CalendarView';
import { TrendCard } from '../components/TrendCard';
import { DailyTotals } from '../components/DailyTotals';
import { api } from '../services/api';
import { TrackingSummary, MacroTargets } from '../types';

const DEFAULT_TARGETS: MacroTargets = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
};

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getMonthRange(date: Date): { start: string; end: string } {
  const year = date.getFullYear();
  const month = date.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

export function TrackingScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [summary, setSummary] = useState<TrackingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [markedDates, setMarkedDates] = useState<Set<string>>(new Set());

  const fetchSummary = useCallback(async () => {
    try {
      setLoading(true);
      const { start, end } = getMonthRange(selectedDate);
      const data = await api.getTrackingSummary(start, end);
      setSummary(data);

      const marked = new Set<string>();
      data.daily_data.forEach((day) => {
        if (day.calories > 0) {
          marked.add(day.date);
        }
      });
      setMarkedDates(marked);
    } catch (err) {
      console.error('Failed to fetch tracking summary:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const selectedDateStr = formatDate(selectedDate);
  const selectedDayData = summary?.daily_data.find((d) => d.date === selectedDateStr);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchSummary} />
      }
    >
      <CalendarView
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
        markedDates={markedDates}
      />

      <Text style={styles.sectionTitle}>Selected Day</Text>
      {selectedDayData ? (
        <DailyTotals
          totals={{
            calories: selectedDayData.calories,
            protein: selectedDayData.protein,
            carbs: selectedDayData.carbs,
            fat: selectedDayData.fat,
          }}
          targets={DEFAULT_TARGETS}
        />
      ) : (
        <View style={styles.noDataCard}>
          <Text style={styles.noDataText}>No data for this day</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Monthly Averages</Text>
      {loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : summary ? (
        <>
          <View style={styles.trendRow}>
            <TrendCard
              title="Days Logged"
              value={summary.days_logged}
              subtitle="this month"
              color="#3b82f6"
            />
            <View style={{ width: 12 }} />
            <TrendCard
              title="Avg Calories"
              value={Math.round(summary.avg_calories)}
              subtitle="kcal/day"
              color="#f59e0b"
            />
          </View>
          <View style={styles.trendRow}>
            <TrendCard
              title="Avg Protein"
              value={`${Math.round(summary.avg_protein)}g`}
              color="#10b981"
            />
            <View style={{ width: 12 }} />
            <TrendCard
              title="Avg Carbs"
              value={`${Math.round(summary.avg_carbs)}g`}
              color="#f59e0b"
            />
            <View style={{ width: 12 }} />
            <TrendCard
              title="Avg Fat"
              value={`${Math.round(summary.avg_fat)}g`}
              color="#ef4444"
            />
          </View>
        </>
      ) : (
        <View style={styles.noDataCard}>
          <Text style={styles.noDataText}>No tracking data available</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 24,
    marginBottom: 12,
  },
  trendRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  noDataCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  noDataText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  loader: {
    marginTop: 20,
  },
});
