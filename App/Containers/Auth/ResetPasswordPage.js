import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

// api
import { BASE_URL, AUTH } from '../../Api/GlobalUrl';

// components
import Header from '../../Components/Header';
import TextInputComponent from '../../Components/TextInputComponent';
import ErrorModal from '../../Components/ErrorModal';

const MIN_PASSWORD_LENGTH = 8;

const ResetPasswordPage = props => {
  const navigation = useNavigation();
  const { resetToken } = props?.route?.params || {};

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isFormValid = password.length >= MIN_PASSWORD_LENGTH && confirmPassword.length >= MIN_PASSWORD_LENGTH;

  const handleResetPassword = async () => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      setShowErrorModal(true);
      setErrorMessage(`Password minimal ${MIN_PASSWORD_LENGTH} karakter.`);
      return;
    }

    if (password !== confirmPassword) {
      setShowErrorModal(true);
      setErrorMessage('Konfirmasi password tidak sesuai.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}${AUTH.resetPassword}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify({ new_password: password }),
      });
      const json = await response.json();

      if (response.ok) {
        Alert.alert(
          'Berhasil',
          'Password kamu berhasil diubah, silakan masuk kembali.',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'LoginPage' }],
                }),
            },
          ],
        );
      } else {
        setShowErrorModal(true);
        setErrorMessage(json?.message || 'Terjadi Kesalahan');
      }
    } catch (error) {
      setShowErrorModal(true);
      setErrorMessage('Terjadi Kesalahan, silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header headerText={'Buat Password Baru'} enableBack={true} />
      <View style={styles.body}>
        <Text style={styles.headerText}>
          Buat password baru untuk akun kamu
        </Text>
        <TextInputComponent
          title={'Password Baru'}
          placeholder={'Masukan password baru'}
          inputType={'password'}
          setValue={setPassword}
          value={password}
        />
        <View style={styles.divider}>
          <TextInputComponent
            title={'Konfirmasi Password'}
            placeholder={'Masukan ulang password baru'}
            inputType={'password'}
            setValue={setConfirmPassword}
            value={confirmPassword}
          />
        </View>
        <TouchableOpacity
          style={
            isFormValid ? styles.registerButton : styles.disableRegisterButton
          }
          onPress={handleResetPassword}
          disabled={loading || !isFormValid}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.registerText}>Simpan Password</Text>
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
  );
};

export default ResetPasswordPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  body: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  headerText: {
    fontFamily: Fonts.Medium,
    fontSize: 16,
    lineHeight: 20,
    color: Colors.neutral900,
    marginBottom: 24,
  },
  divider: {
    marginTop: 16,
  },
  registerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.product900,
    borderRadius: 6,
    height: 40,
    alignItems: 'center',
    marginTop: 28,
  },
  disableRegisterButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.neutral500,
    borderRadius: 6,
    height: 40,
    alignItems: 'center',
    marginTop: 28,
  },
  registerText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.white,
  },
});
