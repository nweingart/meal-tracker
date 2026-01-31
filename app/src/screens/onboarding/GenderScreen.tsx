import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';

interface Props {
  onContinue: (gender: string) => void;
  onBack: () => void;
  initialValue?: string;
}

const GENDERS = [
  { id: 'male', emoji: '👨', label: 'Male' },
  { id: 'female', emoji: '👩', label: 'Female' },
  { id: 'other', emoji: '🧑', label: 'Other' },
];

export function GenderScreen({ onContinue, onBack, initialValue }: Props) {
  const [selected, setSelected] = useState<string | null>(initialValue || null);

  const handleContinue = () => {
    if (selected) {
      onContinue(selected);
    }
  };

  return (
    <OnboardingLayout
      currentStep={6}
      onContinue={handleContinue}
      onBack={onBack}
      continueDisabled={!selected}
    >
      <View style={styles.content}>
        <Text style={styles.label}>ABOUT YOU</Text>
        <Text style={styles.title}>What's your{'\n'}biological sex?</Text>
        <Text style={styles.subtitle}>
          This affects how we calculate your metabolism and nutritional needs.
        </Text>

        <View style={styles.options}>
          {GENDERS.map((gender) => (
            <TouchableOpacity
              key={gender.id}
              style={[
                styles.optionCard,
                selected === gender.id && styles.optionCardSelected,
              ]}
              onPress={() => setSelected(gender.id)}
            >
              <Text style={styles.optionEmoji}>{gender.emoji}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  selected === gender.id && styles.optionLabelSelected,
                ]}
              >
                {gender.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.privacyNote}>
          🔒 Your data is private and never shared
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
    color: '#3B82F6',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 32,
    lineHeight: 24,
  },
  options: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  optionCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    paddingVertical: 24,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  optionEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  optionLabelSelected: {
    color: '#1D4ED8',
  },
  privacyNote: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
