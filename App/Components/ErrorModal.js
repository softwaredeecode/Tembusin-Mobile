import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

//theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

const ErrorModal = ({
  visible,
  title = 'Terjadi Kesalahan',
  description = 'Terjadi kesalahan, silakan coba lagi.',
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              {/* Icon */}
              <Ionicons
                name="close-circle-outline"
                size={50}
                color={Colors.danger500}
                style={styles.icon}
              />

              {/* Title */}
              <Text style={styles.title}>{title}</Text>

              {/* Description */}
              <Text style={styles.description}>{description}</Text>

              {/* Button OK */}
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.8}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ErrorModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  icon: {
    marginBottom: 20,
    padding: 6,
    backgroundColor: Colors.danger50,
    borderWidth: 1,
    borderColor: Colors.danger200,
    borderRadius: 10
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.Medium,
    color: Colors.neutral900,
    marginBottom: 6,
    textAlign: 'center',
    lineHeight: 24
  },
  description: {
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    backgroundColor: Colors.danger500,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
