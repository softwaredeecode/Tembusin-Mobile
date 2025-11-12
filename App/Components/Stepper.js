import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

//theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

const Stepper = ({ total, current }) => {
  const steps = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => {
          const isCompleted = step < current;
          const isActive = step === current;

          return (
            <React.Fragment key={step}>
              <View
                style={[
                  styles.circle,
                  isCompleted
                    ? styles.circleCompleted
                    : isActive
                    ? styles.circleActive
                    : styles.circleInactive,
                ]}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark" size={14} color={Colors.success500} />
                ) : (
                  <Text
                    style={[
                      styles.stepText,
                      isActive
                        ? styles.stepTextActive
                        : styles.stepTextInactive,
                    ]}
                  >
                    {step}
                  </Text>
                )}
              </View>

              {/* Line antara step */}
              {index < steps.length - 1 && (
                <View
                  style={[
                    styles.line,
                    {
                      backgroundColor:
                        step < current ? Colors.neutral900 : Colors.neutral200,
                    },
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

export default Stepper;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    zIndex: 1,
  },
  circleActive: {
    backgroundColor: Colors.product900,
    borderColor: Colors.product900,
  },
  circleInactive: {
    backgroundColor: Colors.white,
    borderColor: Colors.neutral200,
  },
  circleCompleted: {
    backgroundColor: Colors.success50,
    borderColor: Colors.success200,
  },
  stepText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
  },
  stepTextActive: {
    color: Colors.white,
  },
  stepTextInactive: {
    color: Colors.product900,
  },
  line: {
    flex: 1,
    height: 1,
    marginHorizontal: 10,
  },
});
