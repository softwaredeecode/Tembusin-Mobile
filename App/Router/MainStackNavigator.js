import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainNavigator from './MainNavigator';
import MaterialPage from '../Containers/Home/Materi/MaterialPage';
import AllMaterialPage from '../Containers/Home/Materi/AllMaterialPage';
import MyMaterialPage from '../Containers/Home/Materi/MyMaterialPage';
import ExercisesPage from '../Containers/Home/Exercises/ExercisesPage';
import MyExercisesPage from '../Containers/Home/Exercises/MyExercisesPage';
import AllExercisesPage from '../Containers/Home/Exercises/AllExercisesPage';
import DetailPurchasesExercises from '../Containers/Home/Exercises/DetailPurchaseExercises';
import DetailStartExercises from '../Containers/Home/Exercises/DetailStartExercises';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainNavigator} />
      <Stack.Screen name="MaterialPage" component={MaterialPage} />
      <Stack.Screen name="AllMaterialPage" component={AllMaterialPage} />
      <Stack.Screen name="MyMaterialPage" component={MyMaterialPage} />
      <Stack.Screen name="ExercisesPage" component={ExercisesPage} />
      <Stack.Screen name="MyExercisesPage" component={MyExercisesPage} />
      <Stack.Screen name="AllExercisesPage" component={AllExercisesPage} />
      <Stack.Screen name="DetailPurchasesExercises" component={DetailPurchasesExercises} />
      <Stack.Screen name="DetailStartExercises" component={DetailStartExercises} />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
