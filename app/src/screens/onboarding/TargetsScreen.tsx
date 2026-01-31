import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  FadeInDown,
} from 'react-native-reanimated';
import { OnboardingLayout } from '../../components/OnboardingLayout';

interface Props {
  onContinue: () => void;
  onBack: () => void;
  targets: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  goal: string;
}

export function TargetsScreen({ onContinue, onBack, targets, goal }: Props) {
  const calorieScale = useSharedValue(0);
  const macroOpacity = useSharedValue(0);

  useEffect(() => {
    calorieScale.value = withSpring(1, { damping: 12, stiffness: 100 });
    macroOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
  }, []);

  const calorieStyle = useAnimatedStyle(() => ({
    transform: [{ scale: calorieScale.value }],
  }));

  const macroStyle = useAnimatedStyle(() => ({
    opacity: macroOpacity.value,
  }));

  const goalLabel =
    goal === 'lose' ? 'Weight Loss' : goal === 'gain' ? 'Weight Gain' : 'Maintenance';

  return (
    <OnboardingLayout
      currentStep={9}
      onContinue={onContinue}
      onBack={onBack}
    >
      <View style={styles.content}>
        <Text style={styles.label}>YOUR TARGETS</Text>
        <Text style={styles.title}>Here's your{'\n'}personalized plan</Text>

        <View style={styles.goalBadge}>
          <Text style={styles.goalText}>{goalLabel} Plan</Text>
        </View>

        <Animated.View style={[styles.calorieCard, calorieStyle]}>
          <Text style={styles.calorieLabel}>Daily Calories</Text>
          <Text style={styles.calorieValue}>{targets.calories.toLocaleString()}</Text>
          <Text style={styles.calorieUnit}>kcal / day</Text>
        </Animated.View>

        <Animated.View style={[styles.macrosContainer, macroStyle]}>
          <Text style={styles.macrosTitle}>Macro Breakdown</Text>
          <View style={styles.macrosRow}>
            <View style={styles.macroCard}>
              <View style={[styles.macroIcon, { backgroundColor: '#DBEAFE' }]}>
                <Text style={styles.macroIconText}>P</Text>
              </View>
              <Text style={styles.macroValue}>{targets.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroCard}>
              <View style={[styles.macroIcon, { backgroundColor: '#FEF3C7' }]}>
                <Text style={styles.macroIconText}>C</Text>
              </View>
              <Text style={styles.macroValue}>{targets.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroCard}>
              <View style={[styles.macroIcon, { backgroundColor: '#D1FAE5' }]}>
                <Text style={styles.macroIconText}>F</Text>
              </View>
              <Text style={styles.macroValue}>{targets.fat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            These targets are calculated based on your body stats and goals. You can adjust them anytime in settings.
          </Text>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#10B981',
    letterSpacing: 1,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    lineHeight: 36,
    alignSelf: 'flex-start',
  },
  goalBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  goalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  calorieCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  calorieLabel: {
    fontSize: 14,
    color: '#BFDBFE',
    marginBottom: 4,
  },
  calorieValue: {
    fontSize: 56,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  calorieUnit: {
    fontSize: 16,
    color: '#BFDBFE',
    marginTop: 4,
  },
  macrosContainer: {
    width: '100%',
    marginBottom: 24,
  },
  macrosTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textAlign: 'center',
  },
  macrosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  macroCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  macroIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  macroIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
  },
  macroValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  macroLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  noteBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  noteText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
