import * as actionTypes from '../Constants/Types';

const initialState = {
  latestForumData: [],
  trendingForumData: [],
  comments: [],
  addComment: [],
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

    // ============= GET_COMMENTS ===================
    case actionTypes.GET_COMMENTS_REQUEST:
      return {
        ...state,
        forumSpinner: true,
        errorModal: false,
      };
    case actionTypes.GET_COMMENTS_SUCCESS:
      return {
        ...state,
        comments: [...state.comments, ...action.payload.comments],
        forumSpinner: false,
        errorModal: false,
      };
    case actionTypes.GET_COMMENTS_FAILED:
      return {
        ...state,
        forumSpinner: false,
        errorModal: true,
      };

    // ============= ADD_COMMENT ===================
    case actionTypes.ADD_COMMENT_REQUEST:
      return {
        ...state,
        forumSpinner: true,
        errorModal: false,
      };
    case actionTypes.ADD_COMMENT_SUCCESS:
      return {
        ...state,
        addComment: action.payload.addComment,
        forumSpinner: false,
        errorModal: false,
      };
    case actionTypes.ADD_COMMENT_FAILED:
      return {
        ...state,
        forumSpinner: false,
        errorModal: true,
      };

    // ============= ADD_POST ===================
    case actionTypes.ADD_POST_REQUEST:
      return {
        ...state,
        forumSpinner: true,
        errorModal: false,
      };
    case actionTypes.ADD_POST_SUCCESS:
      return {
        ...state,
        forumSpinner: false,
        errorModal: false,
      };
    case actionTypes.ADD_POST_FAILED:
      return {
        ...state,
        forumSpinner: false,
        errorModal: true,
      };

    // ============= RESET_STATE ===================
    case actionTypes.RESET_COMMENTS_STATE:
      return {
        ...state,
        comments: [],
      };

    default:
      return state;
  }
};
