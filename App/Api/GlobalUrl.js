export const BASE_URL = 'https://be-tembusin.deecodesoftware.com/api';

export const AUTH = {
  register: '/register',
  login: '/login',
};

export const FORUM = {
  latest: '/posts/latest',
  trending: '/posts/trending',
  comments: (id) => `/posts/${id}/comments`,
  addComment: '/comments',
  addPost: '/posts'
};
