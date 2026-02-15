import * as ActionTypes from '../Constants/Types';
import { BASE_URL, TRYOUT } from '../../Api/GlobalUrl';

export const GetAllTryOutData = (token, params = {}) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_ALL_TRYOUT_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

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

export const GetMyTryOutData = (token, params = {}) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_MY_TRYOUT_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const queryString = new URLSearchParams(params).toString();

      const baseUrl = `${BASE_URL}${TRYOUT.myTryOut}${
        queryString ? `?${queryString}` : ''
      }`;

      console.log('--- GET_MY_TRYOUT_DATA_REQUEST ---');
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

      const myTryoutData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', myTryoutData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_MY_TRYOUT_DATA_FAILED,
          payload: myTryoutData,
        });
      }

      dispatch({
        type: ActionTypes.GET_MY_TRYOUT_DATA_SUCCESS,
        payload: myTryoutData,
        meta: {
          page: myTryoutData.data.page,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_MY_TRYOUT_DATA_FAILED,
        error: error.message,
      });
    }
  };
};

export const GetTryOutDetailData = (token, tryoutId) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_TRYOUT_DETAIL_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const baseUrl = `${BASE_URL}${TRYOUT.tryoutDetail}/${tryoutId}`;

      console.log('--- GET_TRYOUT_DETAIL_DATA_REQUEST ---');
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

      const tryOutDetailData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', tryOutDetailData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_TRYOUT_DETAIL_DATA_FAILED,
          payload: tryOutDetailData,
        });
      }

      dispatch({
        type: ActionTypes.GET_TRYOUT_DETAIL_DATA_SUCCESS,
        payload: tryOutDetailData,
      });

      return tryOutDetailData;
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_TRYOUT_DETAIL_DATA_FAILED,
        error: error.message,
      });
    }
  };
};

export const PurchaseTryout = async (token, tryoutId, price) => {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 30000);

  try {
    const baseUrl = `${BASE_URL}${TRYOUT.tryoutDetail}/${tryoutId}/purchase`;

    console.log('--- PURCHASE_TRYOUT_REQUEST ---');
    console.log('URL:', baseUrl);

    const response = await fetch(baseUrl, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        tryout_id: tryoutId,
        payment_method: 'token'
      }),
    });

    clearTimeout(timeoutId);

    const body = await response.json();

    const result = {
      status: response.status,
      ok: response.ok,
      data: body,
    };

    console.log('Response Body:', result);
    console.log('--- END REQUEST ---');

    return result;
  } catch (error) {
    clearTimeout(timeoutId);

    return {
      ok: false,
      error: error.name === 'AbortError' ? 'Request timeout' : error.message,
    };
  }
};

export const GetAttemptListTryout = (token, tryoutId) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_ATTEMPT_LIST_TRYOUT_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const baseUrl = `${BASE_URL}${TRYOUT.tryoutDetail}/${tryoutId}/attempts`;

      console.log('--- GET_ATTEMPT_LIST_TRYOUT_REQUEST ---');
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

      const tryoutAttemptList = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', tryoutAttemptList);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_ATTEMPT_LIST_TRYOUT_FAILED,
          payload: tryoutAttemptList,
        });
      }

      dispatch({
        type: ActionTypes.GET_ATTEMPT_LIST_TRYOUT_SUCCESS,
        payload: tryoutAttemptList,
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_ATTEMPT_LIST_TRYOUT_FAILED,
        error: error.message,
      });
    }
  };
};

export const GetTryoutQuestionDetail = (token, tryoutId, questionId) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_TRYOUT_QUESTION_DETAIL_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const baseUrl = `${BASE_URL}${TRYOUT.tryoutDetail}/${tryoutId}/questions/${questionId}`;

      console.log('--- GET_TRYOUT_QUESTION_DETAIL_REQUEST ---');
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

      const tryoutQuestionDetail = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', tryoutQuestionDetail);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_TRYOUT_QUESTION_DETAIL_FAILED,
          payload: tryoutQuestionDetail,
        });
      }

      dispatch({
        type: ActionTypes.GET_TRYOUT_QUESTION_DETAIL_SUCCESS,
        payload: tryoutQuestionDetail,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: ActionTypes.GET_TRYOUT_QUESTION_DETAIL_FAILED,
        error: error.message,
      });
    }
  };
};

export const StartNewAttemptTryOut = (token, tryoutId) => {
  return async dispatch => {
    dispatch({
      type: ActionTypes.POST_START_NEW_ATTEMPT_TRYOUT_REQUEST,
    });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const baseUrl = `${BASE_URL}${TRYOUT.tryoutDetail}/${tryoutId}/attempts`;

      console.log('--- POST_START_NEW_ATTEMPT_TRYOUT_REQUEST ---');
      console.log('URL:', baseUrl);

      const response = await fetch(baseUrl, {
        method: 'POST',
        signal,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      const body = await response.json();

      const startNewAttemptTryoutData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', startNewAttemptTryoutData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.POST_START_NEW_ATTEMPT_TRYOUT_FAILED,
          payload: startNewAttemptTryoutData,
        });
      }

      dispatch({
        type: ActionTypes.POST_START_NEW_ATTEMPT_TRYOUT_SUCCESS,
        payload: startNewAttemptTryoutData,
      });
      return startNewAttemptTryoutData;
    } catch (error) {
      console.log(error);

      dispatch({
        type: ActionTypes.POST_START_NEW_ATTEMPT_TRYOUT_FAILED,
        error: error.message,
      });
    }
  };
};

export const SubmitTryoutAnswer = async (
  token,
  tryoutId,
  attemptId,
  payload,
) => {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 30000);

  try {
    const baseUrl = `${BASE_URL}${TRYOUT.tryoutDetail}/${tryoutId}/attempts/${attemptId}/answers`;

    console.log('--- TRYOUT_SUBMIT_ANSWER_REQUEST ---');
    console.log('URL:', baseUrl);
    console.log('Payload:', payload);

    const response = await fetch(baseUrl, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    clearTimeout(timeoutId);

    const body = await response.json();

    const result = {
      status: response.status,
      ok: response.ok,
      data: body,
    };

    console.log('Response Body:', result);
    console.log('--- END REQUEST ---');

    return result;
  } catch (error) {
    clearTimeout(timeoutId);

    return {
      ok: false,
      error: error.name === 'AbortError' ? 'Request timeout' : error.message,
    };
  }
};

export const SubmitTryOutAttempt = async (token, tryoutId, attemptId) => {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 30000);

  try {
    const baseUrl = `${BASE_URL}${TRYOUT.tryoutDetail}/${tryoutId}/attempts/${attemptId}/submit`;

    console.log('--- TRYOUT_SUBMIT_ATTEMPT_REQUEST ---');
    console.log('URL:', baseUrl);

    const response = await fetch(baseUrl, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    clearTimeout(timeoutId);

    const body = await response.json();

    const result = {
      status: response.status,
      ok: response.ok,
      data: body,
    };

    console.log('Response Body:', result);
    console.log('--- END REQUEST ---');

    return result;
  } catch (error) {
    clearTimeout(timeoutId);

    return {
      ok: false,
      error: error.name === 'AbortError' ? 'Request timeout' : error.message,
    };
  }
};

export const GetComingSoonTryout = token => {
  return async dispatch => {
    dispatch({
      type: ActionTypes.GET_COMMING_SOON_TRYOUT_REQUEST,
    });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const baseUrl = `${BASE_URL}/${TRYOUT.comingSoonTryout}`;

      console.log('--- GET_COMMING_SOON_TRYOUT_REQUEST ---');
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

      const comingSoonTryoutData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', comingSoonTryoutData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_COMMING_SOON_TRYOUT_FAILED,
          payload: comingSoonTryoutData,
        });
      }

      dispatch({
        type: ActionTypes.GET_COMMING_SOON_TRYOUT_SUCCESS,
        payload: comingSoonTryoutData,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: ActionTypes.GET_COMMING_SOON_TRYOUT_FAILED,
        error: error.message,
      });
    }
  };
};
