import {
  PostRegister,
  RegisterVerifyOtp,
  RegisterResendOtp,
} from './PostRegister';
import { Login } from './Login';
import {
  GetMaterialCollectionData,
  GetMyMaterialCollectionData,
  GetMaterialCollectionDetailData,
  PurchaseMaterialCollection,
  GetMaterialDetailData,
  GetLastReadMaterialCollectionDetailData,
} from './Material';
import {
  GetLatestForumData,
  GetTrendingForumData,
  GetComments,
  AddComments,
  AddPost,
} from './Forum';
import { GetProductList } from './Product';
import {
  GetAllExercisesSetData,
  GetMyExercisesSetData,
  GetExercisesSetDetailData,
  GetExercisesDetailContent,
  StartNewAttempt,
  SubmitAnswer,
  SubmitAttempt,
  GetAttemptList,
  GetComingSoonExercise,
} from './Exercises';
import { GetAllTryOutData } from './TryOut';

export const ActionStudent = {
  PostRegister,
  RegisterVerifyOtp,
  RegisterResendOtp,
  Login,
  GetLatestForumData,
  GetTrendingForumData,
  GetComments,
  AddComments,
  AddPost,
  GetMaterialCollectionData,
  GetMyMaterialCollectionData,
  GetMaterialCollectionDetailData,
  PurchaseMaterialCollection,
  GetMaterialDetailData,
  GetLastReadMaterialCollectionDetailData,
  GetProductList,
  GetAllExercisesSetData,
  GetMyExercisesSetData,
  GetExercisesSetDetailData,
  GetExercisesDetailContent,
  StartNewAttempt,
  SubmitAnswer,
  SubmitAttempt,
  GetAttemptList,
  GetComingSoonExercise,
  GetAllTryOutData,
};
