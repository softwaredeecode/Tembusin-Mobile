import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

//theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

const CheckboxRow = ({ label, checked, onPress }) => {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.label}>{label}</Text>

      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && (
          <Ionicons name="checkmark" size={14} color={Colors.product900}/>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CheckboxRow;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6
  },

  label: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Fonts.Medium,
    color: Colors.neutral900,
  },

  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.neutral400,
    backgroundColor: Colors.neutral50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  checkboxChecked: {
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
  },
});
