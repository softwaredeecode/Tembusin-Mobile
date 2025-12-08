import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainNavigator from './MainNavigator';
import MaterialPage from '../Containers/Home/Materi/MaterialPage';
import AllMaterialPage from '../Containers/Home/Materi/AllMaterialPage';
import MyMaterialPage from '../Containers/Home/Materi/MyMaterialPage';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainNavigator} />
      <Stack.Screen name="MaterialPage" component={MaterialPage} />
      <Stack.Screen name="AllMaterialPage" component={AllMaterialPage} />
      <Stack.Screen name="MyMaterialPage" component={MyMaterialPage} />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
