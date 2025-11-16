import * as actionTypes from '../Constants/Types';

const initialState = {
  loginResponse: [],
  loginSpinner: false,
  errorModal: false,
};

export const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    // ============= LOGIN ===================
    case actionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loginSpinner: true,
        errorModal: false,
      };
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loginResponse: action.payload.loginResponse,
        loginSpinner: false,
        errorModal: false,
      };
    case actionTypes.LOGIN_FAILED:
      return {
        ...state,
        loginSpinner: false,
        errorModal: true,
      };

    default:
      return state;
  }
};
