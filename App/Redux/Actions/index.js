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
};
