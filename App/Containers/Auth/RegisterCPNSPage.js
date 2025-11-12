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

const RegisterCPNSPage = () => {
  const navigation = useNavigation();
  const [provinceNamePlacement, setProvinceNamePlacement] = useState('');
  const [cityNamePlacement, setCityNamePlacement] = useState('');
  const [formationName, setFormationName] = useState('');
  const [otherFormation, setOtherFormation] = useState('');
  const [provinceName, setProvinceName] = useState('');
  const [cityName, setCityName] = useState('');
  const [district, setDistrictName] = useState('');

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
            <InputDropdown
              title="Provinsi penempatan"
              value={provinceNamePlacement}
              setValue={setProvinceNamePlacement}
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
              title="Kota/Kabupaten penempatan"
              value={cityNamePlacement}
              setValue={setCityNamePlacement}
              placeholder="Contoh: Jakarta Selatan"
              options={[
                'Jakarta Selatan',
                'Jakarta Barat',
                'Jakarta Utara',
                'Jakarta Timur',
              ]}
            />
          </View>
          <View style={styles.divider}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputDropdown
                  title="Formasi"
                  value={formationName}
                  setValue={setFormationName}
                  placeholder="Pilih formasi"
                  options={['Formasi A', 'Formasi B', 'Formasi C', 'Lainnya']}
                />
              </View>
              {formationName === 'Lainnya' && (
                <View style={{ flex: 1 }}>
                  <TextInputComponent
                    title=""
                    placeholder="Tulis formasi"
                    value={otherFormation}
                    setValue={setOtherFormation}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
        <View style={styles.fromCityContainer}>
          <Text style={styles.informationGoalsTitle}>Daerah asal</Text>
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
          <View style={styles.divider}>
            <InputDropdown
              title="Kecamatan"
              value={district}
              setValue={setDistrictName}
              placeholder="Contoh: Tanjung Duren"
              options={['Grogol', 'Petamburan', 'Setiabudi', 'Tuminting']}
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

export default RegisterCPNSPage;

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
