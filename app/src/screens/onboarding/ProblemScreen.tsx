import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';

interface Props {
  onContinue: () => void;
  onBack: () => void;
}

export function ProblemScreen({ onContinue, onBack }: Props) {
  return (
    <OnboardingLayout
      currentStep={2}
      onContinue={onContinue}
      onBack={onBack}
    >
      <View style={styles.content}>
        <Text style={styles.label}>THE PROBLEM</Text>
        <Text style={styles.title}>We're terrible at{'\n'}estimating calories</Text>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>47%</Text>
          <Text style={styles.statLabel}>average underestimation of calorie intake</Text>
        </View>

        <View style={styles.research}>
          <Text style={styles.researchTitle}>The Research</Text>

          <View style={styles.studyCard}>
            <Text style={styles.studyText}>
              A landmark study published in the{' '}
              <Text style={styles.bold}>New England Journal of Medicine</Text>{' '}
              found that participants underreported their calorie intake by an average of 47%.
            </Text>
            <Text style={styles.citation}>
              — Lichtman et al., NEJM, 1992
            </Text>
          </View>

          <View style={styles.studyCard}>
            <Text style={styles.studyText}>
              Even trained dietitians at{' '}
              <Text style={styles.bold}>Pennington Biomedical Research Center</Text>{' '}
              underestimated their own intake by 10-20%.
            </Text>
            <Text style={styles.citation}>
              — Champagne et al., Journal of the American Dietetic Association, 2002
            </Text>
          </View>
        </View>

        <Text style={styles.takeaway}>
          It's not about willpower — our brains simply aren't wired for accurate estimation.
        </Text>
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
    color: '#EF4444',
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
  statCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  statNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: '#EF4444',
  },
  statLabel: {
    fontSize: 15,
    color: '#991B1B',
    textAlign: 'center',
    marginTop: 4,
  },
  research: {
    marginBottom: 24,
  },
  researchTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  studyCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  studyText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
  },
  bold: {
    fontWeight: '600',
    color: '#111827',
  },
  citation: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 8,
    fontStyle: 'italic',
  },
  takeaway: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
  },
});
