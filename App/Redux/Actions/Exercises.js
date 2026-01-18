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

export const GetExercisesSetDetailData = (
  token,
  exercisesSetId,
) => {
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
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_EXERCISES_SET_DETAIL_DATA_FAILED,
        error: error.message,
      });
    }
  };
};
