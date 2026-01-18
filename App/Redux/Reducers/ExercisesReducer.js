import * as actionTypes from '../Constants/Types';

const initialState = {
  allExercisesSetData: {
    data: [],
    total_pages: 0,
    total_items: 0,
  },
  myExercisesSetData: {
    data: [],
    total_pages: 0,
    total_items: 0,
  },
  exercisesSetDetailData: {},
  exercisesSpinner: false,
  errorModal: false,
};

export const ExercisesReducer = (state = initialState, action) => {
  switch (action.type) {
    // ============= GET_ALL_EXERCISES_SET_DATA ===================
    case actionTypes.GET_ALL_EXERCISES_SET_DATA_REQUEST:
      return {
        ...state,
        exercisesSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_ALL_EXERCISES_SET_DATA_SUCCESS: {
      const incomingList = action.payload?.data?.data || [];
      const page = action.meta?.page || 1;

      return {
        ...state,
        exercisesSpinner: false,
        errorModal: false,
        allExercisesSetData: {
          ...action.payload,
          data: {
            ...action.payload.data,
            data:
              page > 1
                ? [
                    ...(state.allExercisesSetData?.data?.data || []),
                    ...incomingList,
                  ]
                : incomingList,
          },
        },
      };
    }
    case actionTypes.GET_ALL_EXERCISES_SET_DATA_FAILED:
      return {
        ...state,
        exercisesSpinner: false,
        errorModal: true,
      };

    // ============= GET_MY_EXERCISES_SET_DATA ===================
    case actionTypes.GET_MY_EXERCISES_SET_DATA_REQUEST:
      return {
        ...state,
        exercisesSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_MY_EXERCISES_SET_DATA_SUCCESS: {
      const incomingList = action.payload?.data?.data || [];
      const page = action.meta?.page || 1;

      return {
        ...state,
        exercisesSpinner: false,
        errorModal: false,
        myExercisesSetData: {
          ...action.payload,
          data: {
            ...action.payload.data,
            data:
              page > 1
                ? [
                    ...(state.myExercisesSetData?.data?.data || []),
                    ...incomingList,
                  ]
                : incomingList,
          },
        },
      };
    }
    case actionTypes.GET_MY_EXERCISES_SET_DATA_FAILED:
      return {
        ...state,
        exercisesSpinner: false,
        errorModal: true,
      };

    // ============= GET_EXERCISES_SET_DETAIL_DATA ===================
    case actionTypes.GET_EXERCISES_SET_DETAIL_DATA_REQUEST:
      return {
        ...state,
        exercisesSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_EXERCISES_SET_DETAIL_DATA_SUCCESS: {
      return {
        ...state,
        exercisesSpinner: true,
        exercisesSetDetailData: action.payload,
        errorModal: false,
      };
    }
    case actionTypes.GET_EXERCISES_SET_DETAIL_DATA_FAILED:
      return {
        ...state,
        exercisesSpinner: false,
        errorModal: true,
      };

    default:
      return state;
  }
};
