import * as ActionTypes from '../Constants/Types';
import { BASE_URL, AUTH } from '../../Api/GlobalUrl';

export const PostRegister = (payload) => {
  return async (dispatch) => {
    dispatch({ type: ActionTypes.POST_REGISTER_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000); // 15 detik timeout

    try {
      // Print URL dan request payload
      const url = `${BASE_URL}${AUTH.register}`;
      console.log('--- POST REGISTER REQUEST ---');
      console.log('URL:', url);
      console.log('Request Body:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal,
      });

      clearTimeout(timeoutId);

      console.log('Status Code:', response.status);
      const registerResponse = await response.json();
      console.log('Response Body:', registerResponse);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.POST_REGISTER_FAILED,
          payload: { registerResponse },
        });
      }

      dispatch({
        type: ActionTypes.POST_REGISTER_SUCCESS,
        payload: { registerResponse },
      });
    } catch (error) {
      console.error('--- POST REGISTER ERROR ---');
      console.error('ERROR MESSAGE:', error.message);
      console.error('--- END ERROR ---');

      dispatch({
        type: ActionTypes.POST_REGISTER_FAILED,
        error: error.message,
      });
    }
  };
};
