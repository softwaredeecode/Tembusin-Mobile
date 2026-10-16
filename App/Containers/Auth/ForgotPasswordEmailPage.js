import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';
import { BASE_URL, AUTH } from '../../Api/GlobalUrl';

//components
import Header from '../../Components/Header';
import TextInputComponent from '../../Components/TextInputComponent';
import ErrorModal from '../../Components/ErrorModal';

const ForgotPasswordEmailPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleForgotPassword = async () => {
    const url = `${BASE_URL}${AUTH.forgotPassword}`;

    const payload = {
      email: email.toLowerCase(),
    };

    try {
      setLoading(true);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      if (response.ok) {
        navigation.navigate('ForgotPasswordOTPPage', { email: payload.email });
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
      <Header headerText={'Lupa Password'} enableBack={true} />
      <View style={styles.body}>
        <Text style={styles.headerText}>
          Masukan email kamu yang sudah terdaftar
        </Text>
        <TextInputComponent
          title={'Email'}
          placeholder={'Contoh: john.doe@email.com'}
          setValue={setEmail}
          value={email}
          autoCapitalize={false}
        />
        <TouchableOpacity
          style={
            email == '' ? styles.disableRegisterButton : styles.registerButton
          }
          onPress={() => {
            handleForgotPassword();
          }}
          disabled={loading || email == ''}
        >
          {loading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.registerText}>Kirim OTP</Text>
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

export default ForgotPasswordEmailPage;

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
