export const BASE_URL = 'https://be-tembusin.deecodesoftware.com/api';

export const AUTH = {
  register: '/register',
  verifyOtpRegister: '/register/verify',
  resendOtpRegister: '/register/resend-otp',
  login: '/login',
  forgotPassword: '/forgot-password',
  verifyOtpForgotPassword: '/forgot-password/verify',
  resetPassword: '/forgot-password/reset',
};

export const FORUM = {
  latest: '/posts/latest',
  trending: '/posts/trending',
  comments: (id) => `/posts/${id}/comments`,
  addComment: '/comments',
  addPost: '/posts'
};

export const MATERIAL = {
  materialCollection: '/student/material-collections/paginated',
  myMaterialCollection: '/student/my-materials/paginated',
  materialCollectionDetail: '/student/material-collections',
  buyMaterial: '/student/material-collections',
  materialDetail: '/student/materials',
  lastReadMaterialCollection: '/student/material-collections/last-read'
}

export const EXERCISES = {
  allExercisesSet: '/student/practice-sets/paginated',
  myExercisesSet: '/student/my-practice-sets/paginated',
  exercisesSetDetail: '/student/practice-sets',
  comingSoonExercise: '/student/practice-sets/closest-upcoming',
  buyExercise: '/student/practice-sets',
}

export const TRYOUT = {
  allTryOut: '/student/tryouts/paginated',
  myTryOut: '/student/my-tryouts/paginated',
  tryoutDetail: '/student/tryouts',
  comingSoonTryout: 'student/tryouts/closest-upcoming',
}

export const PRODUCT = {
  productList: '/student/products',
  productDetail: '/student/products',
  historyList: '/transactions/students/paginated',
  checkStatus: '/transactions/students'
}
