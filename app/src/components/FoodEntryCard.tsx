import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import { QuantityStepper } from './QuantityStepper';
import { MealLogEntry } from '../types';

interface FoodEntryCardProps {
  entry: MealLogEntry;
  onUpdateServings: (servings: number) => void;
  onDelete: () => void;
}

export function FoodEntryCard({
  entry,
  onUpdateServings,
  onDelete,
}: FoodEntryCardProps) {
  const translateX = useRef(new Animated.Value(0)).current;
  const deleteThreshold = -80;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -100));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < deleteThreshold) {
          Animated.timing(translateX, {
            toValue: -100,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const food = entry.food;
  if (!food) return null;

  const totalCalories = Math.round(food.calories_per_serving * entry.servings);
  const totalProtein = Math.round(food.protein_per_serving * entry.servings);
  const totalCarbs = Math.round(food.carbs_per_serving * entry.servings);
  const totalFat = Math.round(food.fat_per_serving * entry.servings);

  const handleIncrement = () => {
    onUpdateServings(entry.servings + 0.5);
  };

  const handleDecrement = () => {
    if (entry.servings > 0.5) {
      onUpdateServings(entry.servings - 0.5);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
      <Animated.View
        style={[styles.container, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.name}>{food.name}</Text>
            <Text style={styles.calories}>{totalCalories} kcal</Text>
          </View>
          <View style={styles.footer}>
            <View style={styles.macros}>
              <Text style={styles.macro}>P: {totalProtein}g</Text>
              <Text style={styles.macro}>C: {totalCarbs}g</Text>
              <Text style={styles.macro}>F: {totalFat}g</Text>
            </View>
            <QuantityStepper
              value={entry.servings}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
            />
          </View>
          <Text style={styles.servingInfo}>
            {entry.servings} x {food.serving_unit}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  calories: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  macros: {
    flexDirection: 'row',
    gap: 12,
  },
  macro: {
    fontSize: 13,
    color: '#6b7280',
  },
  servingInfo: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});
