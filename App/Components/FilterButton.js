import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

//theme
import { Colors } from '../Theme/Colors';

const FilterButton = ({onPress}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Ionicons name="options-outline" size={16} color={Colors.neutral500} />
    </TouchableOpacity>
  );
};

export default FilterButton;

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
});
