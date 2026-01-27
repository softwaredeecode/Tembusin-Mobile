import * as ActionTypes from '../Constants/Types';
import { BASE_URL, TRYOUT } from '../../Api/GlobalUrl';

export const GetAllTryOutData = (token, params = {}) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_ALL_TRYOUT_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const queryString = new URLSearchParams(params).toString();

      const baseUrl = `${BASE_URL}${TRYOUT.allTryOut}${
        queryString ? `?${queryString}` : ''
      }`;

      console.log('--- GET_ALL_TRYOUT_DATA_REQUEST ---');
      console.log('URL:', baseUrl);

      const response = await fetch(baseUrl, {
        method: 'GET',
        signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      clearTimeout(timeoutId);

      const body = await response.json();

      const allTryoutData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', allTryoutData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_ALL_TRYOUT_DATA_FAILED,
          payload: allTryoutData,
        });
      }

      dispatch({
        type: ActionTypes.GET_ALL_TRYOUT_DATA_SUCCESS,
        payload: allTryoutData,
        meta: {
          page: allTryoutData.data.page,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_ALL_TRYOUT_DATA_FAILED,
        error: error.message,
      });
    }
  };
};