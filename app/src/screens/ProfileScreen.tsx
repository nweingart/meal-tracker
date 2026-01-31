import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { UserProfile } from '../types';

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
type DietPlan = 'maintain' | 'lose' | 'gain';
type Gender = 'male' | 'female' | 'other';

const ACTIVITY_LEVELS: { value: ActivityLevel; label: string }[] = [
  { value: 'sedentary', label: 'Sedentary' },
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'active', label: 'Active' },
  { value: 'very_active', label: 'Very Active' },
];

const DIET_PLANS: { value: DietPlan; label: string }[] = [
  { value: 'lose', label: 'Lose Weight' },
  { value: 'maintain', label: 'Maintain' },
  { value: 'gain', label: 'Gain Weight' },
];

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export function ProfileScreen() {
  const { signOut, user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [gender, setGender] = useState<Gender | null>(null);
  const [age, setAge] = useState('');
  const [heightFeet, setHeightFeet] = useState('');
  const [heightInches, setHeightInches] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [calorieTarget, setCalorieTarget] = useState('');
  const [proteinTarget, setProteinTarget] = useState('');
  const [carbsTarget, setCarbsTarget] = useState('');
  const [fatTarget, setFatTarget] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await api.getProfile();
      if (profile) {
        setGender(profile.gender as Gender);
        setAge(profile.age ? String(profile.age) : '');
        if (profile.height_inches) {
          setHeightFeet(String(Math.floor(profile.height_inches / 12)));
          setHeightInches(String(profile.height_inches % 12));
        }
        setWeight(profile.weight_lbs ? String(profile.weight_lbs) : '');
        setActivityLevel(profile.activity_level as ActivityLevel);
        setDietPlan(profile.diet_plan as DietPlan);
        setCalorieTarget(profile.calorie_target ? String(profile.calorie_target) : '');
        setProteinTarget(profile.protein_target_g ? String(profile.protein_target_g) : '');
        setCarbsTarget(profile.carbs_target_g ? String(profile.carbs_target_g) : '');
        setFatTarget(profile.fat_target_g ? String(profile.fat_target_g) : '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const heightTotal =
        (parseInt(heightFeet) || 0) * 12 + (parseInt(heightInches) || 0);

      await api.updateProfile({
        gender,
        age: parseInt(age) || null,
        height_inches: heightTotal || null,
        weight_lbs: parseFloat(weight) || null,
        activity_level: activityLevel,
        diet_plan: dietPlan,
        calorie_target: parseInt(calorieTarget) || null,
        protein_target_g: parseInt(proteinTarget) || null,
        carbs_target_g: parseInt(carbsTarget) || null,
        fat_target_g: parseInt(fatTarget) || null,
      });

      Alert.alert('Success', 'Profile saved successfully');
    } catch (err) {
      Alert.alert('Error', 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Body Stats</Text>

        <Text style={styles.label}>Gender</Text>
        <View style={styles.buttonGroup}>
          {GENDERS.map((g) => (
            <TouchableOpacity
              key={g.value}
              style={[
                styles.optionButton,
                gender === g.value && styles.optionButtonActive,
              ]}
              onPress={() => setGender(g.value)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  gender === g.value && styles.optionButtonTextActive,
                ]}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          placeholder="30"
        />

        <Text style={styles.label}>Height</Text>
        <View style={styles.heightRow}>
          <View style={styles.heightField}>
            <TextInput
              style={styles.input}
              value={heightFeet}
              onChangeText={setHeightFeet}
              keyboardType="numeric"
              placeholder="5"
            />
            <Text style={styles.heightUnit}>ft</Text>
          </View>
          <View style={styles.heightField}>
            <TextInput
              style={styles.input}
              value={heightInches}
              onChangeText={setHeightInches}
              keyboardType="numeric"
              placeholder="10"
            />
            <Text style={styles.heightUnit}>in</Text>
          </View>
        </View>

        <Text style={styles.label}>Weight (lbs)</Text>
        <TextInput
          style={styles.input}
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
          placeholder="170"
        />

        <Text style={styles.label}>Activity Level</Text>
        <View style={styles.buttonGroup}>
          {ACTIVITY_LEVELS.map((level) => (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.optionButton,
                activityLevel === level.value && styles.optionButtonActive,
              ]}
              onPress={() => setActivityLevel(level.value)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  activityLevel === level.value && styles.optionButtonTextActive,
                ]}
              >
                {level.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Goal</Text>
        <View style={styles.buttonGroup}>
          {DIET_PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.value}
              style={[
                styles.optionButton,
                dietPlan === plan.value && styles.optionButtonActive,
              ]}
              onPress={() => setDietPlan(plan.value)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  dietPlan === plan.value && styles.optionButtonTextActive,
                ]}
              >
                {plan.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Daily Targets</Text>

        <Text style={styles.label}>Calories</Text>
        <TextInput
          style={styles.input}
          value={calorieTarget}
          onChangeText={setCalorieTarget}
          keyboardType="numeric"
          placeholder="2000"
        />

        <View style={styles.macroRow}>
          <View style={styles.macroField}>
            <Text style={styles.label}>Protein (g)</Text>
            <TextInput
              style={styles.input}
              value={proteinTarget}
              onChangeText={setProteinTarget}
              keyboardType="numeric"
              placeholder="150"
            />
          </View>
          <View style={styles.macroField}>
            <Text style={styles.label}>Carbs (g)</Text>
            <TextInput
              style={styles.input}
              value={carbsTarget}
              onChangeText={setCarbsTarget}
              keyboardType="numeric"
              placeholder="200"
            />
          </View>
          <View style={styles.macroField}>
            <Text style={styles.label}>Fat (g)</Text>
            <TextInput
              style={styles.input}
              value={fatTarget}
              onChangeText={setFatTarget}
              keyboardType="numeric"
              placeholder="65"
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Save Profile</Text>
        )}
      </TouchableOpacity>

      <View style={styles.accountSection}>
        <Text style={styles.emailText}>{user?.email}</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 48,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  optionButtonActive: {
    backgroundColor: '#3b82f6',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  optionButtonTextActive: {
    color: '#fff',
    fontWeight: '500',
  },
  heightRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heightField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heightUnit: {
    marginLeft: 8,
    fontSize: 16,
    color: '#6b7280',
  },
  macroRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroField: {
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  accountSection: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  emailText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  signOutButton: {
    padding: 12,
  },
  signOutButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '500',
  },
});
