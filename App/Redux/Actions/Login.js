import * as ActionTypes from '../Constants/Types';
import { BASE_URL, AUTH } from '../../Api/GlobalUrl';

export const Login = payload => {
  return async dispatch => {
    dispatch({ type: ActionTypes.LOGIN_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 15 detik timeout

    try {
      // Print URL dan request payload
      const url = `${BASE_URL}${AUTH.login}`;
      console.log('--- LOGIN REQUEST ---');
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
      const body = await response.json();
      const loginResponse = {
        status: response.status,
        ok: response.ok,
        data: body,
      };
      console.log('Response Body:', loginResponse);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        dispatch({
          type: ActionTypes.LOGIN_FAILED,
          payload: { loginResponse },
        });
        return loginResponse;
      }

      dispatch({
        type: ActionTypes.LOGIN_SUCCESS,
        payload: { loginResponse },
      });

      return loginResponse;
    } catch (error) {
      console.error('--- LOGIN ERROR ---');
      console.error('ERROR MESSAGE:', error.message);
      console.error('--- END ERROR ---');

      dispatch({
        type: ActionTypes.LOGIN_FAILED,
        error: error.message,
      });
    }
  };
};
