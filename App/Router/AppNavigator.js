import React from 'react';
import { Dimensions, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { enableScreens } from 'react-native-screens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// theme
import { Colors } from '../Theme/Colors';

// Auth Screens
import OnBoardingPage from '../Containers/Auth/OnBoardingPage';
import LoginPage from '../Containers/Auth/LoginPage';
import RegisterChooseAccountPage from '../Containers/Auth/RegisterChooseAccountPage';
import RegisterAccountPage from '../Containers/Auth/RegisterAccountPage';
import RegisterCPNSPage from '../Containers/Auth/RegisterCPNSPage';
import RegisterPTNPage from '../Containers/Auth/RegisterPTNPage';
import RegisterCompleteDataPage from '../Containers/Auth/RegisterCompleteDataPage';

// Bottom Tab Screens
import HomePage from '../Containers/BottomTabNavigator/HomePage';
import ForumPage from '../Containers/BottomTabNavigator/ForumPage';
import ProductPage from '../Containers/BottomTabNavigator/ProductPage';
import AccountPage from '../Containers/BottomTabNavigator/AccountPage';

enableScreens();

const AppNavigator = () => {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
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

  const TabBar = () => {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <Tab.Navigator
          initialRouteName="HomePage"
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
            tabBarStyle: {
              height: 52 + insets.bottom,
              paddingBottom: insets.bottom,
              paddingTop: 10,
              backgroundColor: Colors.white,
              borderTopWidth: 1,
              borderTopColor: Colors.neutral200,
              elevation: 0,
              shadowOpacity: 0,
              position: 'absolute',
            },
          }}
        >
          {/* HOME */}
          <Tab.Screen
            name="HomePage"
            component={HomePage}
            options={{
              tabBarIcon: ({ focused }) => (
                <View
                  style={{
                    width: 32,
                    height: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <Ionicons
                    name="home-outline"
                    size={24}
                    color={focused ? Colors.product900 : Colors.neutral400}
                  />

                  {focused && (
                    <View
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 5,
                        backgroundColor: Colors.warning500,
                        position: 'absolute',
                        bottom: -3,
                      }}
                    />
                  )}
                </View>
              ),
            }}
          />

          {/* FORUM */}
          <Tab.Screen
            name="ForumPage"
            component={ForumPage}
            options={{
              tabBarIcon: ({ focused }) => (
                <View
                  style={{
                    width: 32,
                    height: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={24}
                    color={focused ? Colors.product900 : Colors.neutral400}
                  />

                  {focused && (
                    <View
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 5,
                        backgroundColor: Colors.warning500,
                        position: 'absolute',
                        bottom: -3,
                      }}
                    />
                  )}
                </View>
              ),
            }}
          />

          {/* PRODUCT */}
          <Tab.Screen
            name="ProductPage"
            component={ProductPage}
            options={{
              tabBarIcon: ({ focused }) => (
                <View
                  style={{
                    width: 32,
                    height: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <MaterialCommunityIcons
                    name="crown-outline"
                    size={26}
                    color={focused ? Colors.product900 : Colors.neutral400}
                  />

                  {focused && (
                    <View
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 5,
                        backgroundColor: Colors.warning500,
                        position: 'absolute',
                        bottom: -3,
                      }}
                    />
                  )}
                </View>
              ),
            }}
          />

          {/* PRODUCT */}
          <Tab.Screen
            name="AccountPage"
            component={AccountPage}
            options={{
              tabBarIcon: ({ focused }) => (
                <View
                  style={{
                    width: 32,
                    height: 32,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                  }}
                >
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color={focused ? Colors.product900 : Colors.neutral400}
                  />

                  {focused && (
                    <View
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: 5,
                        backgroundColor: Colors.warning500,
                        position: 'absolute',
                        bottom: -3,
                      }}
                    />
                  )}
                </View>
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
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

          {/* Bottom Tab */}
          <Stack.Screen
            name="BottomTabNavigator"
            component={TabBar}
            options={horizontalAnimation}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default AppNavigator;
