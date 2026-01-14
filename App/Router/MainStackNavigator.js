import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import MainNavigator from './MainNavigator';
import MaterialPage from '../Containers/Home/Materi/MaterialPage';
import AllMaterialPage from '../Containers/Home/Materi/AllMaterialPage';
import MyMaterialPage from '../Containers/Home/Materi/MyMaterialPage';
import MaterialDetailPage from '../Containers/Home/Materi/MaterialDetailPage';
import PurchaseMaterialDetailPage from '../Containers/Home/Materi/PurchaseMaterialDetailPage';
import StartMaterialPage from '../Containers/Home/Materi/StartMaterialPage';
import StartMaterialDetailPage from '../Containers/Home/Materi/StartMaterialDetailPage';
import ExercisesPage from '../Containers/Home/Exercises/ExercisesPage';
import MyExercisesPage from '../Containers/Home/Exercises/MyExercisesPage';
import AllExercisesPage from '../Containers/Home/Exercises/AllExercisesPage';
import DetailPurchasesExercises from '../Containers/Home/Exercises/DetailPurchaseExercises';
import DetailStartExercises from '../Containers/Home/Exercises/DetailStartExercises';
import TryOutPage from '../Containers/Home/TryOut/TryOutPage';
import AllTryOutPage from '../Containers/Home/TryOut/AllTryOutPage';
import MyTryOutPage from '../Containers/Home/TryOut/MyTryOutPage';
import DetailPurchaseTryOut from '../Containers/Home/TryOut/DetailPurchaseTryOut';
import DetailStartTryOut from '../Containers/Home/TryOut/DetailStartTryOut';
import ForumDetailPage from '../Containers/Forum/ForumDetailPage';
import AddCommentPage from '../Containers/Forum/AddCommentPage';
import AddPostPage from '../Containers/Forum/AddPostPage';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainNavigator} />
      <Stack.Screen name="MaterialPage" component={MaterialPage} />
      <Stack.Screen name="AllMaterialPage" component={AllMaterialPage} />
      <Stack.Screen name="MyMaterialPage" component={MyMaterialPage} />
      <Stack.Screen name="MaterialDetailPage" component={MaterialDetailPage} />
      <Stack.Screen name="PurchaseMaterialDetailPage" component={PurchaseMaterialDetailPage} />
      <Stack.Screen name="StartMaterialPage" component={StartMaterialPage} />
      <Stack.Screen name="StartMaterialDetailPage" component={StartMaterialDetailPage} />

      <Stack.Screen name="ExercisesPage" component={ExercisesPage} />
      <Stack.Screen name="MyExercisesPage" component={MyExercisesPage} />
      <Stack.Screen name="AllExercisesPage" component={AllExercisesPage} />
      <Stack.Screen
        name="DetailPurchasesExercises"
        component={DetailPurchasesExercises}
      />
      <Stack.Screen
        name="DetailStartExercises"
        component={DetailStartExercises}
      />
      <Stack.Screen name="TryOutPage" component={TryOutPage} />
      <Stack.Screen name="AllTryOutPage" component={AllTryOutPage} />
      <Stack.Screen name="MyTryOutPage" component={MyTryOutPage} />
      <Stack.Screen
        name="DetailPurchaseTryOut"
        component={DetailPurchaseTryOut}
      />
      <Stack.Screen name="DetailStartTryOut" component={DetailStartTryOut} />
      <Stack.Screen
        name="ForumDetailPage"
        component={ForumDetailPage}
        options={{ animation: 'none' }}
      />
      <Stack.Screen name="AddCommentPage" component={AddCommentPage} />
      <Stack.Screen
        name="AddPostPage"
        component={AddPostPage}
        options={{ animation: 'none' }}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
