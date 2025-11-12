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
  const [tempDate, setTempDate] = useState(value ? new Date(value) : new Date());

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) setTempDate(selectedDate);
  };

  const handleDone = () => {
    // Format date to DD MMM YYYY
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${tempDate.getDate()} ${months[tempDate.getMonth()]} ${tempDate.getFullYear()}`;

    setValue(formattedDate);
    setShowPicker(false);
  };

  const displayText = value || placeholder || '00/00/0000';
  const isPlaceholder = !value;

  return (
    <View>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.inputContainer}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.textValue,
            isPlaceholder && styles.placeholderText,
          ]}
        >
          {displayText}
        </Text>

        <Icon name="calendar-outline" size={20} color={Colors.neutral500} />
      </TouchableOpacity>

      {/* Modal custom */}
      <Modal visible={showPicker} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
              onChange={handleDateChange}
            />

            <TouchableOpacity
              onPress={handleDone}
              style={styles.doneButton}
              activeOpacity={0.8}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
