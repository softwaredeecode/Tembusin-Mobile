import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // pastikan sudah install: npm i react-native-vector-icons

// theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

const TextInputComponent = ({
  title,
  placeholder,
  inputType,
  value,
  setValue,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder={placeholder}
          style={[styles.textInput, { flex: 1 }]}
          secureTextEntry={inputType === 'password' && !showPassword}
          value={value}
          onChangeText={text => setValue(text)}
          placeholderTextColor={Colors.neutral400}
        />

        {inputType === 'password' && (
          <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
            <Icon
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color={Colors.neutral500}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({
  title: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 6,
    backgroundColor: Colors.neutral50,
    paddingHorizontal: 12,
  },
  textInput: {
    paddingVertical: 8,
    fontFamily: Fonts.Regular,
    fontSize: 14,
    color: Colors.neutral900,
  },
});
