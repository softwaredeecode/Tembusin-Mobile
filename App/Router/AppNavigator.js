import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//redux
import { useSelector } from 'react-redux';

//theme
import { Colors } from '../Theme/Colors';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const RootNavigator = () => {
  const insets = useSafeAreaInsets();
  const { loginResponse } = useSelector(state => state.login);

  const isLoggedIn = !!loginResponse?.data?.token;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isLoggedIn ? Colors.product900 : Colors.neutral50,
        paddingTop: insets.top,
        paddingBottom: isLoggedIn ? 0 : insets.bottom,
      }}
    >
      <NavigationContainer>
        {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </View>
  );
};

export default RootNavigator;
