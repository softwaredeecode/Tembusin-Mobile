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

// theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

const DatePickerField = ({
  label,
  placeholder = 'Pilih tanggal',
  value,
  onChange,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const openPicker = () => {
    if (Platform.OS === 'android') {
      setShowPicker(true);
    } else {
      setShowPicker(true);
    }
  };

  const handleAndroidChange = (event, selectedDate) => {
    setShowPicker(false);

    if (event.type === 'set' && selectedDate) {
      onChange(selectedDate);
    }
  };

  const handleIOSConfirm = () => {
    onChange(tempDate);
    setShowPicker(false);
  };

  const displayText = value ? value.toLocaleDateString('id-ID') : placeholder;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={styles.input}
        onPress={openPicker}
        activeOpacity={0.7}
      >
        <Text style={value ? styles.text : styles.placeholder}>
          {displayText}
        </Text>
      </TouchableOpacity>

      {/* ANDROID */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleAndroidChange}
        />
      )}

      {/* IOS */}
      {Platform.OS === 'ios' && (
        <Modal visible={showPicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(e, selected) => {
                  if (selected) setTempDate(selected);
                }}
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.cancelText}>Batal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.okButton}
                  onPress={handleIOSConfirm}
                >
                  <Text style={styles.okText}>Pilih</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
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
