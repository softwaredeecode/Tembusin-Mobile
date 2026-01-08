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
} from './Material';
import {
  GetLatestForumData,
  GetTrendingForumData,
  GetComments,
  AddComments,
  AddPost,
} from './Forum';
import { GetProductList } from './Product';

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
  GetProductList,
};
