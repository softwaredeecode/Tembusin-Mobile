import * as actionTypes from '../Constants/Types';

const initialState = {
  resgiterResponse: [],
  registerSpinner: false,
  errorModal: false,
};

export const RegisterReducer = (state = initialState, action) => {
  switch (action.type) {
    // ============= POST_REGISTER ===================
    case actionTypes.POST_REGISTER_REQUEST:
      return {
        ...state,
        registerSpinner: true,
        errorModal: false,
      };
    case actionTypes.POST_REGISTER_SUCCESS:
      return {
        ...state,
        registerResponse: action.payload.registerResponse,
        registerSpinner: false,
        errorModal: false,
      };
    case actionTypes.POST_REGISTER_FAILED:
      return {
        ...state,
        registerSpinner: false,
        errorModal: true,
      };

    default:
      return state;
  }
};
