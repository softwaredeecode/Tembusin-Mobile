import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

import { Colors } from '../Theme/Colors';

import AuthNavigator from './AuthNavigator';
import MainStackNavigator from './MainStackNavigator';

const RootNavigator = () => {
  const insets = useSafeAreaInsets();
  const { loginResponse } = useSelector(state => state.login);

  const isLoggedIn = !!loginResponse?.data?.token;

  const [currentRoute, setCurrentRoute] = React.useState(null);

  const isInMainTabs =
    isLoggedIn && currentRoute === 'MainTabs';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isInMainTabs ? Colors.product900 : Colors.white,
        paddingTop: insets.top,
        paddingBottom: isLoggedIn ? 0 : insets.bottom,
      }}
    >
      <NavigationContainer
        onStateChange={state => {
          const route = state.routes[state.index];
          setCurrentRoute(route.name);
        }}
      >
        {isLoggedIn ? <MainStackNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </View>
  );
};

export default RootNavigator;
