import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

const InputDropdown = ({ title, value, setValue, placeholder, options = [] }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const displayText = value || placeholder || 'Pilih opsi';
  const isPlaceholder = !value;

  const handleSelect = (item) => {
    setValue(item);
    setShowDropdown(false);
  };

  return (
    <View>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        onPress={() => setShowDropdown(true)}
        style={styles.inputContainer}
        activeOpacity={0.7}
      >
        <Text
          style={[styles.textValue, isPlaceholder && styles.placeholderText]}
          numberOfLines={1}
        >
          {displayText}
        </Text>

        <Icon
          name="chevron-down-outline"
          size={20}
          color={Colors.neutral500}
        />
      </TouchableOpacity>

      <Modal visible={showDropdown} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  style={[
                    styles.optionItem,
                    value === item && styles.optionItemSelected,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.optionText,
                      value === item && styles.optionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InputDropdown;

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
    paddingVertical: 8,
    paddingHorizontal: 16,
    maxHeight: '60%',
  },
  optionItem: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral100,
  },
  optionItemSelected: {
    backgroundColor: Colors.product50,
  },
  optionText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    color: Colors.neutral900,
  },
  optionTextSelected: {
    color: Colors.product900,
    fontFamily: Fonts.Medium,
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
