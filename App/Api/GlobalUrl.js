export const BASE_URL = 'https://be-tembusin.deecodesoftware.com/api';

export const AUTH = {
  register: '/register',
  verifyOtpRegister: '/register/verify',
  resendOtpRegister: '/register/resend-otp',
  login: '/login',
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
}

export const EXERCISES = {
  allExercisesSet: '/student/practice-sets/paginated',
  myExercisesSet: '/student/my-practice-sets/paginated',
  exercisesSetDetail: '/student/practice-sets',
}

export const TRYOUT = {
  allTryOut: '/student/tryouts/paginated',
}

export const PRODUCT = {
  productList: '/student/products'
}
