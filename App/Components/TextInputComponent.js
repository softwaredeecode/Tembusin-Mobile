import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

const TextInputComponent = ({
  title,
  placeholder,
  inputType,
  keyboardType,
  value,
  setValue,
  disabled,
  leftIcon,
  autoCapitalize = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <Text style={styles.title}>{title}</Text>

      <View
        style={[
          styles.inputContainer,
          disabled && styles.inputContainerDisabled,
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            <Icon
              name={leftIcon}
              size={20}
              color={disabled ? Colors.neutral500 : Colors.neutral900}
            />
          </View>
        )}
        <TextInput
          editable={!disabled}
          placeholder={placeholder}
          style={[styles.textInput, disabled && styles.disabledTextInput]}
          secureTextEntry={inputType === 'password' && !showPassword}
          value={value}
          onChangeText={text => setValue(text)}
          placeholderTextColor={Colors.neutral400}
          keyboardType={keyboardType}
          autoCapitalize={!autoCapitalize ? 'none' : null}
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
  leftIconContainer: {
    marginRight: 8,
  },
  inputContainerDisabled: {
    backgroundColor: Colors.neutral100,
  },
  textInput: {
    paddingVertical: 8,
    fontFamily: Fonts.Regular,
    fontSize: 14,
    color: Colors.neutral900,
    flex: 1,
  },
  disabledTextInput: {
    color: Colors.neutral500,
  },
});
