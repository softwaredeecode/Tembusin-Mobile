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
import ThankyouPageMaterial from '../Containers/Home/Materi/ThankyouPageMaterial';
import ExercisesPage from '../Containers/Home/Exercises/ExercisesPage';
import MyExercisesPage from '../Containers/Home/Exercises/MyExercisesPage';
import AllExercisesPage from '../Containers/Home/Exercises/AllExercisesPage';
import DetailPurchasesExercises from '../Containers/Home/Exercises/DetailPurchaseExercises';
import StartExercisesPage from '../Containers/Home/Exercises/StartExercisesPage';
import StartExercisesDetailPage from '../Containers/Home/Exercises/StartExecisesDetailPage';
import ConfirmationSubmitExercisesPage from '../Containers/Home/Exercises/ConfirmationSubmitExercisesPage';
import ExercisesResultPage from '../Containers/Home/Exercises/ExercisesResultPage';
import ResultReviewDetailPage from '../Containers/Home/Exercises/ResultReviewDetailPage';
import ExerciseGuidelinePage from '../Containers/Home/Exercises/ExerciseGuidelinePage';
import ReviewExercisePage from '../Containers/Home/Exercises/ReviewExercisePage';
import ThankyouPageExercises from '../Containers/Home/Exercises/ThankyouPageExercises';
import TryOutPage from '../Containers/Home/TryOut/TryOutPage';
import AllTryOutPage from '../Containers/Home/TryOut/AllTryOutPage';
import MyTryOutPage from '../Containers/Home/TryOut/MyTryOutPage';
import DetailPurchaseTryOut from '../Containers/Home/TryOut/DetailPurchaseTryOut';
import StartTryOut from '../Containers/Home/TryOut/StartTryOut';
import StartDetailTryOutPage from '../Containers/Home/TryOut/StartDetailTryOutPage';
import ThankyouPageTryOut from '../Containers/Home/TryOut/ThankyouPageTryOut';
import TryOutGuidelinePage from '../Containers/Home/TryOut/TryOutGuidelinePage';
import ConfirmationSubmitTryoutPage from '../Containers/Home/TryOut/ConfirmationSubmitTryoutPage';
import TryOutResultPage from '../Containers/Home/TryOut/TryOutResultPage';
import ResultReviewDetailTryOutPage from '../Containers/Home/TryOut/ResultReviewDetailTryOutPage';
import ReviewTryOutPage from '../Containers/Home/TryOut/ReviewTryOutPage';
import ForumDetailPage from '../Containers/Forum/ForumDetailPage';
import ForumSearchPage from '../Containers/Forum/ForumSearchPage';
import AddCommentPage from '../Containers/Forum/AddCommentPage';
import AddPostPage from '../Containers/Forum/AddPostPage';
import ProductDetailPurchasePage from '../Containers/Product/ProductDetailPurchasePage';
import ProductPaymentCurrencyStatusPage from '../Containers/Product/ProductPaymentCurrencyStatusPage';
import ProductPaymentTokenStatusPage from '../Containers/Product/ProductPaymentTokenStatusPage';
import LeaderboardTryoutPage from '../Containers/Home/TryOut/LeaderboardTryoutPage';
import LeaderboardExercisePage from '../Containers/Home/Exercises/LeaderboardExercisePage';
import PrivacyPolicy from '../Containers/AccountSetting/PrivacyPolicy';
import TermsCondition from '../Containers/AccountSetting/TermsCondition';
import MyPost from '../Containers/AccountSetting/MyPost';
import EvaluationTryOutPage from '../Containers/AccountSetting/EvaluationTryOutPage';

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainNavigator} />
      <Stack.Screen name="MaterialPage" component={MaterialPage} />
      <Stack.Screen name="AllMaterialPage" component={AllMaterialPage} />
      <Stack.Screen name="MyMaterialPage" component={MyMaterialPage} />
      <Stack.Screen name="MaterialDetailPage" component={MaterialDetailPage} />
      <Stack.Screen
        name="PurchaseMaterialDetailPage"
        component={PurchaseMaterialDetailPage}
      />
      <Stack.Screen name="StartMaterialPage" component={StartMaterialPage} />
      <Stack.Screen
        name="StartMaterialDetailPage"
        component={StartMaterialDetailPage}
      />
      <Stack.Screen
        name="ThankyouPageMaterial"
        component={ThankyouPageMaterial}
      />

      <Stack.Screen name="ExercisesPage" component={ExercisesPage} />
      <Stack.Screen name="MyExercisesPage" component={MyExercisesPage} />
      <Stack.Screen name="AllExercisesPage" component={AllExercisesPage} />
      <Stack.Screen
        name="LeaderboardExercisePage"
        component={LeaderboardExercisePage}
      />
      <Stack.Screen
        name="DetailPurchasesExercises"
        component={DetailPurchasesExercises}
      />
      <Stack.Screen name="StartExercisesPage" component={StartExercisesPage} />
      <Stack.Screen
        name="StartExercisesDetailPage"
        component={StartExercisesDetailPage}
      />
      <Stack.Screen
        name="ConfirmationSubmitExercisesPage"
        component={ConfirmationSubmitExercisesPage}
      />
      <Stack.Screen
        name="ExercisesResultPage"
        component={ExercisesResultPage}
      />
      <Stack.Screen
        name="ResultReviewDetailPage"
        component={ResultReviewDetailPage}
      />
      <Stack.Screen
        name="ExerciseGuidelinePage"
        component={ExerciseGuidelinePage}
      />
      <Stack.Screen name="ReviewExercisePage" component={ReviewExercisePage} />
      <Stack.Screen
        name="ThankyouPageExercises"
        component={ThankyouPageExercises}
      />
      <Stack.Screen name="TryOutPage" component={TryOutPage} />
      <Stack.Screen name="AllTryOutPage" component={AllTryOutPage} />
      <Stack.Screen name="MyTryOutPage" component={MyTryOutPage} />
      <Stack.Screen
        name="DetailPurchaseTryOut"
        component={DetailPurchaseTryOut}
      />
      <Stack.Screen name="StartTryOut" component={StartTryOut} />
      <Stack.Screen
        name="StartDetailTryOutPage"
        component={StartDetailTryOutPage}
      />
      <Stack.Screen name="ThankyouPageTryOut" component={ThankyouPageTryOut} />
      <Stack.Screen
        name="TryOutGuidelinePage"
        component={TryOutGuidelinePage}
      />
      <Stack.Screen
        name="ConfirmationSubmitTryoutPage"
        component={ConfirmationSubmitTryoutPage}
      />
      <Stack.Screen name="TryOutResultPage" component={TryOutResultPage} />
      <Stack.Screen
        name="ResultReviewDetailTryOutPage"
        component={ResultReviewDetailTryOutPage}
      />
      <Stack.Screen name="ReviewTryOutPage" component={ReviewTryOutPage} />
      <Stack.Screen
        name="ForumDetailPage"
        component={ForumDetailPage}
        options={{ animation: 'none' }}
      />
      <Stack.Screen
        name="ForumSearchPage"
        component={ForumSearchPage}
        options={{ animation: 'none' }}
      />
      <Stack.Screen name="AddCommentPage" component={AddCommentPage} />
      <Stack.Screen
        name="AddPostPage"
        component={AddPostPage}
        options={{ animation: 'none' }}
      />
      <Stack.Screen
        name="ProductDetailPurchasePage"
        component={ProductDetailPurchasePage}
        options={{ animation: 'none' }}
      />
      <Stack.Screen
        name="ProductPaymentCurrencyStatusPage"
        component={ProductPaymentCurrencyStatusPage}
        options={{ animation: 'none' }}
      />
      <Stack.Screen
        name="ProductPaymentTokenStatusPage"
        component={ProductPaymentTokenStatusPage}
        options={{ animation: 'none' }}
      />
      <Stack.Screen
        name="LeaderboardTryoutPage"
        component={LeaderboardTryoutPage}
        options={{ animation: 'none' }}
      />

      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{ animation: 'none' }}
      />
      <Stack.Screen
        name="TermsCondition"
        component={TermsCondition}
        options={{ animation: 'none' }}
      />
      <Stack.Screen
        name="MyPost"
        component={MyPost}
        options={{ animation: 'none' }}
      />
      <Stack.Screen
        name="EvaluationTryOutPage"
        component={EvaluationTryOutPage}
        options={{ animation: 'none' }}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
