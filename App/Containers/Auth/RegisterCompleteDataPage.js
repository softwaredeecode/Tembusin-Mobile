import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

//components
import Header from '../../Components/Header';
import Stepper from '../../Components/Stepper';
import TextInputComponent from '../../Components/TextInputComponent';
import InputDatePicker from '../../Components/InputDatePicker';
import { formatDateToYYYYMMDD } from '../../Utils/Helper';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

const RegisterCompleteDataPage = props => {
  const navigation = useNavigation();
  const registrationData = props?.route?.params?.data;
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinueOnPress = () => {
    const formattedBirthDate = formatDateToYYYYMMDD(birthDate);
    const data = {
      fullName: registrationData.userDetail.full_name,
      userId: registrationData.userDetail.id,
      dateOfBirth: formattedBirthDate,
      gender: gender === 'male' ? 'l' : 'p',
      phone: phoneNumber,
    };
    if (registrationData.selectedAccountType == 'cpns') {
      navigation.navigate('RegisterCPNSPage', { data });
    } else if (registrationData.selectedAccountType == 'ptn') {
      navigation.navigate('RegisterPTNPage', { data });
    }
  };

  console.log(formatDateToYYYYMMDD(birthDate), 'birthDate')

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Header headerText={'Setup profil'} enableBack={true} />
        <Stepper total={3} current={2} />
        <ScrollView
          style={styles.childContainer}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.titleText}>
            Lengkapi profilmu untuk langkah belajar yang lebih fokus
          </Text>
          <TextInputComponent
            title={'Nama lengkap'}
            disabled={true}
            value={registrationData.userDetail.full_name}
          />
          <View style={styles.divider}>
            <InputDatePicker
              title="Tanggal lahir"
              value={birthDate}
              setValue={setBirthDate}
              placeholder="00/00/0000"
            />
          </View>
          <View style={styles.divider}>
            <Text style={styles.title}>Jenis Kelamin</Text>
            <View style={styles.chooseGenderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderContainer,
                  gender == 'male' && styles.selectedGenderContainer,
                ]}
                onPress={() => setGender('male')}
              >
                <View style={styles.row}>
                  <Icon
                    name={'male'}
                    size={16}
                    color={
                      gender == 'male' ? Colors.product900 : Colors.neutral500
                    }
                  />
                  <Text
                    style={[
                      styles.genderText,
                      gender == 'male' && styles.selectedGenderText,
                    ]}
                  >
                    Laki-laki
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderContainer,
                  gender == 'female' && styles.selectedGenderContainer,
                ]}
                onPress={() => setGender('female')}
              >
                <View style={styles.row}>
                  <Icon
                    name={'female'}
                    size={16}
                    color={
                      gender == 'female' ? Colors.product900 : Colors.neutral500
                    }
                  />
                  <Text
                    style={[
                      styles.genderText,
                      gender == 'female' && styles.selectedGenderText,
                    ]}
                  >
                    Perempuan
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.divider}>
            <TextInputComponent
              title={'Nomor telepon'}
              value={phoneNumber}
              placeholder={'Input nomor telepon'}
              keyboardType={'phone-pad'}
              setValue={setPhoneNumber}
              leftIcon="call-outline"
            />
          </View>
          <View style={styles.informationTipPhoneNumberContainer}>
            <Icon
              name={'information-circle-outline'}
              size={16}
              color={Colors.product900}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.informationTipTitle}>
                Pastikan nomor telponmu terdaftar pada aplikasi WhatsApp.
              </Text>
              <Text style={styles.descTip}>
                Kamu akan membutuhkannya untuk bergabung dengan grup WhatsApp
                pada Latihan Soal, Try Out dan lainnya.
              </Text>
            </View>
          </View>
          <View style={styles.divider}>
            <TextInputComponent
              title={'Email'}
              disabled={true}
              value={registrationData.userDetail.email}
              leftIcon="mail-outline"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinueOnPress}
            >
              <Text style={styles.continueText}>Lanjut</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.laterButton}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'LoginPage' }],
                })
              }
            >
              <Text style={styles.laterText}>Nanti saja</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterCompleteDataPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  childContainer: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  titleText: {
    fontFamily: Fonts.Medium,
    fontSize: 16,
    lineHeight: 20,
    color: Colors.neutral900,
    marginBottom: 24,
  },
  divider: {
    marginTop: 16,
  },
  title: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chooseGenderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderContainer: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 6,
  },
  selectedGenderContainer: {
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
  },
  genderText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  selectedGenderText: {
    color: Colors.product900,
  },
  informationTipPhoneNumberContainer: {
    marginTop: 16,
    padding: 8,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    flexDirection: 'row',
    gap: 8,
  },
  informationTipTitle: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  descTip: {
    marginTop: 4,
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  buttonContainer: {
    paddingBottom: 12,
  },
  continueButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.product900,
    borderRadius: 6,
    height: 40,
    alignItems: 'center',
    marginTop: 28,
  },
  continueText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.white,
  },
  laterButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    height: 40,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  laterText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.neutral900,
  },
});
