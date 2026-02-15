import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';

//theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

const SearchHeader = ({
  value,
  onChangeText,
  placeholder = 'Cari di sini...',
  showBack = true,
  onBackPress,
  rightComponent = null,
  noBack = false,
  autoFocus = false,
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    }
    if (!noBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {/* LEFT: Back Button */}
      {showBack ? (
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.neutral900}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.leftPlaceholder} />
      )}

      {/* CENTER: Search Box */}
      <View style={styles.searchContainer}>
        <MaterialIcons 
          name="search" 
          size={20} 
          color={Colors.neutral500} 
          style={styles.searchIcon} 
        />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={Colors.neutral500}
          value={value}
          onChangeText={onChangeText}
          autoFocus={autoFocus}
          returnKeyType="search"
        />
        {value?.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')}>
            <MaterialIcons name="cancel" size={18} color={Colors.neutral400} />
          </TouchableOpacity>
        )}
      </View>

      {/* RIGHT: Optional Component */}
      {rightComponent && (
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      )}
    </View>
  );
};

export default SearchHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2, // Opsional: memberi sedikit bayangan
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  leftPlaceholder: {
    width: 8, // Sedikit jarak jika tombol back absen
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.neutral100, // Pastikan warna ini ada di theme kamu
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.Regular,
    fontSize: 14,
    color: Colors.neutral900,
    paddingVertical: 0, // Penting untuk Android agar text tidak terpotong
  },
  rightContainer: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});