import * as actionTypes from '../Constants/Types';

const initialState = {
  productListData: {
    data: [],
    total_pages: 0,
    total_items: 0,
  },
  productSpinner: false,
  errorModal: false,
};

export const ProductReducer = (state = initialState, action) => {
  switch (action.type) {
    // ============= GET_PRODUCT_LIST_DATA ===================
    case actionTypes.GET_PRODUCT_LIST_DATA_REQUEST:
      return {
        ...state,
        productSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_PRODUCT_LIST_DATA_SUCCESS: {
      const incomingList = action.payload?.data?.data || [];
      const page = action.meta?.page || 1;

      return {
        ...state,
        productSpinner: false,
        errorModal: false,
        productListData: {
          ...action.payload,
          data: {
            ...action.payload.data,
            data:
              page > 1
                ? [
                    ...(state.productListData?.data?.data || []),
                    ...incomingList,
                  ]
                : incomingList,
          },
        },
      };
    }

    case actionTypes.GET_PRODUCT_LIST_DATA_FAILED:
      return {
        ...state,
        productSpinner: false,
        errorModal: true,
      };


    // ============= RESET_STATE ===================
    case actionTypes.RESET_PRODUCT_LIST_DATA:
      return {
        ...state,
        productListData: [],
      };

    default:
      return state;
  }
};
