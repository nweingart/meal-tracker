import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';

interface Props {
  onContinue: () => void;
  onBack: () => void;
}

export function SolutionScreen({ onContinue, onBack }: Props) {
  return (
    <OnboardingLayout
      currentStep={3}
      onContinue={onContinue}
      onBack={onBack}
    >
      <View style={styles.content}>
        <Text style={styles.label}>THE SOLUTION</Text>
        <Text style={styles.title}>Tracking changes{'\n'}everything</Text>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>2x</Text>
          <Text style={styles.statLabel}>more weight lost by consistent trackers</Text>
        </View>

        <View style={styles.research}>
          <Text style={styles.researchTitle}>The Evidence</Text>

          <View style={styles.studyCard}>
            <View style={styles.institutionBadge}>
              <Text style={styles.institutionText}>KAISER PERMANENTE</Text>
            </View>
            <Text style={styles.studyText}>
              A study of{' '}
              <Text style={styles.bold}>1,700 participants</Text>{' '}
              found that those who kept daily food records lost{' '}
              <Text style={styles.bold}>twice as much weight</Text>{' '}
              as those who didn't track.
            </Text>
            <Text style={styles.citation}>
              — Hollis et al., American Journal of Preventive Medicine, 2008
            </Text>
          </View>

          <View style={styles.studyCard}>
            <View style={styles.institutionBadge}>
              <Text style={styles.institutionText}>UNIVERSITY OF PITTSBURGH</Text>
            </View>
            <Text style={styles.studyText}>
              A comprehensive meta-analysis confirmed that{' '}
              <Text style={styles.bold}>self-monitoring is the single strongest predictor</Text>{' '}
              of successful weight management.
            </Text>
            <Text style={styles.citation}>
              — Burke et al., Journal of the American Dietetic Association, 2011
            </Text>
          </View>
        </View>

        <View style={styles.insightBox}>
          <Text style={styles.insightEmoji}>💡</Text>
          <Text style={styles.insightText}>
            The simple act of tracking creates awareness that naturally guides better choices.
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
    color: '#10B981',
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
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  statNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: '#10B981',
  },
  statLabel: {
    fontSize: 15,
    color: '#065F46',
    textAlign: 'center',
    marginTop: 4,
  },
  research: {
    marginBottom: 20,
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
  institutionBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  institutionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1D4ED8',
    letterSpacing: 0.5,
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
  insightBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  insightEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: '#92400E',
    lineHeight: 20,
  },
});
