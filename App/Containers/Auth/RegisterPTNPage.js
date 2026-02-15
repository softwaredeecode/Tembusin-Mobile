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

const RegisterPTNPage = props => {
  const navigation = useNavigation();
  const registrationData = props?.route?.params?.data;

  // const [otherStudyProgram, setOtherStudyProgram] = useState('');

  const [universityList, setUniversityList] = useState([]);
  const [loadingUniversity, setLoadingUniversity] = useState(false);
  const [universityName, setUniversityName] = useState('');
  const [universityId, setUniversityId] = useState(null);
  const debounceRef = useRef(null);

  const [loadingMajor, setLoadingMajor] = useState(false);
  const [majorList, setMajorList] = useState([]);
  const [major, setMajor] = useState(null);

  const [loadingEducationLevel, setLoadingEducationLevel] = useState(false);
  const [educationLevelList, setEducationLevelList] = useState([]);
  const [educationLevel, setEducationLevel] = useState(null);

  const [provinceList, setProvinceList] = useState([]);
  const [loadingProvince, setLoadingProvince] = useState(false);
  const [provinceName, setProvinceName] = useState('');
  const [provinceId, setProvinceId] = useState(null);

  const [schoolList, setSchoolList] = useState([]);
  const [loadingSchool, setLoadingSchool] = useState(false);
  const [schoolName, setSchoolName] = useState('');
  const [schooldId, setSchoolId] = useState(null);

  const [loadingCity, setLoadingCity] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [city, setCity] = useState(null);

  const [loadingCreatePTN, setLoadingCreatePTN] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const isFormValid = useMemo(() => {
    return (
      universityId !== null &&
      major !== null &&
      educationLevel !== null &&
      schooldId !== null &&
      provinceId !== null &&
      city !== null
    );
  }, [universityId, major, educationLevel, schooldId, provinceId, city]);

  //HANDLE UNIVERSITY
  const fetchUniversityList = async (keyword = '') => {
    const url = `${BASE_URL}/universities?search=${encodeURIComponent(
      keyword,
    )}`;

    try {
      setLoadingUniversity(true);

      // 🔍 PRINT REQUEST
      console.log('📡 [FETCH UNIVERSITY] Request URL:', url);

      const response = await fetch(url);

      // 🔍 PRINT STATUS HTTP
      console.log(
        '📥 [FETCH UNIVERSITY] HTTP Status:',
        response.status,
        response.statusText,
      );

      const json = await response.json();

      // 🔍 PRINT RESPONSE BODY
      console.log('📦 [FETCH UNIVERSITY] Response JSON:', json);

      if (Array.isArray(json) && json.length > 0) {
        setUniversityList(json);
      } else {
        setUniversityList([]);
      }
    } catch (error) {
      console.error('❌ [FETCH UNIVERSITY] Error:', error);
      setUniversityList([]);
    } finally {
      setLoadingUniversity(false);
    }
  };
  const onUniversityChange = val => {
    setUniversityName(val.toUpperCase());

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (val.length < 3) {
      setUniversityList([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchUniversityList(val.toUpperCase());
    }, 500);
  };

  //HANDLE MAJOR
  const fetchMajorList = async () => {
    const url = `${BASE_URL}/majors?university_id=${encodeURIComponent(
      universityId,
    )}`;

    try {
      setLoadingMajor(true);

      // 🔍 PRINT REQUEST
      console.log('📡 [FETCH MAJOR] Request URL:', url);

      const response = await fetch(url);

      // 🔍 PRINT STATUS HTTP
      console.log(
        '📥 [FETCH MAJOR] HTTP Status:',
        response.status,
        response.statusText,
      );

      const json = await response.json();

      // 🔍 PRINT RESPONSE BODY
      console.log('📦 [FETCH MAJOR] Response JSON:', json);

      if (Array.isArray(json) && json.length > 0) {
        setMajorList(json);
      } else {
        setMajorList([]);
      }
    } catch (error) {
      console.error('❌ [FETCH MAJOR] Error:', error);
      setMajorList([]);
    } finally {
      setLoadingMajor(false);
    }
  };
  useEffect(() => {
    setMajor(null);
    setEducationLevel(null);
    if (universityId) {
      fetchMajorList();
    }
  }, [universityId]);

  //HANDLE EDUCATION LEVEL
  const fetchEducationLevel = async () => {
    const params = new URLSearchParams();

    if (universityId) params.append('university_id', universityId);
    if (major?.id) params.append('major_id', major.id);

    const url = `${BASE_URL}/degree-levels?${params.toString()}`;

    try {
      setLoadingEducationLevel(true);

      // 🔍 PRINT REQUEST
      console.log('📡 [FETCH EDUCATION LEVEL] Request URL:', url);

      const response = await fetch(url);

      // 🔍 PRINT STATUS HTTP
      console.log(
        '📥 [FETCH EDUCATION LEVEL] HTTP Status:',
        response.status,
        response.statusText,
      );

      const json = await response.json();

      // 🔍 PRINT RESPONSE BODY
      console.log('📦 [FETCH EDUCATION LEVEL] Response JSON:', json);

      if (Array.isArray(json) && json.length > 0) {
        setEducationLevelList(json);
      } else {
        setEducationLevelList([]);
      }
    } catch (error) {
      console.error('❌ [FETCH EDUCATION LEVEL] Error:', error);
      setEducationLevelList([]);
    } finally {
      setLoadingEducationLevel(false);
    }
  };
  useEffect(() => {
    setEducationLevel(null);
    if (major !== null) {
      fetchEducationLevel();
    }
  }, [major?.id]);

  //HANDLE SCHOOL
  const fetchSchoolList = async (keyword = '') => {
    const params = new URLSearchParams();

    if (keyword) params.append('search', keyword);
    if (provinceId) params.append('province_id', provinceId);
    if (city?.id) params.append('regency_id', city.id);

    const url = `${BASE_URL}/origin-schools?${params.toString()}`;

    try {
      setLoadingSchool(true);

      // 🔍 PRINT REQUEST
      console.log('📡 [FETCH SCHOOL] Request URL:', url);

      const response = await fetch(url);

      // 🔍 PRINT STATUS HTTP
      console.log(
        '📥 [FETCH SCHOOL] HTTP Status:',
        response.status,
        response.statusText,
      );

      const json = await response.json();

      // 🔍 PRINT RESPONSE BODY
      console.log('📦 [FETCH SCHOOL] Response JSON:', json);

      if (Array.isArray(json) && json.length > 0) {
        setSchoolList(json);
      } else {
        setSchoolList([]);
      }
    } catch (error) {
      console.error('❌ [FETCH SCHOOL] Error:', error);
      setSchoolList([]);
    } finally {
      setLoadingSchool(false);
    }
  };
  const onSchooldChange = val => {
    setSchoolName(val.toUpperCase());

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (val.length < 3) {
      setSchoolList([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSchoolList('');
    }, 500);
  };

  //HANDLE PROVINCE

  const fetchProvince = async (keyword = '') => {
    const url = `${BASE_URL}/provinces?search=${encodeURIComponent(keyword)}`;

    try {
      setLoadingProvince(true);

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
        setProvinceList(json);
      } else {
        setProvinceList([]);
      }
    } catch (error) {
      console.error('❌ [FETCH PROVINCE] Error:', error);
      setProvinceList([]);
    } finally {
      setLoadingProvince(false);
    }
  };
  const onProvinceChange = val => {
    setProvinceName(val.toUpperCase());

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (val.length < 3) {
      setProvinceList([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchProvince(val.toUpperCase());
    }, 500);
  };

  //HANDLE CITY
  const fetchCity = async () => {
    const url = `${BASE_URL}/provinces/${provinceId}/regencies`;

    try {
      setLoadingCity(true);

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
        setCityList(json);
      } else {
        setCityList([]);
      }
    } catch (error) {
      console.error('❌ [FETCH CITY] Error:', error);
      setCityList([]);
    } finally {
      setLoadingCity(false);
    }
  };
  useEffect(() => {
    setCity(null);
    setSchoolId(null);
    setSchoolName('');
    if (provinceId) {
      fetchCity();
    }
  }, [provinceId]);

  const handleCreatePTNProfile = async () => {
    const url = `${BASE_URL}/student/profile-ptn`;

    const payload = {
      date_of_birth: registrationData.dateOfBirth,
      full_name: registrationData.fullName,
      gender: registrationData.gender,
      origin_school_id: schooldId,
      phone: registrationData.phone,
      target_major_id: major.id,
      target_university_id: universityId,
      user_id: registrationData.userId,
    };

    try {
      setLoadingCreatePTN(true);
      console.log('📡 [CREATE PTN] Request URL:', url);
      console.log('📤 [CREATE PTN] Payload:', payload);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const json = await response.json();

      console.log('📦 [CREATE PTN] Response:', json);

      setLoadingCreatePTN(false);
      if (response.ok) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'LoginPage' }],
        });
        return json;
      } else {
        setShowErrorModal(true);
        setErrorMessage(json.message)
      }
    } catch (error) {
      console.log('❌ [CREATE PTN] Error:', error);
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
              title="Perguruan tinggi impian"
              placeholder="Contoh: Universitas Indonesia"
              value={universityName}
              setValue={onUniversityChange}
            />

            {/* Loading */}
            {loadingUniversity && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.product900} />
              </View>
            )}

            {/* Dropdown List */}
            {!loadingUniversity && universityList.length > 0 && (
              <View style={styles.dropdownContainer}>
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  data={universityList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setUniversityName(item.name);
                        setUniversityList([]);
                        setUniversityId(item.id);
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
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <InputDropdown
                  title="Program studi"
                  value={major?.name ?? ''}
                  placeholder="Contoh: Hukum"
                  options={majorList.map(item => item.name)}
                  disabled={universityId === null || majorList.length === 0}
                  setValue={selectedName => {
                    const selectedMajor = majorList.find(
                      item => item.name === selectedName,
                    );
                    setMajor(selectedMajor);
                  }}
                />
              </View>
              {/* {major === 'Lainnya' && (
                <View style={{ flex: 1 }}>
                  <TextInputComponent
                    title=""
                    placeholder="Tulis program studi"
                    value={otherStudyProgram}
                    setValue={setOtherStudyProgram}
                  />
                </View>
              )} */}
            </View>
          </View>
          <View style={styles.divider}>
            <InputDropdown
              title="Jenjang"
              value={educationLevel?.name ?? ''}
              placeholder="Contoh: S1 - Sarjana"
              options={educationLevelList?.map(item => item.name)}
              disabled={
                major === null ||
                educationLevelList.length === 0 ||
                universityId === null
              }
              setValue={selectedName => {
                const selectedEducationLevel = educationLevelList.find(
                  item => item.name === selectedName,
                );
                setEducationLevel(selectedEducationLevel);
              }}
            />
          </View>
        </View>
        <View style={styles.fromCityContainer}>
          <Text style={styles.informationGoalsTitle}>Sekolah asal</Text>

          <View style={[styles.divider, { position: 'relative' }]}>
            <TextInputComponent
              title="Provinsi"
              placeholder="Contoh: DKI Jakarta"
              value={provinceName}
              setValue={onProvinceChange}
            />
            {/* Loading */}
            {loadingProvince && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.product900} />
              </View>
            )}

            {/* Dropdown List */}
            {!loadingProvince && provinceList.length > 0 && (
              <View style={styles.dropdownContainer}>
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  data={provinceList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setProvinceName(item.name);
                        setProvinceList([]);
                        setProvinceId(item.id);
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
              value={city?.name ?? ''}
              placeholder="Contoh: Jakarta Selatan"
              options={cityList?.map(item => item.name)}
              disabled={provinceId === null || cityList.length === 0}
              setValue={selectedName => {
                const selectedCity = cityList.find(
                  item => item.name === selectedName,
                );
                setCity(selectedCity);
              }}
            />
          </View>

          <View style={[styles.divider, { position: 'relative' }]}>
            <TextInputComponent
              title="Nama sekolah"
              placeholder="Contoh: SMAN 70 Jakarta"
              value={schoolName}
              setValue={onSchooldChange}
              disabled={provinceId === null || city === null}
            />
            {/* Loading */}
            {loadingSchool && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.product900} />
              </View>
            )}

            {/* Dropdown List */}
            {!loadingSchool && schoolList.length > 0 && (
              <View style={styles.dropdownContainer}>
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  data={schoolList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSchoolName(item.name);
                        setSchoolList([]);
                        setSchoolId(item.id);
                      }}
                    >
                      <Text style={styles.dropdownText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !isFormValid && styles.continueButtonDisabled,
            ]}
            disabled={!isFormValid || loadingCreatePTN}
            onPress={() => {
              handleCreatePTNProfile();
            }}
          >
            {loadingCreatePTN ? (
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

  loadingContainer: {
    position: 'absolute',
    right: 12,
    top: 42,
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
