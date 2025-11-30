import * as ActionTypes from '../Constants/Types';
import { BASE_URL, FORUM } from '../../Api/GlobalUrl';

export const GetLatestForumData = (payload, token) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_LATEST_FORUM_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000); // 15 detik timeout

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
    }, 15000); // 15 detik timeout

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
