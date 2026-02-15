import React, { useEffect, useState, useMemo } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';

import { Colors } from '../Theme/Colors';
import AuthNavigator from './AuthNavigator';
import MainStackNavigator from './MainStackNavigator';
import { AuthContext } from '../Context/AuthContext';

const RootNavigator = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);

  useEffect(() => {
    const bootstrap = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      setIsLoggedIn(!!token);
    };
    bootstrap();
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async () => {
        const token = await AsyncStorage.getItem('auth_token');
        setIsLoggedIn(!!token);
      },
      signOut: async () => {
        await AsyncStorage.clear();
        dispatch({ type: 'AUTH/LOGOUT' });
        setIsLoggedIn(false);
      },
    }),
    [],
  );

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.product900} />
      </View>
    );
  }

  const isInMainTabs = isLoggedIn && currentRoute === 'MainTabs';

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isInMainTabs ? Colors.product900 : Colors.white,
        paddingTop: insets.top,
        paddingBottom: isLoggedIn ? 0 : insets.bottom,
      }}
    >
      <AuthContext.Provider value={authContext}>
        <NavigationContainer
          onStateChange={state => {
            const route = state.routes[state.index];
            setCurrentRoute(route.name);
          }}
        >
          {isLoggedIn ? <MainStackNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </AuthContext.Provider>
    </View>
  );
};

export default RootNavigator;
