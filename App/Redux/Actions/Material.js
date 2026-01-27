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

export const GetLastReadMaterialCollectionDetailData = (token, params = {}) => {
  return async dispatch => {
    dispatch({
      type: ActionTypes.GET_LAST_READ_MATERIAL_COLLECTION_DETAIL_DATA_REQUEST,
    });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const queryString = new URLSearchParams(params).toString();

      const baseUrl = `${BASE_URL}${MATERIAL.lastReadMaterialCollection}${
        queryString ? `?${queryString}` : ''
      }`;

      console.log(
        '--- GET_LAST_READ_MATERIAL_COLLECTION_DETAIL_DATA_REQUEST ---',
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

      const materialLastReadCollectionDetailData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', materialLastReadCollectionDetailData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_LAST_READ_MATERIAL_COLLECTION_DETAIL_DATA_FAILED,
          payload: materialLastReadCollectionDetailData,
        });
      }

      dispatch({
        type: ActionTypes.GET_LAST_READ_MATERIAL_COLLECTION_DETAIL_DATA_SUCCESS,
        payload: materialLastReadCollectionDetailData,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: ActionTypes.GET_LAST_READ_MATERIAL_COLLECTION_DETAIL_DATA_FAILED,
        error: error.message,
      });
    }
  };
};

export const GetMaterialCollectionDetailData = (
  token,
  materialCollectionId,
) => {
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

export const PurchaseMaterialCollection = async (
  token,
  materialCollectionId,
  price,
) => {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 15000);

  try {
    const baseUrl = `${BASE_URL}${MATERIAL.buyMaterial}/${materialCollectionId}/purchase`;

    console.log('--- PURCHASE_MATERIAL_COLLECTION_REQUEST ---');
    console.log('URL:', baseUrl);

    const response = await fetch(baseUrl, {
      method: 'POST',
      signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        material_collection_id: materialCollectionId,
        price: price,
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

export const GetMaterialDetailData = (token, materialId) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_MATERIAL_DETAIL_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      const baseUrl = `${BASE_URL}${MATERIAL.materialDetail}/${materialId}`;

      console.log('--- GET_MATERIAL_DETAIL_DATA_REQUEST ---');
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

      const materialDetailData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', materialDetailData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_MATERIAL_DETAIL_DATA_FAILED,
          payload: materialDetailData,
        });
      }

      dispatch({
        type: ActionTypes.GET_MATERIAL_DETAIL_DATA_SUCCESS,
        payload: materialDetailData,
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_MATERIAL_DETAIL_DATA_FAILED,
        error: error.message,
      });
    }
  };
};
