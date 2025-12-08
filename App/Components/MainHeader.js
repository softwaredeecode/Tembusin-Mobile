import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

//theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

const MainHeader = ({
  title = '',
  showBack = true,
  onBackPress,
  rightComponent = null,
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) return onBackPress();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* LEFT */}
      {showBack ? (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons
            name="arrow-back"
            size={20}
            color={Colors.neutral900}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {/* TITLE */}
      {title !== '' && (
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerText}>{title}</Text>
        </View>
      )}

      {/* RIGHT */}
      <View style={styles.rightContainer}>
        {rightComponent ? rightComponent : <View style={styles.placeholder} />}
      </View>
    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 36,
    height: 36,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
