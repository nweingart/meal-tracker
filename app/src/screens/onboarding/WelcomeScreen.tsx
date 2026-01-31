import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';

interface Props {
  onContinue: () => void;
}

export function WelcomeScreen({ onContinue }: Props) {
  return (
    <OnboardingLayout
      currentStep={1}
      onContinue={onContinue}
      continueLabel="Get Started"
      showBack={false}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>🍽️</Text>
        <Text style={styles.title}>Welcome to{'\n'}Meal Tracker</Text>
        <Text style={styles.subtitle}>
          Track your nutrition effortlessly with AI-powered food logging
        </Text>
        <View style={styles.features}>
          <Text style={styles.feature}>✓ Just describe what you ate</Text>
          <Text style={styles.feature}>✓ Get accurate macro tracking</Text>
          <Text style={styles.feature}>✓ Build better eating habits</Text>
        </View>
        <Text style={styles.cta}>
          Let's personalize your experience
        </Text>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 17,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  features: {
    alignSelf: 'stretch',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
  },
  feature: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 12,
  },
  cta: {
    fontSize: 15,
    color: '#3B82F6',
    fontWeight: '500',
  },
});
