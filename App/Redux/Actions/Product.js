import * as ActionTypes from '../Constants/Types';
import { BASE_URL, PRODUCT } from '../../Api/GlobalUrl';

export const GetProductList = (token, params = {}) => {
  return async dispatch => {
    dispatch({ type: ActionTypes.GET_PRODUCT_LIST_DATA_REQUEST });

    const controller = new AbortController();
    const { signal } = controller;

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

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
