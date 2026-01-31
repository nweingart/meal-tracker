import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { DailyTotals } from '../components/DailyTotals';
import { FoodEntryCard } from '../components/FoodEntryCard';
import { AddFoodModal } from '../components/AddFoodModal';
import { useMealLog } from '../hooks/useMealLog';
import { useFoodLibrary } from '../hooks/useFoodLibrary';
import { MacroTargets } from '../types';

const DEFAULT_TARGETS: MacroTargets = {
  calories: 2000,
  protein: 150,
  carbs: 200,
  fat: 65,
};

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function TodayScreen() {
  const today = formatDate(new Date());
  const { dailyLog, loading, error, refresh, addEntry, updateServings, deleteEntry } = useMealLog(today);
  const { foods } = useFoodLibrary();
  const [modalVisible, setModalVisible] = useState(false);
  const [addingFood, setAddingFood] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const handleAddFood = async (input: string) => {
    setAddingFood(true);
    await addEntry(input);
    setAddingFood(false);
  };

  const handleUpdateServings = async (id: string, servings: number) => {
    await updateServings(id, servings);
  };

  const handleDelete = async (id: string) => {
    await deleteEntry(id);
  };

  const totals = dailyLog?.totals || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const entries = dailyLog?.entries || [];

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <DailyTotals totals={totals} targets={DEFAULT_TARGETS} />
            {entries.length > 0 && (
              <Text style={styles.sectionTitle}>Today's Food</Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <FoodEntryCard
            entry={item}
            onUpdateServings={(servings) => handleUpdateServings(item.id, servings)}
            onDelete={() => handleDelete(item.id)}
          />
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No food logged today</Text>
              <Text style={styles.emptySubtext}>
                Tap the + button to add your first meal
              </Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <AddFoodModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddFood}
        foods={foods}
        loading={addingFood}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  loader: {
    marginTop: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '400',
  },
});
