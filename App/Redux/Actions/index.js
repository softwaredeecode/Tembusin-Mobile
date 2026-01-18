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
} from './Material';
import {
  GetLatestForumData,
  GetTrendingForumData,
  GetComments,
  AddComments,
  AddPost,
} from './Forum';
import { GetProductList } from './Product';
import { GetAllExercisesSetData, GetMyExercisesSetData, GetExercisesSetDetailData } from './Exercises';

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
  GetProductList,
  GetAllExercisesSetData,
  GetMyExercisesSetData,
  GetExercisesSetDetailData
};
