import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

//components
import Header from '../../Components/Header';
import Stepper from '../../Components/Stepper';
import TextInputComponent from '../../Components/TextInputComponent';
import InputDropdown from '../../Components/InputDropdown';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

const RegisterPTNPage = () => {
  const navigation = useNavigation();
  const [universityName, setUniversityName] = useState('');
  const [studyProgram, setStudyProgram] = useState('');
  const [otherStudyProgram, setOtherStudyProgram] = useState('');
  const [educationLevel, setEducationLevel] = useState('');

  const [schoolName, setSchoolName] = useState('');
  const [cityName, setCityName] = useState('');
  const [provinceName, setProvinceName] = useState('');

  return (
    <View style={styles.container}>
      <Header headerText={'Setup profil'} enableBack={true} />
      <Stepper total={3} current={3} />
      <ScrollView
        style={styles.childContainer}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.titleText}>
          Tentukan tujuan yang ingin kamu capai!
        </Text>
        <View style={styles.informationGoalsContainer}>
          <Text style={styles.informationGoalsTitle}>Informasi Tujuan</Text>
          <View style={styles.divider}>
            <TextInputComponent
              title="Perguruan tinggi impian"
              placeholder="Contoh: Universitas Indonesia"
              value={universityName}
              setValue={setUniversityName}
            />
          </View>
          <View style={styles.divider}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputDropdown
                  title="Program studi"
                  value={studyProgram}
                  setValue={setStudyProgram}
                  placeholder="Contoh: Hukum"
                  options={[
                    'Hukum',
                    'Teknologi Informatika',
                    'Mobile Application & Technology',
                    'Cyber Security',
                    'Game Developer',
                    'Lainnya',
                  ]}
                />
              </View>
              {studyProgram === 'Lainnya' && (
                <View style={{ flex: 1 }}>
                  <TextInputComponent
                    title=""
                    placeholder="Tulis program studi"
                    value={otherStudyProgram}
                    setValue={setOtherStudyProgram}
                  />
                </View>
              )}
            </View>
          </View>
          <View style={styles.divider}>
            <InputDropdown
              title="Jenjang"
              value={educationLevel}
              setValue={setEducationLevel}
              placeholder="Contoh: S1 - Sarjana"
              options={[
                'D1 - Diploma 1',
                'D2 - Diploma 2',
                'D3 - Diploma 3',
                'S1 - Sarjana',
                'S2 - Master',
                'S2 - Doktor',
              ]}
            />
          </View>
        </View>
        <View style={styles.fromCityContainer}>
          <Text style={styles.informationGoalsTitle}>Sekolah asal</Text>
          <View style={styles.divider}>
            <TextInputComponent
              title="Nama sekolah"
              placeholder="Contoh: SMAN 70 Jakarta"
              value={schoolName}
              setValue={setSchoolName}
            />
          </View>

          <View style={styles.divider}>
            <InputDropdown
              title="Provinsi"
              value={provinceName}
              setValue={setProvinceName}
              placeholder="Contoh: DKI Jakarta"
              options={[
                'DKI Jakarta',
                'Sulawesi Utara',
                'Sulawesi Selatan',
                'Bali',
                'Jawa Timur',
                'Jawa Barat',
              ]}
            />
          </View>
          <View style={styles.divider}>
            <InputDropdown
              title="Kota/Kabupaten"
              value={cityName}
              setValue={setCityName}
              placeholder="Contoh: Jakarta Selatan"
              options={[
                'Jakarta Selatan',
                'Jakarta Barat',
                'Jakarta Utara',
                'Jakarta Timur',
              ]}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() =>
              navigation.reset({
                index: 0,
                routes: [{ name: 'LoginPage' }],
              })
            }
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
    </View>
  );
};

export default RegisterPTNPage;

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
  informationGoalsTitle: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.product900,
  },
  divider: {
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  informationGoalsContainer: {
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  fromCityContainer: {
    paddingTop: 24,
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
