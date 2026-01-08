import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomePage from '../Containers/BottomTabNavigator/HomePage';
import ForumPage from '../Containers/BottomTabNavigator/ForumPage';
import ProductPage from '../Containers/BottomTabNavigator/ProductPage';
import AccountPage from '../Containers/BottomTabNavigator/AccountPage';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const insets = useSafeAreaInsets();

  const TabLabel = ({ label, focused }) => {
    return (
      <View style={{ alignItems: 'center' }}>
        <Text
          style={{
            fontFamily: Fonts.Regular,
            fontSize: 12,
            lineHeight: 18,
            color: focused ? Colors.product900 : Colors.neutral400,
          }}
        >
          {label}
        </Text>

        {focused && (
          <View
            style={{
              marginTop: 4,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: Colors.warning500,
            }}
          />
        )}
      </View>
    );
  };

  return (
    <Tab.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true, // ✅ WAJIB
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontFamily: Fonts.Regular,
          fontSize: 12,
          lineHeight: 18,
        },
        tabBarActiveTintColor: Colors.product900,
        tabBarInactiveTintColor: Colors.neutral400,
        tabBarStyle: {
          height: 94,
          paddingTop: 6,
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.neutral200,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      {/* HOME */}

      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Home" focused={focused} />
          ),
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
          unmountOnBlur: true,
          animation: 'none',
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Forum" focused={focused} />
          ),
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
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Produk" focused={focused} />
          ),
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
          tabBarLabel: ({ focused }) => (
            <TabLabel label="Profil" focused={focused} />
          ),
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
