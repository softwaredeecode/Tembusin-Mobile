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
  exerciseDetailContent: {},
  startNewAttemptData: {},
  comingSoonExerciseData: {},
  exerciseAttemptList: [],
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
        exercisesSpinner: false,
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

    // ============= GET_EXERCISES_DETAIL_CONTENT ===================
    case actionTypes.GET_EXERCISES_DETAIL_CONTENT_REQUEST:
      return {
        ...state,
        exercisesSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_EXERCISES_DETAIL_CONTENT_SUCCESS: {
      return {
        ...state,
        exercisesSpinner: false,
        exerciseDetailContent: action.payload,
        errorModal: false,
      };
    }
    case actionTypes.GET_EXERCISES_DETAIL_CONTENT_FAILED:
      return {
        ...state,
        exercisesSpinner: false,
        errorModal: true,
      };

    // ============= POST_START_NEW_ATTEMPT ===================
    case actionTypes.POST_START_NEW_ATTEMPT_REQUEST:
      return {
        ...state,
        exercisesSpinner: true,
        errorModal: false,
      };
    case actionTypes.POST_START_NEW_ATTEMPT_SUCCESS: {
      return {
        ...state,
        exercisesSpinner: false,
        startNewAttemptData: action.payload,
        errorModal: false,
      };
    }
    case actionTypes.POST_START_NEW_ATTEMPT_FAILED:
      return {
        ...state,
        exercisesSpinner: false,
        errorModal: true,
      };

    // ============= GET_ATTEMPT_LIST ===================
    case actionTypes.GET_ATTEMPT_LIST_REQUEST:
      return {
        ...state,
        exercisesSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_ATTEMPT_LIST_SUCCESS: {
      return {
        ...state,
        exercisesSpinner: false,
        errorModal: false,
        exerciseAttemptList: action.payload,
      };
    }
    case actionTypes.GET_ATTEMPT_LIST_FAILED:
      return {
        ...state,
        exercisesSpinner: false,
        errorModal: true,
      };

    // ============= GET_COMMING_SOON_EXERCISE ===================
    case actionTypes.GET_COMMING_SOON_EXERCISE_REQUEST:
      return {
        ...state,
        exercisesSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_COMMING_SOON_EXERCISE_SUCCESS: {
      return {
        ...state,
        exercisesSpinner: false,
        comingSoonExerciseData: action.payload,
        errorModal: false,
      };
    }
    case actionTypes.GET_COMMING_SOON_EXERCISE_FAILED:
      return {
        ...state,
        exercisesSpinner: false,
        errorModal: true,
      };

    default:
      return state;
  }
};
