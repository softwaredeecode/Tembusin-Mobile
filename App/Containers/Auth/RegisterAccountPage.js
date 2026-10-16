import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../Redux/Actions';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

//components
import TextInputComponent from '../../Components/TextInputComponent';
import ErrorModal from '../../Components/ErrorModal';

const RegisterAccountPage = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { registerResponse, registerSpinner, errorModal } = useSelector(
    state => state.register,
  );
  const selectedAccountType = props?.route?.params?.selectedAccount;
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    const payload = {
      email: email.toLowerCase(),
      field_type: selectedAccountType == 'ptn' ? 2 : 1,
      password: password,
      full_name: fullname,
    };
    const result = await dispatch(ActionStudent.PostRegister(payload));
    console.log(result, 'RESPONSE')
    if (result.status === 200 || result.status === 201) {
      const data = {
        selectedAccountType: selectedAccountType,
        fullname: fullname,
        email: email,
        password: password,
        registerResponse: result,
      };
      navigation.navigate('RegisterOTPPage', { data });
    } else {
      setShowErrorModal(true);
      setErrorMessage(result.data.message);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.registerTitle}>Mulai langkahmu jadi Juara!</Text>
        <Text style={styles.description}>
          Daftar sekarang dan mulai perjalanan menuju prestasi serta mimpi yang
          ingin kamu tembus.
        </Text>
        <View style={styles.textInputContainer}>
          <TextInputComponent
            title={'Nama lengkap'}
            placeholder={'Contoh: John Doe'}
            setValue={setFullname}
            value={fullname}
          />
          <View style={styles.divider}>
            <TextInputComponent
              title={'Email'}
              placeholder={'Contoh: john.doe@email.com'}
              setValue={setEmail}
              value={email}
              autoCapitalize={false}
            />
          </View>
          <View style={styles.divider}>
            <TextInputComponent
              title={'Password'}
              placeholder={'Masukan password'}
              inputType={'password'}
              setValue={setPassword}
              value={password}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => {
            handleRegister();
          }}
          disabled={registerSpinner}
        >
          {registerSpinner ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.registerText}>Daftar</Text>
          )}
        </TouchableOpacity>
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Atau daftar dengan</Text>
          <View style={styles.line} />
        </View>
        <TouchableOpacity style={styles.registerWithButton}>
          <Image
            source={require('../../Assets/Images/googleLogo.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.registerWithText}>Daftar dengan Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.registerWithButton}>
          <Image
            source={require('../../Assets/Images/appleLogo.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.registerWithText}>Daftar dengan Apple</Text>
        </TouchableOpacity>
        <View style={styles.noAccContainer}>
          <Text>Sudah punya akun?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginPage')}>
            <Text style={styles.registerButtonText}>Masuk Sekarang</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.termsAndCondContainer}>
        <Text style={styles.termsAndCondText}>
          Dengan mendaftar, kamu menyetujui Kebijakan Privasi dan Syarat &
          Ketentuan Tembus.in termasuk Penggunaan Cookie.
        </Text>
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

export default RegisterAccountPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  registerTitle: {
    fontSize: 32,
    fontFamily: Fonts.Medium,
    lineHeight: 40,
    color: Colors.neutral900,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.Regular,
    lineHeight: 20,
    color: Colors.neutral500,
    marginTop: 9,
  },
  textInputContainer: {
    marginTop: 28,
  },
  divider: {
    marginTop: 16,
  },
  forgotPasswordRow: {
    flexDirection: 'row',
    marginTop: 6,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: Colors.product900,
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
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
  registerText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.white,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.neutral200,
  },
  orText: {
    marginHorizontal: 8,
    fontFamily: Fonts.Regular,
    fontSize: 12,
    color: Colors.neutral500,
  },
  registerWithButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    height: 40,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  registerWithText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.neutral900,
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  noAccContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  registerButtonText: {
    fontFamily: Fonts.Bold,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.product900,
  },
  termsAndCondContainer: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  termsAndCondText: {
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
    fontFamily: Fonts.Regular,
    textAlign: 'center',
  },
});
