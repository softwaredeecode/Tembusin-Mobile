import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Dimensions } from 'react-native';

import OnBoardingPage from '../Containers/Auth/OnBoardingPage';
import LoginPage from '../Containers/Auth/LoginPage';
import RegisterChooseAccountPage from '../Containers/Auth/RegisterChooseAccountPage';
import RegisterAccountPage from '../Containers/Auth/RegisterAccountPage';
import RegisterCPNSPage from '../Containers/Auth/RegisterCPNSPage';
import RegisterPTNPage from '../Containers/Auth/RegisterPTNPage';
import RegisterCompleteDataPage from '../Containers/Auth/RegisterCompleteDataPage';
import RegisterOTPPage from '../Containers/Auth/RegisterOTPPage';

const Stack = createStackNavigator();
const width = Dimensions.get('screen').width;

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

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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
        name="RegisterChooseAccountPage"
        component={RegisterChooseAccountPage}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="RegisterAccountPage"
        component={RegisterAccountPage}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="RegisterCompleteDataPage"
        component={RegisterCompleteDataPage}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="RegisterCPNSPage"
        component={RegisterCPNSPage}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="RegisterPTNPage"
        component={RegisterPTNPage}
        options={horizontalAnimation}
      />
      <Stack.Screen
        name="RegisterOTPPage"
        component={RegisterOTPPage}
        options={horizontalAnimation}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
