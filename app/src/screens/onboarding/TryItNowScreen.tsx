import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { OnboardingLayout } from '../../components/OnboardingLayout';

interface Props {
  onContinue: (input: string) => Promise<void>;
  onBack: () => void;
}

const SUGGESTIONS = [
  '2 eggs and toast',
  'bowl of oatmeal with berries',
  'chicken salad sandwich',
  'grilled salmon with rice',
];

export function TryItNowScreen({ onContinue, onBack }: Props) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (input.trim()) {
      setLoading(true);
      await onContinue(input.trim());
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <OnboardingLayout
      currentStep={11}
      onContinue={handleContinue}
      onBack={onBack}
      continueLabel={loading ? 'Analyzing...' : 'Log It'}
      continueDisabled={!input.trim() || loading}
    >
      <View style={styles.content}>
        <Text style={styles.label}>TRY IT NOW</Text>
        <Text style={styles.title}>Log your first{'\n'}food</Text>
        <Text style={styles.subtitle}>
          Just describe what you ate naturally — our AI will handle the rest.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="e.g., 2 eggs with toast and butter"
            placeholderTextColor="#9CA3AF"
            multiline
            autoFocus
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color="#3B82F6" size="large" />
              <Text style={styles.loadingText}>Analyzing nutrition...</Text>
            </View>
          )}
        </View>

        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Try these examples:</Text>
          <View style={styles.suggestions}>
            {SUGGESTIONS.map((suggestion, index) => (
              <Text
                key={index}
                style={styles.suggestion}
                onPress={() => handleSuggestion(suggestion)}
              >
                "{suggestion}"
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.tipBox}>
          <Text style={styles.tipEmoji}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Pro tip</Text>
            <Text style={styles.tipText}>
              Include quantities for more accurate tracking. "2 eggs" is better than just "eggs".
            </Text>
          </View>
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
    marginBottom: 24,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 20,
    fontSize: 18,
    color: '#111827',
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(249, 250, 251, 0.9)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
  },
  suggestionsContainer: {
    marginBottom: 24,
  },
  suggestionsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  suggestions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestion: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
    color: '#3B82F6',
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#A16207',
    lineHeight: 20,
  },
});
