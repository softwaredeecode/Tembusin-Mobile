import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';

// theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

const InputDatePicker = ({ title, value, setValue, placeholder }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(
    value ? new Date(value) : new Date(),
  );

  const formatDate = date => {
    if (!date) return '';

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  const onChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && selectedDate) {
        setValue(formatDate(selectedDate));
      }
    } else {
      if (selectedDate) setTempDate(selectedDate);
    }
  };

  const handleDone = () => {
    setValue(formatDate(tempDate));
    setShowPicker(false);
  };

  return (
    <View>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.inputContainer}
        activeOpacity={0.7}
      >
        <Text style={[styles.textValue, !value && styles.placeholderText]}>
          {value || placeholder || '00/00/0000'}
        </Text>
        <Icon name="calendar-outline" size={20} color={Colors.neutral500} />
      </TouchableOpacity>

      {/* iOS: custom modal */}
      {showPicker && Platform.OS === 'ios' && (
        <Modal transparent animationType="slide">
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={onChange}
              />
              <TouchableOpacity onPress={handleDone} style={styles.doneButton}>
                <Text style={styles.doneText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Android: native dialog */}
      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="calendar"
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default InputDatePicker;

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.neutral900,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 6,
    backgroundColor: Colors.neutral50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  textValue: {
    flex: 1,
    fontFamily: Fonts.Regular,
    fontSize: 14,
    color: Colors.neutral900,
  },
  placeholderText: {
    color: Colors.neutral400,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  doneButton: {
    marginTop: 16,
    backgroundColor: Colors.primary500,
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  doneText: {
    color: Colors.product900,
    fontFamily: Fonts.Medium,
    fontSize: 16,
  },
});
