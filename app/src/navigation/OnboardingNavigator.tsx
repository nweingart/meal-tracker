import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  WelcomeScreen,
  ProblemScreen,
  SolutionScreen,
  HowItWorksScreen,
  GoalScreen,
  GenderScreen,
  BodyStatsScreen,
  ActivityLevelScreen,
  TargetsScreen,
  ScienceScreen,
  TryItNowScreen,
  ReadyScreen,
} from '../screens/onboarding';
import { api } from '../services/api';

const Stack = createNativeStackNavigator();

interface OnboardingData {
  goal: string;
  gender: string;
  age: number;
  heightFeet: number;
  heightInches: number;
  weight: number;
  activityLevel: string;
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  firstFood?: {
    name: string;
    calories: number;
  };
}

// TDEE calculation (matches backend)
function calculateTDEE(data: {
  gender: string;
  age: number;
  heightInches: number;
  weightLbs: number;
  activityLevel: string;
}): number {
  const weightKg = data.weightLbs * 0.453592;
  const heightCm = data.heightInches * 2.54;

  let bmr: number;
  if (data.gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * data.age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * data.age - 161;
  }

  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  return Math.round(bmr * (multipliers[data.activityLevel] || 1.2));
}

function calculateTargets(
  tdee: number,
  goal: string,
  weightLbs: number
): { calories: number; protein: number; carbs: number; fat: number } {
  let targetCalories: number;
  switch (goal) {
    case 'lose':
      targetCalories = tdee - 500;
      break;
    case 'gain':
      targetCalories = tdee + 300;
      break;
    default:
      targetCalories = tdee;
  }

  const protein = Math.round(weightLbs * 0.9);
  const fatCalories = targetCalories * 0.28;
  const fat = Math.round(fatCalories / 9);
  const proteinCalories = protein * 4;
  const carbCalories = targetCalories - proteinCalories - fatCalories;
  const carbs = Math.round(carbCalories / 4);

  return {
    calories: Math.round(targetCalories),
    protein,
    carbs,
    fat,
  };
}

interface OnboardingNavigatorProps {
  onComplete: () => void;
}

export function OnboardingNavigator({ onComplete }: OnboardingNavigatorProps) {
  const [data, setData] = useState<Partial<OnboardingData>>({});

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const saveProfileAndComplete = async () => {
    try {
      const heightInches = (data.heightFeet || 0) * 12 + (data.heightInches || 0);

      await api.updateProfile({
        gender: data.gender as 'male' | 'female' | 'other',
        age: data.age,
        height_inches: heightInches,
        weight_lbs: data.weight,
        activity_level: data.activityLevel as any,
        diet_plan: data.goal as 'maintain' | 'lose' | 'gain',
        calorie_target: data.targets?.calories,
        protein_target_g: data.targets?.protein,
        carbs_target_g: data.targets?.carbs,
        fat_target_g: data.targets?.fat,
      });

      await AsyncStorage.setItem('onboarding_complete', 'true');
      onComplete();
    } catch (err) {
      console.error('Error saving profile:', err);
      onComplete();
    }
  };

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Welcome">
        {({ navigation }) => (
          <WelcomeScreen
            onContinue={() => navigation.navigate('Problem')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Problem">
        {({ navigation }) => (
          <ProblemScreen
            onContinue={() => navigation.navigate('Solution')}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Solution">
        {({ navigation }) => (
          <SolutionScreen
            onContinue={() => navigation.navigate('HowItWorks')}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="HowItWorks">
        {({ navigation }) => (
          <HowItWorksScreen
            onContinue={() => navigation.navigate('Goal')}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Goal">
        {({ navigation }) => (
          <GoalScreen
            initialValue={data.goal}
            onContinue={(goal) => {
              updateData({ goal });
              navigation.navigate('Gender');
            }}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Gender">
        {({ navigation }) => (
          <GenderScreen
            initialValue={data.gender}
            onContinue={(gender) => {
              updateData({ gender });
              navigation.navigate('BodyStats');
            }}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="BodyStats">
        {({ navigation }) => (
          <BodyStatsScreen
            initialValues={{
              age: data.age?.toString(),
              heightFeet: data.heightFeet?.toString(),
              heightInches: data.heightInches?.toString(),
              weight: data.weight?.toString(),
            }}
            onContinue={(stats) => {
              updateData(stats);
              navigation.navigate('ActivityLevel');
            }}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ActivityLevel">
        {({ navigation }) => (
          <ActivityLevelScreen
            initialValue={data.activityLevel}
            onContinue={(activityLevel) => {
              const heightInches = (data.heightFeet || 0) * 12 + (data.heightInches || 0);
              const tdee = calculateTDEE({
                gender: data.gender || 'other',
                age: data.age || 30,
                heightInches,
                weightLbs: data.weight || 150,
                activityLevel,
              });
              const targets = calculateTargets(tdee, data.goal || 'maintain', data.weight || 150);

              updateData({ activityLevel, targets });
              navigation.navigate('Targets');
            }}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Targets">
        {({ navigation }) => (
          <TargetsScreen
            targets={data.targets || { calories: 2000, protein: 150, carbs: 200, fat: 65 }}
            goal={data.goal || 'maintain'}
            onContinue={() => navigation.navigate('Science')}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Science">
        {({ navigation }) => (
          <ScienceScreen
            onContinue={() => navigation.navigate('TryItNow')}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="TryItNow">
        {({ navigation }) => (
          <TryItNowScreen
            onContinue={async (input) => {
              try {
                const entry = await api.createLogEntry(input);
                if (entry && entry.food) {
                  updateData({
                    firstFood: {
                      name: entry.food.name,
                      calories: Math.round(entry.food.calories_per_serving * entry.servings),
                    },
                  });
                }
              } catch (err) {
                console.error('Error logging first food:', err);
              }
              navigation.navigate('Ready');
            }}
            onBack={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Ready">
        {() => (
          <ReadyScreen
            targets={data.targets || { calories: 2000, protein: 150, carbs: 200, fat: 65 }}
            firstFood={data.firstFood}
            onContinue={saveProfileAndComplete}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
