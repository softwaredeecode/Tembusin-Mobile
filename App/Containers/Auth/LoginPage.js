import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//context
import { AuthContext } from '../../Context/AuthContext';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../Redux/Actions';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

//components
import TextInputComponent from '../../Components/TextInputComponent';

const LoginPage = () => {
  const dispatch = useDispatch();
  const { loginResponse, loginSpinner, errorModal } = useSelector(
    state => state.login,
  );
  const { signIn } = useContext(AuthContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const payload = {
      identifier: email.toLowerCase(),
      password: password,
    };
    await dispatch(ActionStudent.Login(payload));
  };

  useEffect(() => {
    const saveToken = async () => {
      if (loginResponse && loginResponse.status === 200) {
        try {
          await AsyncStorage.multiSet([
            ['auth_token', loginResponse.data.token],
            ['user_data', JSON.stringify(loginResponse.data.user)],
          ]);
          signIn();
        } catch (error) {
          console.log('Failed to save token', error);
        }
      }
    };

    saveToken();
  }, [loginResponse]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.loginTitle}>Saatnya jadi generasi Juara!</Text>
        <Text style={styles.description}>
          Waktunya kembali menembus targetmu dan melangkah lebih jauh.
        </Text>
        <View style={styles.textInputContainer}>
          <TextInputComponent
            title={'Email atau username'}
            placeholder={'Contoh: john.doe@email.com'}
            setValue={setEmail}
            value={email}
          />
          <View style={styles.divider}>
            <TextInputComponent
              title={'Password'}
              placeholder={'Masukan password'}
              inputType={'password'}
              setValue={setPassword}
              value={password}
            />
          </View>
          <View style={styles.forgotPasswordRow}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity>
              <Text style={styles.forgotPasswordText}>Lupa Password?</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Atau masuk dengan</Text>
          <View style={styles.line} />
        </View>
        <TouchableOpacity style={styles.loginWithButton}>
          <Image
            source={require('../../Assets/Images/googleLogo.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.loginWithText}>Login dengan Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginWithButton}>
          <Image
            source={require('../../Assets/Images/appleLogo.png')}
            style={styles.image}
            resizeMode="contain"
          />
          <Text style={styles.loginWithText}>Login dengan Apple</Text>
        </TouchableOpacity>
        <View style={styles.noAccContainer}>
          <Text>Belum punya akun?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('RegisterChooseAccountPage')}
          >
            <Text style={styles.registerButtonText}>Daftar Sekarang</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.termsAndCondContainer}>
        <Text style={styles.termsAndCondText}>
          Dengan log in, kamu menyetujui Kebijakan Privasi dan Syarat &
          Ketentuan Tembus.in termasuk Penggunaan Cookie.
        </Text>
      </View>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  loginTitle: {
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
  loginButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.product900,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 28,
  },
  loginText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
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
  loginWithButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  loginWithText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
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
