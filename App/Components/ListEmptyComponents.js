import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

const ListEmptyComponent = ({ title, desc, iconName }) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialCommunityIcons
          name={iconName}
          size={24}
          color={Colors.neutral500}
        />
      </View>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.descText}>{desc}</Text>
    </View>
  );
};

export default ListEmptyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 64,
    marginHorizontal: 16,
  },
  iconContainer: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.neutral300,
    backgroundColor: Colors.neutral100,
    borderRadius: 8,
  },
  titleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
    marginBottom: 6,
    marginTop: 20,
    textAlign: 'center',
  },
  descText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
    textAlign: 'center',
  },
});
