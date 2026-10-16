import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

//components
import Header from '../../Components/Header';
import Stepper from '../../Components/Stepper';
import TextInputComponent from '../../Components/TextInputComponent';
import InputDropdown from '../../Components/InputDropdown';
import ErrorModal from '../../Components/ErrorModal';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

import { BASE_URL } from '../../Api/GlobalUrl';

const RegisterCPNSPage = (props) => {
  const navigation = useNavigation();
  const registrationData = props?.route?.params?.data;
  // const [otherFormation, setOtherFormation] = useState('');

  const debounceRef = useRef(null);

  const [
    provinceListDestinationInformation,
    setProvinceListDestinationInformation,
  ] = useState([]);
  const [
    loadingProvinceDestinationInformation,
    setLoadingProvinceDestinationInformation,
  ] = useState(false);
  const [
    provinceNameDestinationInformation,
    setProvinceNameDestinationInformation,
  ] = useState('');
  const [
    provinceIdDestinationInformation,
    setProvinceIdDestinationInformation,
  ] = useState(null);

  const [
    loadingCityDestinationInformation,
    setLoadingCityDestinationInformation,
  ] = useState(false);
  const [cityListDestinationInformation, setCityListDestinationInformation] =
    useState([]);
  const [cityDestinationInformation, setCityDestinationInformation] =
    useState(null);

  const [loadingFormation, setLoadingFormation] = useState(false);
  const [formationList, setFormationList] = useState([]);
  const [formation, setFormation] = useState(null);

  const [provinceListOrigin, setProvinceListOrigin] = useState([]);
  const [loadingProvinceOrigin, setLoadingProvinceOrigin] = useState(false);
  const [provinceNameOrigin, setProvinceNameOrigin] = useState('');
  const [provinceIdOrigin, setProvinceIdOrigin] = useState(null);

  const [loadingCityOrigin, setLoadingCityOrigin] = useState(false);
  const [cityListOrigin, setCityListOrigin] = useState([]);
  const [cityOrigin, setCityOrigin] = useState(null);

  const [loadingDistrict, setLoadingDistrict] = useState(false);
  const [districtList, setDistrictList] = useState([]);
  const [district, setDistrict] = useState(null);

  const [loadingCreateASN, setLoadingCreateASN] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isFormValid = useMemo(() => {
    return (
      provinceIdDestinationInformation !== null &&
      cityDestinationInformation !== null &&
      formation !== null &&
      provinceIdOrigin !== null &&
      district !== null &&
      cityOrigin !== null
    );
  }, [
    provinceIdDestinationInformation,
    cityDestinationInformation,
    formation,
    provinceIdOrigin,
    district,
    cityOrigin,
  ]);

  //HANDLE PROVINCE
  const fetchProvinceDestinationInformation = async (keyword = '') => {
    const url = `${BASE_URL}/provinces?search=${encodeURIComponent(keyword)}`;

    try {
      setLoadingProvinceDestinationInformation(true);

      // 🔍 PRINT REQUEST
      console.log('📡 [FETCH PROVINCE] Request URL:', url);

      const response = await fetch(url);

      // 🔍 PRINT STATUS HTTP
      console.log(
        '📥 [FETCH PROVINCE] HTTP Status:',
        response.status,
        response.statusText,
      );

      const json = await response.json();

      // 🔍 PRINT RESPONSE BODY
      console.log('📦 [FETCH PROVINCE] Response JSON:', json);

      if (Array.isArray(json) && json.length > 0) {
        setProvinceListDestinationInformation(json);
      } else {
        setProvinceListDestinationInformation([]);
      }
    } catch (error) {
      console.error('❌ [FETCH PROVINCE] Error:', error);
      setProvinceListDestinationInformation([]);
    } finally {
      setLoadingProvinceDestinationInformation(false);
    }
  };
  const onProvinceChangeDestinationInformation = val => {
    setProvinceNameDestinationInformation(val.toUpperCase());

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (val.length < 3) {
      setProvinceListDestinationInformation([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchProvinceDestinationInformation(val.toUpperCase());
    }, 500);
  };

  //HANDLE CITY
  const fetchCityDestiantionInformation = async () => {
    const url = `${BASE_URL}/provinces/${provinceIdDestinationInformation}/regencies`;

    try {
      setLoadingCityDestinationInformation(true);

      // 🔍 PRINT REQUEST
      console.log('📡 [FETCH CITY] Request URL:', url);

      const response = await fetch(url);

      // 🔍 PRINT STATUS HTTP
      console.log(
        '📥 [FETCH CITY] HTTP Status:',
        response.status,
        response.statusText,
      );

      const json = await response.json();

      // 🔍 PRINT RESPONSE BODY
      console.log('📦 [FETCH CITY] Response JSON:', json);

      if (Array.isArray(json) && json.length > 0) {
        setCityListDestinationInformation(json);
      } else {
        setCityListDestinationInformation([]);
      }
    } catch (error) {
      console.error('❌ [FETCH CITY] Error:', error);
      setCityListDestinationInformation([]);
    } finally {
      setLoadingCityDestinationInformation(false);
    }
  };
  useEffect(() => {
    setCityDestinationInformation(null);
    if (provinceIdDestinationInformation) {
      fetchCityDestiantionInformation();
    }
  }, [provinceIdDestinationInformation]);

  //HANDLE FORMATION
  const fetchFormationList = async () => {
    const params = new URLSearchParams();

    if (provinceIdDestinationInformation)
      params.append('province_id', provinceIdDestinationInformation);
    if (cityDestinationInformation?.id)
      params.append('regency_id', cityDestinationInformation.id);

    const url = `${BASE_URL}/formations?${params.toString()}`;

    try {
      setLoadingFormation(true);

      // 🔍 PRINT REQUEST
      console.log('📡 [FETCH FORMATION] Request URL:', url);

      const response = await fetch(url);

      // 🔍 PRINT STATUS HTTP
      console.log(
        '📥 [FETCH FORMATION] HTTP Status:',
        response.status,
        response.statusText,
      );

      const json = await response.json();

      // 🔍 PRINT RESPONSE BODY
      console.log('📦 [FETCH FORMATION] Response JSON:', json);

      if (Array.isArray(json) && json.length > 0) {
        setFormationList(json);
      } else {
        setFormationList([]);
      }
    } catch (error) {
      console.error('❌ [FETCH FORMATION] Error:', error);
      setFormationList([]);
    } finally {
      setLoadingFormation(false);
    }
  };
  useEffect(() => {
    setFormation(null);
    if (provinceIdDestinationInformation && cityDestinationInformation) {
      fetchFormationList();
    }
  }, [provinceIdDestinationInformation, cityDestinationInformation]);

  //HANDLE PROVINCE ORIGIN
  const fetchProvinceOrgin = async (keyword = '') => {
    const url = `${BASE_URL}/provinces?search=${encodeURIComponent(keyword)}`;

    try {
      setLoadingProvinceOrigin(true);

      // 🔍 PRINT REQUEST
      console.log('📡 [FETCH PROVINCE] Request URL:', url);

      const response = await fetch(url);

      // 🔍 PRINT STATUS HTTP
      console.log(
        '📥 [FETCH PROVINCE] HTTP Status:',
        response.status,
        response.statusText,
      );

      const json = await response.json();

      // 🔍 PRINT RESPONSE BODY
      console.log('📦 [FETCH PROVINCE] Response JSON:', json);

      if (Array.isArray(json) && json.length > 0) {
        setProvinceListOrigin(json);
      } else {
        setProvinceListOrigin([]);
      }
    } catch (error) {
      console.error('❌ [FETCH PROVINCE] Error:', error);
      setProvinceListOrigin([]);
    } finally {
      setLoadingProvinceOrigin(false);
    }
  };
  const onProvinceChangeOrigin = val => {
    setProvinceNameOrigin(val.toUpperCase());

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (val.length < 3) {
      setProvinceListOrigin([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchProvinceOrgin(val.toUpperCase());
    }, 500);
  };

  //HANDLE CITY ORIGIN
  const fetchCityOrigin = async () => {
    const url = `${BASE_URL}/provinces/${provinceIdOrigin}/regencies`;

    try {
      setLoadingCityOrigin(true);

      // 🔍 PRINT REQUEST
      console.log('📡 [FETCH CITY] Request URL:', url);

      const response = await fetch(url);

      // 🔍 PRINT STATUS HTTP
      console.log(
        '📥 [FETCH CITY] HTTP Status:',
        response.status,
        response.statusText,
      );

      const json = await response.json();

      // 🔍 PRINT RESPONSE BODY
      console.log('📦 [FETCH CITY] Response JSON:', json);

      if (Array.isArray(json) && json.length > 0) {
        setCityListOrigin(json);
      } else {
        setCityListOrigin([]);
      }
    } catch (error) {
      console.error('❌ [FETCH CITY] Error:', error);
      setCityListOrigin([]);
    } finally {
      setLoadingCityOrigin(false);
    }
  };
  useEffect(() => {
    setCityOrigin(null);
    if (provinceIdOrigin) {
      fetchCityOrigin();
    }
  }, [provinceIdOrigin]);

  //HANDLE FORMATION
  const fetchDistrictList = async () => {
    const url = `${BASE_URL}/regencies?${cityOrigin.id}/districts`;

    try {
      setLoadingDistrict(true);

      // 🔍 PRINT REQUEST
      console.log('📡 [FETCH DISTRICT] Request URL:', url);

      const response = await fetch(url);

      // 🔍 PRINT STATUS HTTP
      console.log(
        '📥 [FETCH DISTRICT] HTTP Status:',
        response.status,
        response.statusText,
      );

      const json = await response.json();

      // 🔍 PRINT RESPONSE BODY
      console.log('📦 [FETCH DISTRICT] Response JSON:', json);

      if (Array.isArray(json) && json.length > 0) {
        setDistrictList(json);
      } else {
        setDistrictList([]);
      }
    } catch (error) {
      console.error('❌ [FETCH DISTRICT] Error:', error);
      setDistrictList([]);
    } finally {
      setLoadingDistrict(false);
    }
  };
  useEffect(() => {
    setDistrict(null);
    if (cityOrigin) {
      fetchDistrictList();
    }
  }, [cityOrigin]);

  const handleCreateASNProfile = async () => {
    const url = `${BASE_URL}/student/profile-asn`;

    const payload = {
      date_of_birth: registrationData.dateOfBirth,
      full_name: registrationData.fullName,
      gender: registrationData.gender,
      phone: registrationData.phone,
      user_id: registrationData.userId,
      formation_id: formation.id,
    };

    try {
      setLoadingCreateASN(true);
      console.log('📡 [CREATE ASN] Request URL:', url);
      console.log('📤 [CREATE ASN] Payload:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      console.log('📦 [CREATE ASN] Response:', json);

      setLoadingCreateASN(false);
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
      console.log('❌ [CREATE ASN] Error:', error);
      throw error;
    }
  };

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
          <View style={[styles.divider, { position: 'relative' }]}>
            <TextInputComponent
              title="Provinsi"
              placeholder="Contoh: DKI Jakarta"
              value={provinceNameDestinationInformation}
              setValue={onProvinceChangeDestinationInformation}
            />
            {/* Loading */}
            {loadingProvinceDestinationInformation && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.product900} />
              </View>
            )}

            {/* Dropdown List */}
            {!loadingProvinceDestinationInformation &&
              provinceListDestinationInformation.length > 0 && (
                <View style={styles.dropdownContainer}>
                  <FlatList
                    keyboardShouldPersistTaps="handled"
                    data={provinceListDestinationInformation}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.dropdownItem}
                        onPress={() => {
                          setProvinceNameDestinationInformation(item.name);
                          setProvinceListDestinationInformation([]);
                          setProvinceIdDestinationInformation(item.id);
                        }}
                      >
                        <Text style={styles.dropdownText}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
          </View>
          <View style={styles.divider}>
            <InputDropdown
              title="Kota/Kabupaten"
              value={cityDestinationInformation?.name ?? ''}
              placeholder="Contoh: Jakarta Selatan"
              options={cityListDestinationInformation?.map(item => item.name)}
              disabled={
                provinceIdDestinationInformation === null ||
                cityListDestinationInformation.length === 0
              }
              setValue={selectedName => {
                const selectedCity = cityListDestinationInformation.find(
                  item => item.name === selectedName,
                );
                setCityDestinationInformation(selectedCity);
              }}
            />
          </View>
          <View style={styles.divider}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputDropdown
                  title="Formasi"
                  value={formation?.name ?? ''}
                  placeholder="Pilih formasi"
                  options={formationList.map(item => item.name)}
                  disabled={
                    provinceIdDestinationInformation === null ||
                    formationList.length === 0 ||
                    cityDestinationInformation === null
                  }
                  setValue={selectedName => {
                    const selectedFormation = formationList.find(
                      item => item.name === selectedName,
                    );
                    setFormation(selectedFormation);
                  }}
                />
              </View>
              {/* {formationName === 'Lainnya' && (
                <View style={{ flex: 1 }}>
                  <TextInputComponent
                    title=""
                    placeholder="Tulis formasi"
                    value={otherFormation}
                    setValue={setOtherFormation}
                  />
                </View>
              )} */}
            </View>
          </View>
        </View>
        <View style={styles.fromCityContainer}>
          <Text style={styles.informationGoalsTitle}>Daerah asal</Text>
          <View style={[styles.divider, { position: 'relative' }]}>
            <TextInputComponent
              title="Provinsi"
              placeholder="Contoh: DKI Jakarta"
              value={provinceNameOrigin}
              setValue={onProvinceChangeOrigin}
            />
            {/* Loading */}
            {loadingProvinceOrigin && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.product900} />
              </View>
            )}

            {/* Dropdown List */}
            {!loadingProvinceOrigin && provinceListOrigin.length > 0 && (
              <View style={styles.dropdownContainer}>
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  data={provinceListOrigin}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setProvinceNameOrigin(item.name);
                        setProvinceListOrigin([]);
                        setProvinceIdOrigin(item.id);
                      }}
                    >
                      <Text style={styles.dropdownText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
          <View style={styles.divider}>
            <InputDropdown
              title="Kota/Kabupaten"
              value={cityOrigin?.name ?? ''}
              placeholder="Contoh: Jakarta Selatan"
              options={cityListOrigin?.map(item => item.name)}
              disabled={
                provinceIdOrigin === null || cityListOrigin.length === 0
              }
              setValue={selectedName => {
                const selectedCity = cityListOrigin.find(
                  item => item.name === selectedName,
                );
                setCityOrigin(selectedCity);
              }}
            />
          </View>
          <View style={styles.divider}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputDropdown
                  title="Kecamatan"
                  value={district?.name ?? ''}
                  placeholder="Contoh: Tanjung Duren"
                  options={districtList.map(item => item.name)}
                  disabled={districtList.length === 0 || cityOrigin === null}
                  setValue={selectedName => {
                    const selectedDistrict = districtList.find(
                      item => item.name === selectedName,
                    );
                    setDistrict(selectedDistrict);
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !isFormValid && styles.continueButtonDisabled,
            ]}
            disabled={!isFormValid || loadingCreateASN}
            onPress={() => {
              handleCreateASNProfile();
            }}
          >
            {loadingCreateASN ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text
                style={[
                  styles.continueText,
                  !isFormValid && styles.continueTextDisabled,
                ]}
              >
                Lanjut
              </Text>
            )}
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
  dropdownContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 6,
    maxHeight: 200,
    zIndex: 10,
    elevation: 5,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },

  dropdownText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.neutral900,
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
  continueButtonDisabled: {
    backgroundColor: Colors.neutral300,
  },

  continueTextDisabled: {
    color: Colors.neutral500,
  },
});
