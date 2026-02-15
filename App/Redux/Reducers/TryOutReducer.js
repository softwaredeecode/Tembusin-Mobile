import * as actionTypes from '../Constants/Types';

const initialState = {
  allTryOutData: {
    data: [],
    total_pages: 0,
    total_items: 0,
  },
  myTryOutData: {
    data: [],
    total_pages: 0,
    total_items: 0,
  },
  tryOutDetailData: {},
  tryoutQuestionDetail: {},
  startNewAttemptTryoutData: {},
  comingSoonTryoutData: {},
  tryoutAttemptList: [],
  tryOutSpinner: false,
  errorModal: false,
};

export const TryOutReducer = (state = initialState, action) => {
  switch (action.type) {
    // ============= GET_ALL_TRYOUT_DATA ===================
    case actionTypes.GET_ALL_TRYOUT_DATA_REQUEST:
      return {
        ...state,
        tryOutSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_ALL_TRYOUT_DATA_SUCCESS: {
      const incomingList = action.payload?.data?.data || [];
      const page = action.meta?.page || 1;

      return {
        ...state,
        tryOutSpinner: false,
        errorModal: false,
        allTryOutData: {
          ...action.payload,
          data: {
            ...action.payload.data,
            data:
              page > 1
                ? [...(state.allTryOutData?.data?.data || []), ...incomingList]
                : incomingList,
          },
        },
      };
    }
    case actionTypes.GET_ALL_TRYOUT_DATA_FAILED:
      return {
        ...state,
        tryOutSpinner: false,
        errorModal: true,
      };

    // ============= GET_MY_TRYOUT_DATA ===================
    case actionTypes.GET_MY_TRYOUT_DATA_REQUEST:
      return {
        ...state,
        tryOutSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_MY_TRYOUT_DATA_SUCCESS: {
      const incomingList = action.payload?.data?.data || [];
      const page = action.meta?.page || 1;

      return {
        ...state,
        tryOutSpinner: false,
        errorModal: false,
        myTryOutData: {
          ...action.payload,
          data: {
            ...action.payload.data,
            data:
              page > 1
                ? [...(state.myTryOutData?.data?.data || []), ...incomingList]
                : incomingList,
          },
        },
      };
    }
    case actionTypes.GET_MY_TRYOUT_DATA_FAILED:
      return {
        ...state,
        tryOutSpinner: false,
        errorModal: true,
      };

    // ============= GET_TRYOUT_DETAIL_DATA ===================
    case actionTypes.GET_TRYOUT_DETAIL_DATA_REQUEST:
      return {
        ...state,
        tryOutSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_TRYOUT_DETAIL_DATA_SUCCESS: {
      return {
        ...state,
        tryOutSpinner: true,
        tryOutDetailData: action.payload,
        errorModal: false,
      };
    }
    case actionTypes.GET_TRYOUT_DETAIL_DATA_FAILED:
      return {
        ...state,
        tryOutSpinner: false,
        errorModal: true,
      };

    // ============= GET_ATTEMPT_LIST_TRYOUT ===================
    case actionTypes.GET_ATTEMPT_LIST_TRYOUT_REQUEST:
      return {
        ...state,
        tryOutSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_ATTEMPT_LIST_TRYOUT_SUCCESS: {
      return {
        ...state,
        tryOutSpinner: false,
        errorModal: false,
        tryoutAttemptList: action.payload,
      };
    }
    case actionTypes.GET_ATTEMPT_LIST_TRYOUT_FAILED:
      return {
        ...state,
        tryOutSpinner: false,
        errorModal: true,
      };

    // ============= GET_TRYOUT_QUESTION_DETAIL ===================
    case actionTypes.GET_TRYOUT_QUESTION_DETAIL_REQUEST:
      return {
        ...state,
        tryOutSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_TRYOUT_QUESTION_DETAIL_SUCCESS: {
      return {
        ...state,
        tryOutSpinner: false,
        tryoutQuestionDetail: action.payload,
        errorModal: false,
      };
    }
    case actionTypes.GET_TRYOUT_QUESTION_DETAIL_FAILED:
      return {
        ...state,
        tryOutSpinner: false,
        errorModal: true,
      };

    // ============= POST_START_NEW_ATTEMPT_TRYOUT ===================
    case actionTypes.POST_START_NEW_ATTEMPT_TRYOUT_REQUEST:
      return {
        ...state,
        tryOutSpinner: true,
        errorModal: false,
      };
    case actionTypes.POST_START_NEW_ATTEMPT_TRYOUT_SUCCESS: {
      return {
        ...state,
        tryOutSpinner: false,
        startNewAttemptTryoutData: action.payload,
        errorModal: false,
      };
    }
    case actionTypes.POST_START_NEW_ATTEMPT_TRYOUT_FAILED:
      return {
        ...state,
        tryOutSpinner: false,
        errorModal: true,
      };

    // ============= GET_COMMING_SOON_TRYOUT ===================
    case actionTypes.GET_COMMING_SOON_TRYOUT_REQUEST:
      return {
        ...state,
        tryOutSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_COMMING_SOON_TRYOUT_SUCCESS: {
      return {
        ...state,
        tryOutSpinner: false,
        comingSoonTryoutData: action.payload,
        errorModal: false,
      };
    }
    case actionTypes.GET_COMMING_SOON_TRYOUT_FAILED:
      return {
        ...state,
        tryOutSpinner: false,
        errorModal: true,
      };

    default:
      return state;
  }
};
