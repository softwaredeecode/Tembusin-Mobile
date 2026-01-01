import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// components
import MainHeader from '../../Components/MainHeader';
import ErrorModal from '../../Components/ErrorModal';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../Redux/Actions';
import * as ActionTypes from '../../Redux/Constants/Types';

// theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

const RegisterOTPPage = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { registerVerifyOtpResponse, registerSpinner, errorModal } =
    useSelector(state => state.register);
  const registerData = props?.route?.params?.data;
  const RESEND_TIME = 60;
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputsRef = useRef([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }

    const isComplete = newOtp.every(d => d !== '');
    if (isComplete) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputsRef.current[index - 1].focus();
      }
    }
  };

  const startCountdown = () => {
    if (timerRef.current) return;

    setCountdown(RESEND_TIME);

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    const payload = {
      email: registerData.email.toLowerCase(),
    };
    const result = await dispatch(ActionStudent.RegisterResendOtp(payload));
    if (result.status === 200) {
      startCountdown();
    } else {
      setShowErrorModal(true);
      setErrorMessage(result?.data?.message);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    const payload = {
      email: registerData.email.toLowerCase(),
      field_type: registerData.selectedAccountType === 'ptn' ? 1 : 2,
      password: registerData.password,
      username: registerData.fullname,
      otp_code: otpCode,
    };
    const result = await dispatch(ActionStudent.RegisterVerifyOtp(payload));
    if (result.status === 201) {
      const data = {
        selectedAccountType: registerData.selectedAccountType,
        fullname: registerData.fullname,
        email: registerData.email,
        password: registerData.password,
      };
      navigation.navigate('RegisterCompleteDataPage', {
        data,
      });
      dispatch({ type: ActionTypes.RESET_REGISTER_STATE });
    } else {
      setShowErrorModal(true);
      setErrorMessage(result?.data?.message);
    }
  };

  useEffect(() => {
    startCountdown();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <MainHeader
            title={'Verifikasi'}
            onBackPress={() => {
              dispatch({ type: ActionTypes.RESET_REGISTER_STATE });
            }}
          />

          <View style={styles.body}>
            <Text style={styles.titleText}>Verifikasi Email Kamu</Text>

            <Text style={styles.emailInfoTitleText}>
              Kami telah mengirim kode OTP ke
            </Text>

            <Text style={styles.emailInfoText}>
              {registerData.registerResponse.data.email}
            </Text>

            {/* OTP INPUT */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputsRef.current[index] = ref)}
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={value => handleChange(value, index)}
                  onKeyPress={e => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  autoFocus={index === 0}
                />
              ))}
            </View>

            <View style={styles.resendContainer}>
              <Text style={styles.instructionText}>Tidak menerima kode?</Text>
              <TouchableOpacity
                disabled={countdown > 0}
                onPress={handleResendOtp}
              >
                <Text
                  style={[
                    styles.resendButton,
                    countdown > 0 && { color: Colors.neutral500 },
                  ]}
                >
                  {countdown > 0
                    ? `Kirim ulang (${countdown}s)`
                    : 'Kirim ulang'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* BOTTOM FIXED BUTTON */}
        <View style={styles.bottomComponent}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleVerifyOtp}
              style={styles.verificationContainer}
            >
              <Text style={styles.verificationText}>Verifikasi</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ErrorModal
          visible={showErrorModal}
          description={errorMessage}
          onClose={() => {
            setShowErrorModal(false);
            setErrorMessage('');
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RegisterOTPPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  body: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  titleText: {
    fontFamily: Fonts.Medium,
    fontSize: 20,
    lineHeight: 24,
    color: Colors.neutral900,
  },
  emailInfoTitleText: {
    marginTop: 9,
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
  },
  emailInfoText: {
    fontFamily: Fonts.Bold,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
    marginBottom: 32,
  },

  /* OTP */
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    fontSize: 32,
    lineHeight: 40,
    fontFamily: Fonts.SemiBold,
    color: Colors.black,
    backgroundColor: Colors.neutral50,
  },
  resendContainer: {
    marginTop: 40,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.Regular,
    color: Colors.neutral500,
  },
  resendButton: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.Medium,
    color: Colors.product900,
  },
  bottomComponent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingBottom: 12,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  verificationContainer: {
    padding: 10,
    backgroundColor: Colors.product900,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  verificationText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
