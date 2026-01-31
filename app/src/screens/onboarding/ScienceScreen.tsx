import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';

interface Props {
  onContinue: () => void;
  onBack: () => void;
}

export function ScienceScreen({ onContinue, onBack }: Props) {
  return (
    <OnboardingLayout
      currentStep={10}
      onContinue={onContinue}
      onBack={onBack}
    >
      <View style={styles.content}>
        <Text style={styles.label}>THE SCIENCE</Text>
        <Text style={styles.title}>How we calculated{'\n'}your targets</Text>

        <View style={styles.methodCard}>
          <View style={styles.methodHeader}>
            <View style={styles.methodBadge}>
              <Text style={styles.methodBadgeText}>GOLD STANDARD</Text>
            </View>
          </View>
          <Text style={styles.methodName}>Mifflin-St Jeor Equation</Text>
          <Text style={styles.methodDescription}>
            Developed at{' '}
            <Text style={styles.bold}>University of Nevada</Text> and validated across thousands of subjects, this is the most accurate formula for estimating resting metabolic rate.
          </Text>
          <Text style={styles.citation}>
            — Mifflin et al., American Journal of Clinical Nutrition, 1990
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Your calculation:</Text>

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Base Metabolic Rate (BMR)</Text>
              <Text style={styles.stepDescription}>
                Calories your body burns at complete rest, calculated from your age, height, weight, and sex.
              </Text>
            </View>
          </View>

          <View style={styles.stepConnector} />

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Activity Multiplier</Text>
              <Text style={styles.stepDescription}>
                We multiply your BMR by your activity level to get your Total Daily Energy Expenditure (TDEE).
              </Text>
            </View>
          </View>

          <View style={styles.stepConnector} />

          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Goal Adjustment</Text>
              <Text style={styles.stepDescription}>
                We adjust for your goal: deficit for weight loss, surplus for muscle gain, or maintenance.
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.trustBox}>
          <Text style={styles.trustIcon}>✓</Text>
          <Text style={styles.trustText}>
            Used by registered dietitians and sports nutritionists worldwide
          </Text>
        </View>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    lineHeight: 36,
  },
  methodCard: {
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  methodHeader: {
    marginBottom: 8,
  },
  methodBadge: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  methodBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  methodName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5B21B6',
    marginBottom: 8,
  },
  methodDescription: {
    fontSize: 15,
    color: '#6D28D9',
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
  },
  citation: {
    fontSize: 12,
    color: '#8B5CF6',
    marginTop: 12,
    fontStyle: 'italic',
  },
  stepsContainer: {
    marginBottom: 24,
  },
  stepsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  stepConnector: {
    width: 2,
    height: 16,
    backgroundColor: '#E5E7EB',
    marginLeft: 13,
    marginVertical: 4,
  },
  trustBox: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  trustIcon: {
    fontSize: 18,
    color: '#059669',
    marginRight: 12,
    fontWeight: '700',
  },
  trustText: {
    flex: 1,
    fontSize: 14,
    color: '#065F46',
    lineHeight: 20,
  },
});
