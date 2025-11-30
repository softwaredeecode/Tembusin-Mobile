import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../Theme/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomePage from '../Containers/BottomTabNavigator/HomePage';
import ForumPage from '../Containers/BottomTabNavigator/ForumPage';
import ProductPage from '../Containers/BottomTabNavigator/ProductPage';
import AccountPage from '../Containers/BottomTabNavigator/AccountPage';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 52,
          paddingTop: 10,
          paddingBottom: 65,
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
            <IconWrapper>
              <Ionicons
                name="home-outline"
                size={24}
                color={focused ? Colors.product900 : Colors.neutral400}
              />
            </IconWrapper>
          ),
        }}
      />

      {/* FORUM */}
      <Tab.Screen
        name="ForumPage"
        component={ForumPage}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconWrapper>
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={focused ? Colors.product900 : Colors.neutral400}
              />
            </IconWrapper>
          ),
        }}
      />

      {/* PRODUCT */}
      <Tab.Screen
        name="ProductPage"
        component={ProductPage}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconWrapper>
              <MaterialCommunityIcons
                name="crown-outline"
                size={26}
                color={focused ? Colors.product900 : Colors.neutral400}
              />
            </IconWrapper>
          ),
        }}
      />

      {/* ACCOUNT */}
      <Tab.Screen
        name="AccountPage"
        component={AccountPage}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconWrapper>
              <Ionicons
                name="person-outline"
                size={24}
                color={focused ? Colors.product900 : Colors.neutral400}
              />
            </IconWrapper>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const IconWrapper = ({ children }) => (
  <View
    style={{
      width: 32,
      height: 32,
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {children}
  </View>
);

export default MainNavigator;
