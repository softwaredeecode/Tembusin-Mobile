import * as ActionTypes from '../Constants/Types';
import { BASE_URL, EXERCISES } from '../../Api/GlobalUrl';

export const GetAllExercisesSetData = (token, params = {}) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_ALL_EXERCISES_SET_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const queryString = new URLSearchParams(params).toString();

      const baseUrl = `${BASE_URL}${EXERCISES.allExercisesSet}${
        queryString ? `?${queryString}` : ''
      }`;

      console.log('--- GET_ALL_EXERCISES_SET_DATA_REQUEST ---');
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

      const allExercisesData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', allExercisesData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_ALL_EXERCISES_SET_DATA_FAILED,
          payload: allExercisesData,
        });
      }

      dispatch({
        type: ActionTypes.GET_ALL_EXERCISES_SET_DATA_SUCCESS,
        payload: allExercisesData,
        meta: {
          page: allExercisesData.data.page,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_ALL_EXERCISES_SET_DATA_FAILED,
        error: error.message,
      });
    }
  };
};

export const GetMyExercisesSetData = (token, params = {}) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_MY_EXERCISES_SET_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const queryString = new URLSearchParams(params).toString();

      const baseUrl = `${BASE_URL}${EXERCISES.myExercisesSet}${
        queryString ? `?${queryString}` : ''
      }`;

      console.log('--- GET_MY_EXERCISES_SET_DATA_REQUEST ---');
      console.log('URL:', baseUrl);

      const response = await fetch(baseUrl, {
        method: 'GET',
        signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Status:', response.status);
      console.log('Headers:', response.headers.get('content-length'));

      clearTimeout(timeoutId);

      const body = await response.json();

      const myExercisesData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', myExercisesData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_MY_EXERCISES_SET_DATA_FAILED,
          payload: myExercisesData,
        });
      }

      dispatch({
        type: ActionTypes.GET_MY_EXERCISES_SET_DATA_SUCCESS,
        payload: myExercisesData,
        meta: {
          page: myExercisesData.data.page,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_MY_EXERCISES_SET_DATA_FAILED,
        error: error.message,
      });
    }
  };
};

export const GetExercisesSetDetailData = (token, exercisesSetId) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_EXERCISES_SET_DETAIL_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const baseUrl = `${BASE_URL}${EXERCISES.exercisesSetDetail}/${exercisesSetId}`;

      console.log('--- GET_EXERCISES_SET_DETAIL_DATA_REQUEST ---');
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

      const exercisesSetDetailData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', exercisesSetDetailData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_EXERCISES_SET_DETAIL_DATA_FAILED,
          payload: exercisesSetDetailData,
        });
      }

      dispatch({
        type: ActionTypes.GET_EXERCISES_SET_DETAIL_DATA_SUCCESS,
        payload: exercisesSetDetailData,
      });

      return exercisesSetDetailData;
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_EXERCISES_SET_DETAIL_DATA_FAILED,
        error: error.message,
      });
    }
  };
};

export const GetExercisesDetailContent = (
  token,
  exercisesSetId,
  questionId,
) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_EXERCISES_DETAIL_CONTENT_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const baseUrl = `${BASE_URL}${EXERCISES.exercisesSetDetail}/${exercisesSetId}/questions/${questionId}`;

      console.log('--- GET_EXERCISES_DETAIL_CONTENT_REQUEST ---');
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

      const exercisesDetailContent = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', exercisesDetailContent);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_EXERCISES_DETAIL_CONTENT_FAILED,
          payload: exercisesDetailContent,
        });
      }

      dispatch({
        type: ActionTypes.GET_EXERCISES_DETAIL_CONTENT_SUCCESS,
        payload: exercisesDetailContent,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: ActionTypes.GET_EXERCISES_DETAIL_CONTENT_FAILED,
        error: error.message,
      });
    }
  };
};

export const StartNewAttempt = (token, exercisesSetId) => {
  return async dispatch => {
    dispatch({
      type: ActionTypes.POST_START_NEW_ATTEMPT_REQUEST,
    });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const baseUrl = `${BASE_URL}${EXERCISES.exercisesSetDetail}/${exercisesSetId}/attempts`;

      console.log('--- POST_START_NEW_ATTEMPT_REQUEST ---');
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

      const startNewAttemptData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', startNewAttemptData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.POST_START_NEW_ATTEMPT_FAILED,
          payload: startNewAttemptData,
        });
      }

      dispatch({
        type: ActionTypes.POST_START_NEW_ATTEMPT_SUCCESS,
        payload: startNewAttemptData,
      });
      return startNewAttemptData;
    } catch (error) {
      console.log(error);

      dispatch({
        type: ActionTypes.POST_START_NEW_ATTEMPT_FAILED,
        error: error.message,
      });
    }
  };
};

export const SubmitAnswer = async (
  token,
  exercisesSetId,
  attemptId,
  payload,
) => {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    const baseUrl = `${BASE_URL}${EXERCISES.exercisesSetDetail}/${exercisesSetId}/attempts/${attemptId}/answers`;

    console.log('--- EXERCISES_SUBMIT_ANSWER_REQUEST ---');
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

export const SubmitAttempt = async (token, exercisesSetId, attemptId) => {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    const baseUrl = `${BASE_URL}${EXERCISES.exercisesSetDetail}/${exercisesSetId}/attempts/${attemptId}/submit`;

    console.log('--- EXERCISES_SUBMIT_ATTEMPT_REQUEST ---');
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

export const GetAttemptList = (token, exercisesSetId) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_ATTEMPT_LIST_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const baseUrl = `${BASE_URL}${EXERCISES.exercisesSetDetail}/${exercisesSetId}/attempts`;

      console.log('--- GET_ATTEMPT_LIST_REQUEST ---');
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

      const allExercisesData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', allExercisesData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_ATTEMPT_LIST_FAILED,
          payload: allExercisesData,
        });
      }

      dispatch({
        type: ActionTypes.GET_ATTEMPT_LIST_SUCCESS,
        payload: allExercisesData,
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_ATTEMPT_LIST_FAILED,
        error: error.message,
      });
    }
  };
};

export const GetComingSoonExercise = token => {
  return async dispatch => {
    dispatch({
      type: ActionTypes.GET_COMMING_SOON_EXERCISE_REQUEST,
    });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const baseUrl = `${BASE_URL}${EXERCISES.comingSoonExercise}`;

      console.log(
        '--- GET_COMMING_SOON_EXERCISE_REQUEST ---',
      );
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

      const comingSoonExerciseData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', comingSoonExerciseData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_COMMING_SOON_EXERCISE_FAILED,
          payload: comingSoonExerciseData,
        });
      }

      dispatch({
        type: ActionTypes.GET_COMMING_SOON_EXERCISE_SUCCESS,
        payload: comingSoonExerciseData,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: ActionTypes.GET_COMMING_SOON_EXERCISE_FAILED,
        error: error.message,
      });
    }
  };
};
