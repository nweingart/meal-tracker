import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useFoodLibrary } from '../hooks/useFoodLibrary';
import { Food } from '../types';

interface EditModalProps {
  food: Food | null;
  visible: boolean;
  onClose: () => void;
  onSave: (updates: Partial<Food>) => void;
}

function EditFoodModal({ food, visible, onClose, onSave }: EditModalProps) {
  const [name, setName] = useState('');
  const [servingUnit, setServingUnit] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  React.useEffect(() => {
    if (food) {
      setName(food.name);
      setServingUnit(food.serving_unit);
      setCalories(String(food.calories_per_serving));
      setProtein(String(food.protein_per_serving));
      setCarbs(String(food.carbs_per_serving));
      setFat(String(food.fat_per_serving));
    }
  }, [food]);

  const handleSave = () => {
    onSave({
      name,
      serving_unit: servingUnit,
      calories_per_serving: parseFloat(calories) || 0,
      protein_per_serving: parseFloat(protein) || 0,
      carbs_per_serving: parseFloat(carbs) || 0,
      fat_per_serving: parseFloat(fat) || 0,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={modalStyles.container}>
        <View style={modalStyles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={modalStyles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={modalStyles.title}>Edit Food</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={modalStyles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={modalStyles.form}>
          <Text style={modalStyles.label}>Name</Text>
          <TextInput
            style={modalStyles.input}
            value={name}
            onChangeText={setName}
          />

          <Text style={modalStyles.label}>Serving Unit</Text>
          <TextInput
            style={modalStyles.input}
            value={servingUnit}
            onChangeText={setServingUnit}
            placeholder="e.g., 1 large egg, 1 cup"
          />

          <Text style={modalStyles.label}>Calories per Serving</Text>
          <TextInput
            style={modalStyles.input}
            value={calories}
            onChangeText={setCalories}
            keyboardType="numeric"
          />

          <View style={modalStyles.macroRow}>
            <View style={modalStyles.macroField}>
              <Text style={modalStyles.label}>Protein (g)</Text>
              <TextInput
                style={modalStyles.input}
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
              />
            </View>
            <View style={modalStyles.macroField}>
              <Text style={modalStyles.label}>Carbs (g)</Text>
              <TextInput
                style={modalStyles.input}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
              />
            </View>
            <View style={modalStyles.macroField}>
              <Text style={modalStyles.label}>Fat (g)</Text>
              <TextInput
                style={modalStyles.input}
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  cancelButton: {
    fontSize: 16,
    color: '#6b7280',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  macroRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroField: {
    flex: 1,
  },
});

export function LibraryScreen() {
  const { foods, loading, refresh, updateFood, deleteFood } = useFoodLibrary();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedFoods = [...filteredFoods].sort(
    (a, b) => b.times_used - a.times_used
  );

  const handleEdit = (food: Food) => {
    setEditingFood(food);
  };

  const handleSave = async (updates: Partial<Food>) => {
    if (editingFood) {
      await updateFood(editingFood.id, updates);
    }
  };

  const handleDelete = (food: Food) => {
    Alert.alert(
      'Delete Food',
      `Are you sure you want to delete "${food.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteFood(food.id),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search foods..."
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={sortedFoods}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.foodCard}
            onPress={() => handleEdit(item)}
            onLongPress={() => handleDelete(item)}
          >
            <View style={styles.foodHeader}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.timesUsed}>Used {item.times_used}x</Text>
            </View>
            <Text style={styles.servingUnit}>{item.serving_unit}</Text>
            <View style={styles.macros}>
              <Text style={styles.macro}>{item.calories_per_serving} kcal</Text>
              <Text style={styles.macroDivider}>·</Text>
              <Text style={styles.macro}>P: {item.protein_per_serving}g</Text>
              <Text style={styles.macroDivider}>·</Text>
              <Text style={styles.macro}>C: {item.carbs_per_serving}g</Text>
              <Text style={styles.macroDivider}>·</Text>
              <Text style={styles.macro}>F: {item.fat_per_serving}g</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator style={styles.loader} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Your food library is empty</Text>
              <Text style={styles.emptySubtext}>
                Foods you log will appear here
              </Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refresh} />
        }
      />

      <EditFoodModal
        food={editingFood}
        visible={editingFood !== null}
        onClose={() => setEditingFood(null)}
        onSave={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  foodCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  timesUsed: {
    fontSize: 12,
    color: '#9ca3af',
  },
  servingUnit: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  macros: {
    flexDirection: 'row',
    marginTop: 8,
    alignItems: 'center',
  },
  macro: {
    fontSize: 13,
    color: '#6b7280',
  },
  macroDivider: {
    marginHorizontal: 6,
    color: '#d1d5db',
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
});
