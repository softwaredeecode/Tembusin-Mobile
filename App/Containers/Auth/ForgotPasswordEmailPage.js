import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';
import { BASE_URL } from '../../Api/GlobalUrl';

//components
import Header from '../../Components/Header';
import TextInputComponent from '../../Components/TextInputComponent';
import ErrorModal from '../../Components/ErrorModal';

const ForgotPasswordEmailPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleForgotPassword = async () => {
    const url = `${BASE_URL}/forgot-password`;

    const payload = {
      email: email,
    };

    try {
      setLoading(true);
      console.log('📡 [FORGOT PASSWORD] Request URL:', url);
      console.log('📤 [FORGOT PASSWORD] Payload:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      console.log('📦 [FORGOT PASSWORD] Response:', json);

      if (response.ok) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginPage' }],
        });
        return json;
      } else {
        setShowErrorModal(true);
        setErrorMessage(json.message);
      }
    } catch (error) {
      console.log('❌ [FORGOT PASSWORD] Error:', error);
      setShowErrorModal(true);
      setErrorMessage('Terjadi Kesalahan');
      throw error;
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
