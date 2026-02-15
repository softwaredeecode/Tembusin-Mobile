import * as ActionTypes from '../Constants/Types';
import { BASE_URL, AUTH } from '../../Api/GlobalUrl';

export const PostRegister = payload => {
  return async dispatch => {
    dispatch({ type: ActionTypes.POST_REGISTER_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 15 detik timeout

    try {
      const url = `${BASE_URL}${AUTH.register}`;

      console.log('--- REGISTER REQUEST ---');
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

      const registerResponse = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', registerResponse);
      console.log('--- END REGISTER REQUEST ---');

      if (!response.ok) {
        dispatch({
          type: ActionTypes.POST_REGISTER_FAILED,
          payload: registerResponse,
        });
        return registerResponse;
      }

      dispatch({
        type: ActionTypes.POST_REGISTER_SUCCESS,
        payload: registerResponse,
      });

      return registerResponse;
    } catch (error) {
      clearTimeout(timeoutId);

      console.error('--- REGISTER ERROR ---');
      console.error('ERROR MESSAGE:', error.message);
      console.error('--- END REGISTER ERROR ---');

      const errorResponse = {
        status: 0,
        ok: false,
        error: error.message,
      };

      dispatch({
        type: ActionTypes.POST_REGISTER_FAILED,
        payload: errorResponse,
      });

      return errorResponse;
    }
  };
};

export const RegisterVerifyOtp = payload => {
  return async dispatch => {
    dispatch({ type: ActionTypes.REGISTER_VERIFY_OTP_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 15 detik timeout

    try {
      const url = `${BASE_URL}${AUTH.verifyOtpRegister}`;

      console.log('--- VERIFY OTP REQUEST ---');
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

      const verifyOtpResponse = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', verifyOtpResponse);
      console.log('--- END VERIFY OTP REQUEST ---');

      if (!response.ok) {
        dispatch({
          type: ActionTypes.REGISTER_VERIFY_OTP_FAILED,
          payload: verifyOtpResponse,
        });
        return verifyOtpResponse;
      }

      dispatch({
        type: ActionTypes.REGISTER_VERIFY_OTP_SUCCESS,
        payload: verifyOtpResponse,
      });

      return verifyOtpResponse;
    } catch (error) {
      clearTimeout(timeoutId);

      console.error('--- VERIFY OTP ERROR ---');
      console.error('ERROR MESSAGE:', error.message);
      console.error('--- END VERIFY OTP ERROR ---');

      const errorResponse = {
        status: 0,
        ok: false,
        error: error.message,
      };

      dispatch({
        type: ActionTypes.REGISTER_VERIFY_OTP_FAILED,
        payload: errorResponse,
      });

      return errorResponse;
    }
  };
};

export const RegisterResendOtp = payload => {
  return async dispatch => {
    dispatch({ type: ActionTypes.RESEND_OTP_REGISTER_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000); // 15 detik timeout

    try {
      const url = `${BASE_URL}${AUTH.resendOtpRegister}`;

      console.log('--- RESEND OTP REQUEST ---');
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

      const resendOtpResponse = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', resendOtpResponse);
      console.log('--- END RESEND OTP REQUEST ---');

      if (!response.ok) {
        dispatch({
          type: ActionTypes.RESEND_OTP_REGISTER_FAILED,
          payload: resendOtpResponse,
        });
        return resendOtpResponse;
      }

      dispatch({
        type: ActionTypes.RESEND_OTP_REGISTER_SUCCESS,
        payload: resendOtpResponse,
      });

      return resendOtpResponse;
    } catch (error) {
      clearTimeout(timeoutId);

      console.error('--- RESEND OTP ERROR ---');
      console.error('ERROR MESSAGE:', error.message);
      console.error('--- END RESEND OTP ERROR ---');

      const errorResponse = {
        status: 0,
        ok: false,
        error: error.message,
      };

      dispatch({
        type: ActionTypes.RESEND_OTP_REGISTER_FAILED,
        payload: errorResponse,
      });

      return errorResponse;
    }
  };
};
