import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { OnboardingProgress } from './OnboardingProgress';

interface OnboardingLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps?: number;
  onContinue: () => void;
  onBack?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  showProgress?: boolean;
  showBack?: boolean;
}

export function OnboardingLayout({
  children,
  currentStep,
  totalSteps = 12,
  onContinue,
  onBack,
  continueLabel = 'Continue',
  continueDisabled = false,
  showProgress = true,
  showBack = true,
}: OnboardingLayoutProps) {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {showBack && currentStep > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        )}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>

        <View style={styles.footer}>
          {showProgress && (
            <OnboardingProgress totalSteps={totalSteps} currentStep={currentStep} />
          )}

          <TouchableOpacity
            style={[styles.continueButton, continueDisabled && styles.continueButtonDisabled]}
            onPress={onContinue}
            disabled={continueDisabled}
          >
            <Text style={styles.continueButtonText}>{continueLabel}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 8,
    left: 16,
    zIndex: 10,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  continueButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  continueButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});
