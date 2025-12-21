import * as actionTypes from '../Constants/Types';

const initialState = {
  registerResponse: [],
  registerVerifyOtpResponse: [],
  resendOtpResponse: [],
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
        registerResponse: action.payload,
        registerSpinner: false,
        errorModal: false,
      };
    case actionTypes.POST_REGISTER_FAILED:
      return {
        ...state,
        registerSpinner: false,
        errorModal: true,
      };

    // ============= REGISTER_VERIFY_OTP ===================
    case actionTypes.REGISTER_VERIFY_OTP_REQUEST:
      return {
        ...state,
        registerSpinner: true,
        errorModal: false,
      };
    case actionTypes.REGISTER_VERIFY_OTP_SUCCESS:
      return {
        ...state,
        registerVerifyOtpResponse: action.payload,
        registerSpinner: false,
        errorModal: false,
      };
    case actionTypes.REGISTER_VERIFY_OTP_FAILED:
      return {
        ...state,
        registerSpinner: false,
        errorModal: true,
      };

    // ============= RESEND_OTP_REGISTER ===================
    case actionTypes.RESEND_OTP_REGISTER_REQUEST:
      return {
        ...state,
        registerSpinner: true,
        errorModal: false,
      };
    case actionTypes.RESEND_OTP_REGISTER_SUCCESS:
      return {
        ...state,
        resendOtpResponse: action.payload,
        registerSpinner: false,
        errorModal: false,
      };
    case actionTypes.RESEND_OTP_REGISTER_FAILED:
      return {
        ...state,
        registerSpinner: false,
        errorModal: true,
      };

    // ============= RESET_STATE ===================
    case actionTypes.RESET_REGISTER_STATE:
      return {
        ...state,
        registerVerifyOtpResponse: [],
        resendOtpResponse: [],
      };

    default:
      return state;
  }
};
