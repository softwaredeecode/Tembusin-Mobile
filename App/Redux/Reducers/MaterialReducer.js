import * as actionTypes from '../Constants/Types';

const initialState = {
  materialCollectionData: {
    data: [],
    total_pages: 0,
    total_items: 0,
  },
  myMaterialCollectionData: [],
  materialCollectionDetailData: {},
  materialDetailData: {},
  materialSpinner: false,
  errorModal: false,
};

export const MaterialReducer = (state = initialState, action) => {
  switch (action.type) {
    // ============= GET_MATERIAL_COLLECTION ===================
    case actionTypes.GET_MATERIAL_COLLECTION_REQUEST:
      return {
        ...state,
        materialSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_MATERIAL_COLLECTION_SUCCESS: {
      const incomingList = action.payload?.data?.data || [];
      const page = action.meta?.page || 1;

      return {
        ...state,
        materialSpinner: false,
        errorModal: false,
        materialCollectionData: {
          ...action.payload,
          data: {
            ...action.payload.data,
            data:
              page > 1
                ? [
                    ...(state.materialCollectionData?.data?.data || []),
                    ...incomingList,
                  ]
                : incomingList,
          },
        },
      };
    }

    case actionTypes.GET_MATERIAL_COLLECTION_FAILED:
      return {
        ...state,
        materialSpinner: false,
        errorModal: true,
      };

    // ============= GET_MY_MATERIAL_COLLECTION ===================
    case actionTypes.GET_MY_MATERIAL_COLLECTION_REQUEST:
      return {
        ...state,
        materialSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_MY_MATERIAL_COLLECTION_SUCCESS: {
      const incomingList = action.payload?.data?.data || [];
      const page = action.meta?.page || 1;

      return {
        ...state,
        materialSpinner: false,
        errorModal: false,
        myMaterialCollectionData: {
          ...action.payload,
          data: {
            ...action.payload.data,
            data:
              page > 1
                ? [
                    ...(state.myMaterialCollectionData?.data?.data || []),
                    ...incomingList,
                  ]
                : incomingList,
          },
        },
      };
    }
    case actionTypes.GET_MY_MATERIAL_COLLECTION_FAILED:
      return {
        ...state,
        materialSpinner: false,
        errorModal: true,
      };

    // ============= GET_MATERIAL_COLLECTION_DETAIL_DATA ===================
    case actionTypes.GET_MATERIAL_COLLECTION_DETAIL_DATA_REQUEST:
      return {
        ...state,
        materialSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_MATERIAL_COLLECTION_DETAIL_DATA_SUCCESS: {
      return {
        ...state,
        materialSpinner: true,
        materialCollectionDetailData: action.payload,
        errorModal: false,
      };
    }
    case actionTypes.GET_MATERIAL_COLLECTION_DETAIL_DATA_FAILED:
      return {
        ...state,
        materialSpinner: false,
        errorModal: true,
      };

    // ============= GET_MATERIAL_DETAIL_DATA ===================
    case actionTypes.GET_MATERIAL_DETAIL_DATA_REQUEST:
      return {
        ...state,
        materialSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_MATERIAL_DETAIL_DATA_SUCCESS: {
      return {
        ...state,
        materialSpinner: true,
        materialDetailData: action.payload,
        errorModal: false,
      };
    }
    case actionTypes.GET_MATERIAL_DETAIL_DATA_FAILED:
      return {
        ...state,
        materialSpinner: false,
        errorModal: true,
      };

    // ============= RESET_STATE ===================
    case actionTypes.RESET_MATERIAL_COLLECTION_DATA:
      return {
        ...state,
        materialCollectionData: [],
      };

    default:
      return state;
  }
};
