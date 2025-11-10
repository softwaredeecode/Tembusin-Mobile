// AppNavigator.js
import React from 'react';
import { Dimensions, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

//screen
import OnBoardingPage from '../Containers/Auth/OnBoardingPage';
import LoginPage from '../Containers/Auth/LoginPage';
import RegisterPage from '../Containers/Auth/RegisterPage';

enableScreens();

const AppNavigator = () => {
  const Stack = createStackNavigator();
  const width = Dimensions.get('screen').width;
  const insets = useSafeAreaInsets();

  const horizontalAnimation = {
    cardStyleInterpolator: ({ current }) => ({
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [width, 0],
            }),
          },
        ],
      },
    }),
  };

  return (
    <View
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="OnBoardingPage"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="OnBoardingPage"
            component={OnBoardingPage}
            options={horizontalAnimation}
          />
          <Stack.Screen
            name="LoginPage"
            component={LoginPage}
            options={horizontalAnimation}
          />
          <Stack.Screen
            name="RegisterPage"
            component={RegisterPage}
            options={horizontalAnimation}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default AppNavigator;
