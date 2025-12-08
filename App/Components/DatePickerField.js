import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

//theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

const DatePickerField = ({
  label,
  placeholder = 'Pilih tanggal',
  value,
  onChange,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const handleConfirm = () => {
    onChange(tempDate);
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowModal(true)}
        activeOpacity={0.7}
      >
        <Text style={value ? styles.text : styles.placeholder}>
          {value ? value.toLocaleDateString('id-ID') : placeholder}
        </Text>
      </TouchableOpacity>

      {/* MODAL */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Date Picker */}
            <DateTimePicker
              value={tempDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, selected) => {
                if (selected) setTempDate(selected);
              }}
            />

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.okButton]}
                onPress={handleConfirm}
              >
                <Text style={styles.okText}>Pilih</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DatePickerField;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: Colors.neutral50,
  },
  placeholder: {
    color: Colors.neutral400,
    fontSize: 14,
    fontFamily: Fonts.Regular,
  },
  text: {
    color: Colors.neutral900,
    fontSize: 14,
    fontFamily: Fonts.Regular,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    marginRight: 12,
  },
  okButton: {
    backgroundColor: Colors.primary500,
  },
  cancelText: {
    color: Colors.neutral700,
    fontSize: 14,
    fontFamily: Fonts.Regular,
  },
  okText: {
    color: Colors.product900,
    fontSize: 14,
    fontFamily: Fonts.Medium,
  },
});
