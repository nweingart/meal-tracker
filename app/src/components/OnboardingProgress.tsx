import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  interpolateColor,
  FadeIn,
} from 'react-native-reanimated';

interface OnboardingProgressProps {
  totalSteps: number;
  currentStep: number;
}

function ProgressDot({
  index,
  isCompleted,
  isCurrent,
  isNew,
}: {
  index: number;
  isCompleted: boolean;
  isCurrent: boolean;
  isNew: boolean;
}) {
  const scale = useSharedValue(1);
  const checkOpacity = useSharedValue(isCompleted && !isNew ? 1 : 0);
  const checkScale = useSharedValue(isCompleted && !isNew ? 1 : 0);
  const pulseScale = useSharedValue(1);
  const colorProgress = useSharedValue(isCompleted ? 1 : 0);

  useEffect(() => {
    if (isNew && isCompleted) {
      // Satisfying completion animation
      scale.value = withSequence(
        withSpring(1.3, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      );

      colorProgress.value = withTiming(1, { duration: 200 });

      checkScale.value = withDelay(
        100,
        withSequence(
          withSpring(1.2, { damping: 6, stiffness: 300 }),
          withSpring(1, { damping: 10, stiffness: 200 })
        )
      );

      checkOpacity.value = withDelay(100, withTiming(1, { duration: 150 }));
    }
  }, [isCompleted, isNew]);

  useEffect(() => {
    if (isCurrent) {
      // Subtle pulse for current step
      const pulse = () => {
        pulseScale.value = withSequence(
          withTiming(1.15, { duration: 800 }),
          withTiming(1, { duration: 800 })
        );
      };
      pulse();
      const interval = setInterval(pulse, 1600);
      return () => clearInterval(interval);
    } else {
      pulseScale.value = withTiming(1, { duration: 200 });
    }
  }, [isCurrent]);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value * (isCurrent ? pulseScale.value : 1) },
    ],
    backgroundColor: interpolateColor(
      colorProgress.value,
      [0, 1],
      ['#E5E7EB', '#3B82F6']
    ),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  const currentRingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: isCurrent ? 1 : 0,
  }));

  return (
    <View style={styles.dotContainer}>
      {isCurrent && (
        <Animated.View style={[styles.currentRing, currentRingStyle]} />
      )}
      <Animated.View style={[styles.dot, dotStyle]}>
        <Animated.Text style={[styles.checkmark, checkStyle]}>
          ✓
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

function ProgressLine({
  isCompleted,
  isNew,
}: {
  isCompleted: boolean;
  isNew: boolean;
}) {
  const fillWidth = useSharedValue(isCompleted && !isNew ? 1 : 0);

  useEffect(() => {
    if (isNew && isCompleted) {
      fillWidth.value = withTiming(1, { duration: 300 });
    }
  }, [isCompleted, isNew]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fillWidth.value * 100}%`,
  }));

  return (
    <View style={styles.lineContainer}>
      <View style={styles.lineBackground} />
      <Animated.View style={[styles.lineFill, fillStyle]} />
    </View>
  );
}

export function OnboardingProgress({ totalSteps, currentStep }: OnboardingProgressProps) {
  const [prevStep, setPrevStep] = React.useState(currentStep);
  const isAdvancing = currentStep > prevStep;

  useEffect(() => {
    setPrevStep(currentStep);
  }, [currentStep]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        const isNewlyCompleted = isAdvancing && stepNumber === currentStep - 1;
        const isNewLine = isAdvancing && stepNumber === currentStep - 1;

        return (
          <React.Fragment key={index}>
            <ProgressDot
              index={index}
              isCompleted={isCompleted}
              isCurrent={isCurrent}
              isNew={isNewlyCompleted}
            />
            {index < totalSteps - 1 && (
              <ProgressLine
                isCompleted={stepNumber < currentStep}
                isNew={isNewLine}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  dotContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentRing: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  checkmark: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  lineContainer: {
    flex: 1,
    height: 2,
    maxWidth: 20,
  },
  lineBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#E5E7EB',
    borderRadius: 1,
  },
  lineFill: {
    height: 2,
    backgroundColor: '#3B82F6',
    borderRadius: 1,
  },
});
