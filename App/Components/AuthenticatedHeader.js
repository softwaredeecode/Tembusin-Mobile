import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

//theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

const AuthenticatedHeader = ({ title, includeSearch = false, handleSearchClicked }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerText}>{title}</Text>
      </View>

      {includeSearch && (
        <TouchableOpacity onPress={handleSearchClicked}>
          <Ionicons name={'search'} size={18} color={Colors.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AuthenticatedHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.product900,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
});
