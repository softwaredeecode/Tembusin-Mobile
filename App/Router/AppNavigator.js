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
import RegisterChooseAccountPage from '../Containers/Auth/RegisterChooseAccountPage';
import RegisterAccountPage from '../Containers/Auth/RegisterAccountPage';
import RegisterCPNSPage from '../Containers/Auth/RegisterCPNSPage';
import RegisterPTNPage from '../Containers/Auth/RegisterPTNPage';
import RegisterCompleteDataPage from '../Containers/Auth/RegisterCompleteDataPage';

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
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default AppNavigator;
