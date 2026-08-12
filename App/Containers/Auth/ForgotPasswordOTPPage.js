import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// components
import MainHeader from '../../Components/MainHeader';
import ErrorModal from '../../Components/ErrorModal';

// api
import { BASE_URL, AUTH } from '../../Api/GlobalUrl';

// theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

const RESEND_TIME = 60;
const OTP_LENGTH = 4;

const ForgotPasswordOTPPage = props => {
  const navigation = useNavigation();
  const email = props?.route?.params?.email;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const inputsRef = useRef([]);

  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  useEffect(() => {
    startCountdown();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus();
    }

    if (newOtp.every(d => d !== '')) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key !== 'Backspace') return;

    const newOtp = [...otp];
    if (otp[index]) {
      newOtp[index] = '';
      setOtp(newOtp);
    } else if (index > 0) {
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputsRef.current[index - 1].focus();
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0 || resending) return;

    try {
      setResending(true);
      const response = await fetch(`${BASE_URL}${AUTH.forgotPassword}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const json = await response.json();

      if (response.ok) {
        startCountdown();
      } else {
        setShowErrorModal(true);
        setErrorMessage(json?.message || 'Terjadi Kesalahan');
      }
    } catch (error) {
      setShowErrorModal(true);
      setErrorMessage('Terjadi Kesalahan, silakan coba lagi.');
    } finally {
      setResending(false);
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < OTP_LENGTH) {
      setShowErrorModal(true);
      setErrorMessage('Masukan 4 digit kode OTP.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${BASE_URL}${AUTH.verifyOtpForgotPassword}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp_code: otpCode }),
        },
      );
      const json = await response.json();

      if (response.ok) {
        navigation.navigate('ResetPasswordPage', {
          email,
          resetToken: json.reset_token,
        });
      } else {
        setShowErrorModal(true);
        setErrorMessage(json?.message || 'Kode OTP tidak valid.');
      }
    } catch (error) {
      setShowErrorModal(true);
      setErrorMessage('Terjadi Kesalahan, silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <MainHeader title={'Verifikasi'} />

          <View style={styles.body}>
            <Text style={styles.titleText}>Verifikasi Email Kamu</Text>

            <Text style={styles.emailInfoTitleText}>
              Kami telah mengirim kode OTP ke
            </Text>

            <Text style={styles.emailInfoText}>{email}</Text>

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
                disabled={countdown > 0 || resending}
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
          <TouchableOpacity
            onPress={handleVerifyOtp}
            style={styles.verificationContainer}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={styles.verificationText}>Verifikasi</Text>
            )}
          </TouchableOpacity>
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

export default ForgotPasswordOTPPage;

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
  },
  verificationText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
});
