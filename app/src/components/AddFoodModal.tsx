import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Food } from '../types';

interface AddFoodModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: string) => Promise<void>;
  foods: Food[];
  loading?: boolean;
}

export function AddFoodModal({
  visible,
  onClose,
  onSubmit,
  foods,
  loading = false,
}: AddFoodModalProps) {
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [mode, setMode] = useState<'input' | 'library'>('input');

  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (input.trim()) {
      await onSubmit(input.trim());
      setInput('');
      onClose();
    }
  };

  const handleSelectFood = async (food: Food) => {
    await onSubmit(`1 ${food.serving_unit} ${food.name}`);
    setSearchQuery('');
    onClose();
  };

  const handleClose = () => {
    setInput('');
    setSearchQuery('');
    setMode('input');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Food</Text>
          <View style={{ width: 60 }} />
        </View>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, mode === 'input' && styles.activeTab]}
            onPress={() => setMode('input')}
          >
            <Text style={[styles.tabText, mode === 'input' && styles.activeTabText]}>
              Describe
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, mode === 'library' && styles.activeTab]}
            onPress={() => setMode('library')}
          >
            <Text style={[styles.tabText, mode === 'library' && styles.activeTabText]}>
              Library
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'input' ? (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., 2 eggs, bowl of oatmeal with berries"
              placeholderTextColor="#9ca3af"
              value={input}
              onChangeText={setInput}
              multiline
              autoFocus
            />
            <TouchableOpacity
              style={[styles.submitButton, !input.trim() && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!input.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Add</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.libraryContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search your foods..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <FlatList
              data={filteredFoods}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.foodItem}
                  onPress={() => handleSelectFood(item)}
                >
                  <View>
                    <Text style={styles.foodName}>{item.name}</Text>
                    <Text style={styles.foodServing}>
                      {item.serving_unit} · {item.calories_per_serving} kcal
                    </Text>
                  </View>
                  <Text style={styles.timesUsed}>Used {item.times_used}x</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  {searchQuery ? 'No foods found' : 'Your food library is empty'}
                </Text>
              }
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    color: '#3b82f6',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#3b82f6',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#fff',
  },
  inputContainer: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  libraryContainer: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  foodItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  foodServing: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  timesUsed: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 32,
  },
});
