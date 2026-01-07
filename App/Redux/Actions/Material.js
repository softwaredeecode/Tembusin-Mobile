import * as ActionTypes from '../Constants/Types';
import { BASE_URL, MATERIAL } from '../../Api/GlobalUrl';

export const GetMaterialCollectionData = (token, params = {}) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_MATERIAL_COLLECTION_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const queryString = new URLSearchParams(params).toString();

      const baseUrl = `${BASE_URL}${MATERIAL.materialCollection}${
        queryString ? `?${queryString}` : ''
      }`;

      console.log('--- GET_MATERIAL_COLLECTION_REQUEST ---');
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

      const materialCollectionData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', materialCollectionData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_MATERIAL_COLLECTION_FAILED,
          payload: materialCollectionData,
        });
      }

      dispatch({
        type: ActionTypes.GET_MATERIAL_COLLECTION_SUCCESS,
        payload: materialCollectionData,
        meta: {
          page: materialCollectionData.data.page,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_MATERIAL_COLLECTION_FAILED,
        error: error.message,
      });
    }
  };
};

export const GetMyMaterialCollectionData = (token, params = {}) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_MY_MATERIAL_COLLECTION_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const queryString = new URLSearchParams(params).toString();

      const baseUrl = `${BASE_URL}${MATERIAL.myMaterialCollection}${
        queryString ? `?${queryString}` : ''
      }`;

      console.log('--- GET_MY_MATERIAL_COLLECTION_REQUEST ---');
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

      const myMaterialCollectionData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', myMaterialCollectionData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_MY_MATERIAL_COLLECTION_FAILED,
          payload: myMaterialCollectionData,
        });
      }

      dispatch({
        type: ActionTypes.GET_MY_MATERIAL_COLLECTION_SUCCESS,
        payload: myMaterialCollectionData,
        meta: {
          page: myMaterialCollectionData.data.page,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_MY_MATERIAL_COLLECTION_FAILED,
        error: error.message,
      });
    }
  };
};

export const GetMaterialCollectionDetailData = (token, materialCollectionId) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_MATERIAL_COLLECTION_DETAIL_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {

      const baseUrl = `${BASE_URL}${MATERIAL.materialCollectionDetail}/${materialCollectionId}`;

      console.log('--- GET_MATERIAL_COLLECTION_DETAIL_DATA_REQUEST ---');
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

      const materialCollectionDetailData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', materialCollectionDetailData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_MATERIAL_COLLECTION_DETAIL_DATA_FAILED,
          payload: materialCollectionDetailData,
        });
      }

      dispatch({
        type: ActionTypes.GET_MATERIAL_COLLECTION_DETAIL_DATA_SUCCESS,
        payload: materialCollectionDetailData,
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_MATERIAL_COLLECTION_DETAIL_DATA_FAILED,
        error: error.message,
      });
    }
  };
};
