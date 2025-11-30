import * as actionTypes from '../Constants/Types';

const initialState = {
  latestForumData: [],
  trendingForumData: [],
  forumSpinner: false,
  errorModal: false,
};

export const ForumReducer = (state = initialState, action) => {
  switch (action.type) {
    // ============= GET_LATEST_FORUM_DATA ===================
    case actionTypes.GET_LATEST_FORUM_DATA_REQUEST:
      return {
        ...state,
        forumSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_LATEST_FORUM_DATA_SUCCESS:
      return {
        ...state,
        latestForumData: action.payload.latestForumData,
        forumSpinner: false,
        errorModal: false,
      };
    case actionTypes.GET_LATEST_FORUM_DATA_FAILED:
      return {
        ...state,
        forumSpinner: false,
        errorModal: true,
      };

    // ============= GET_TRENDING_FORUM_DATA ===================
    case actionTypes.GET_TRENDING_FORUM_DATA_REQUEST:
      return {
        ...state,
        forumSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_TRENDING_FORUM_DATA_SUCCESS:
      return {
        ...state,
        trendingForumData: action.payload.trendingForumData,
        forumSpinner: false,
        errorModal: false,
      };
    case actionTypes.GET_TRENDING_FORUM_DATA_FAILED:
      return {
        ...state,
        forumSpinner: false,
        errorModal: true,
      };

    default:
      return state;
  }
};
