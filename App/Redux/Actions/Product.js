import * as ActionTypes from '../Constants/Types';
import { BASE_URL, PRODUCT } from '../../Api/GlobalUrl';

export const GetProductList = (token, params = {}) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_PRODUCT_LIST_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const queryString = new URLSearchParams(params).toString();

      const baseUrl = `${BASE_URL}${PRODUCT.productList}${
        queryString ? `?${queryString}` : ''
      }`;

      console.log('--- GET_PRODUCT_LIST_DATA_REQUEST ---');
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

      const productListData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', productListData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_PRODUCT_LIST_DATA_FAILED,
          payload: productListData,
        });
      }

      dispatch({
        type: ActionTypes.GET_PRODUCT_LIST_DATA_SUCCESS,
        payload: productListData,
        meta: {
          page: productListData.data.page,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_PRODUCT_LIST_DATA_FAILED,
        error: error.message,
      });
    }
  };
};

export const GetHistoryList = (token, params = {}) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_HISTORY_LIST_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const queryString = new URLSearchParams(params).toString();

      const baseUrl = `${BASE_URL}${PRODUCT.historyList}${
        queryString ? `?${queryString}` : ''
      }`;

      console.log('--- GET_HISTORY_LIST_DATA_REQUEST ---');
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

      const historyListData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', historyListData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_HISTORY_LIST_DATA_FAILED,
          payload: historyListData,
        });
      }

      dispatch({
        type: ActionTypes.GET_HISTORY_LIST_DATA_SUCCESS,
        payload: historyListData,
        meta: {
          page: historyListData.data.page,
        },
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_HISTORY_LIST_DATA_FAILED,
        error: error.message,
      });
    }
  };
};

export const GetProductDetailData = (token, productId) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_PRODUCT_DETAIL_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      const baseUrl = `${BASE_URL}${PRODUCT.productDetail}/${productId}`;

      console.log('--- GET_PRODUCT_DETAIL_DATA_REQUEST ---');
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

      const productDetailData = {
        status: response.status,
        ok: response.ok,
        data: body,
      };

      console.log('Response Body:', productDetailData);
      console.log('--- END REQUEST ---');

      if (!response.ok) {
        return dispatch({
          type: ActionTypes.GET_PRODUCT_DETAIL_DATA_FAILED,
          payload: productDetailData,
        });
      }

      dispatch({
        type: ActionTypes.GET_PRODUCT_DETAIL_DATA_SUCCESS,
        payload: productDetailData,
      });
    } catch (error) {
      dispatch({
        type: ActionTypes.GET_PRODUCT_DETAIL_DATA_FAILED,
        error: error.message,
      });
    }
  };
};

export const PurchaseProduct = async (token, productId, currency) => {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 30000);

  try {
    const baseUrl = `${BASE_URL}${PRODUCT.productDetail}/${productId}/purchase`;

    const requestBody = {
      product_id: productId,
      payment_method: currency,
    };

    const requestHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // 🔹 Print semua detail request sebelum dikirim
    console.log('--- PURCHASE_PRODUCT_REQUEST ---');
    console.log('URL:', baseUrl);
    console.log('Method: POST');
    console.log('Headers:', requestHeaders);
    console.log('Body:', requestBody);

    const response = await fetch(baseUrl, {
      method: 'POST',
      signal,
      headers: requestHeaders,
      body: JSON.stringify(requestBody),
    });

    clearTimeout(timeoutId);

    const body = await response.json();

    const result = {
      status: response.status,
      ok: response.ok,
      data: body,
    };

    console.log('--- PURCHASE_PRODUCT_RESPONSE ---');
    console.log('Status:', response.status);
    console.log('Body:', body);
    console.log('--- END REQUEST ---');

    return result;
  } catch (error) {
    clearTimeout(timeoutId);

    console.log('--- PURCHASE_PRODUCT_ERROR ---');
    console.log(error);

    return {
      ok: false,
      error: error.name === 'AbortError' ? 'Request timeout' : error.message,
    };
  }
};

export const CheckStatus = async (
  token,
  reference_no,
) => {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 30000);

  try {
    const baseUrl = `${BASE_URL}${PRODUCT.checkStatus}/${reference_no}`;

    console.log('--- CHECK_STATUS_REQUEST ---');
    console.log('URL:', baseUrl);

    const response = await fetch(baseUrl, {
      method: 'GET',
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
