import * as ActionTypes from '../Constants/Types';
import { BASE_URL, FORUM } from '../../Api/GlobalUrl';

export const GetLatestForumData = (payload, token) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_LATEST_FORUM_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 15 detik timeout

    try {
      const baseUrl = `${BASE_URL}${FORUM.latest}`;
      const queryString = new URLSearchParams(payload).toString();
      const url = `${baseUrl}?${queryString}`;

      console.log('--- GET_LATEST_FORUM_DATA_REQUEST ---');
      console.log('URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      clearTimeout(timeoutId);

      console.log('Status Code:', response.status);
      const body = await response.json();
      const latestForumData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };
      console.log('Response Body:', latestForumData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_LATEST_FORUM_DATA_FAILED,
          payload: { latestForumData },
        });
      }

      dispatch({
        type: ActionTypes.GET_LATEST_FORUM_DATA_SUCCESS,
        payload: { latestForumData },
      });
    } catch (error) {
      console.error('--- GET_LATEST_FORUM_DATA_FAILED ---');
      console.error('ERROR MESSAGE:', error.message);
      console.error('--- END GET_LATEST_FORUM_DATA_FAILED ---');

      dispatch({
        type: ActionTypes.GET_LATEST_FORUM_DATA_FAILED,
        error: error.message,
      });
    }
  };
};

export const GetTrendingForumData = (payload, token) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_TRENDING_FORUM_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 15 detik timeout

    try {
      const baseUrl = `${BASE_URL}${FORUM.trending}`;
      const queryString = new URLSearchParams(payload).toString();
      const url = `${baseUrl}?${queryString}`;

      console.log('--- GET_TRENDING_FORUM_DATA_REQUEST ---');
      console.log('URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      clearTimeout(timeoutId);

      console.log('Status Code:', response.status);
      const body = await response.json();
      const trendingForumData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };
      console.log('Response Body:', trendingForumData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_TRENDING_FORUM_DATA_FAILED,
          payload: { trendingForumData },
        });
      }

      dispatch({
        type: ActionTypes.GET_TRENDING_FORUM_DATA_SUCCESS,
        payload: { trendingForumData },
      });
    } catch (error) {
      console.error('--- GET_TRENDING_FORUM_DATA_FAILED ---');
      console.error('ERROR MESSAGE:', error.message);
      console.error('--- END GET_TRENDING_FORUM_DATA_FAILED ---');

      dispatch({
        type: ActionTypes.GET_TRENDING_FORUM_DATA_FAILED,
        error: error.message,
      });
    }
  };
};

export const GetComments = (postId, payload, token) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_COMMENTS_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 15 detik timeout

    try {
      const baseUrl = `${BASE_URL}${FORUM.comments(postId)}`;
      const queryString = new URLSearchParams(payload).toString();
      const url = `${baseUrl}?${queryString}`;

      console.log('--- GET_COMMENTS_REQUEST ---');
      console.log('URL:', url);
      console.log('PAYLOAD:', payload);

      const response = await fetch(url, {
        method: 'GET',
        signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      clearTimeout(timeoutId);

      console.log('Status Code:', response.status);

      const body = await response.json(); // ARRAY
      const comments = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', comments);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_COMMENTS_FAILED,
          payload: { comments },
        });
      }

      // ⬇️ INI SATU-SATUNYA PENYESUAIAN
      dispatch({
        type: ActionTypes.GET_COMMENTS_SUCCESS,
        payload: {
          comments: comments, // ARRAY untuk reducer
        },
      });

      return comments
    } catch (error) {
      console.error('--- GET_COMMENTS_FAILED ---');
      console.error('ERROR MESSAGE:', error.message);
      console.error('--- END GET_COMMENTS_FAILED ---');

      dispatch({
        type: ActionTypes.GET_COMMENTS_FAILED,
        error: error.message,
      });
    }
  };
};

export const AddComments = (payload, token) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.ADD_COMMENT_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 15 detik timeout

    try {
      const url = `${BASE_URL}${FORUM.addComment}`;

      console.log('--- ADD_COMMENT_REQUEST ---');
      console.log('URL:', url);
      console.log('BODY PAYLOAD:', payload);

      const response = await fetch(url, {
        method: 'POST',
        signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      clearTimeout(timeoutId);

      console.log('Status Code:', response.status);

      const body = await response.json();
      const result = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      if (!response.ok) {
        dispatch({
          type: ActionTypes.ADD_COMMENT_FAILED,
          payload: result,
        });

        return result;
      }

      dispatch({
        type: ActionTypes.ADD_COMMENT_SUCCESS,
        payload: { addComment: result },
      });

      return result;
    } catch (error) {
      console.error('--- ADD_COMMENT_FAILED ---');
      console.error('ERROR MESSAGE:', error.message);
      console.error('--- END ADD_COMMENT_FAILED ---');

      dispatch({
        type: ActionTypes.ADD_COMMENT_FAILED,
        error: error.message,
      });
    }
  };
};

export const AddPost = (payload, token) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.ADD_POST_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 15 detik timeout

    try {
      const url = `${BASE_URL}${FORUM.addPost}`;

      console.log('--- ADD_POST_REQUEST ---');
      console.log('URL:', url);
      console.log('BODY PAYLOAD:', payload);

      const response = await fetch(url, {
        method: 'POST',
        signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: payload,
      });

      clearTimeout(timeoutId);

      console.log('Status Code:', response.status);

      const body = await response.json();
      const result = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      if (!response.ok) {
        dispatch({
          type: ActionTypes.ADD_POST_FAILED,
        });

        return result;
      }

      dispatch({
        type: ActionTypes.ADD_POST_SUCCESS,
      });

      return result;
    } catch (error) {
      console.error('--- ADD_POST_FAILED ---');
      console.error('ERROR MESSAGE:', error.message);
      console.error('--- END ADD_POST_FAILED ---');

      dispatch({
        type: ActionTypes.ADD_POST_FAILED,
        error: error.message,
      });
    }
  };
};
