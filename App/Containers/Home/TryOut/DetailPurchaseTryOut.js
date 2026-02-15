import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../../../Api/GlobalUrl';

// components
import MainHeader from '../../../Components/MainHeader';
import BottomModal from '../../../Components/BottomModal';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { ActionStudent } from '../../../Redux/Actions';

import { formatDateMaterial } from '../../../Utils/Helper';

const DetailPurchaseTryOut = props => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { tryOutDetailData, tryOutSpinner } = useSelector(
    state => state.tryout,
  );
  const tryoutId = props?.route?.params?.tryoutId;
  const [showBuyWithTokenModal, setShowBuyWithTokenModal] = useState(false);
  const [loadingBuyTryOut, setLoadingBuyTryOut] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [myToken, setMyToken] = useState(null);

  const getMyToken = async () => {
    const url = `${BASE_URL}/user/token-balance`;

    try {
      const token = await AsyncStorage.getItem('auth_token');
      console.log('📡 [FETCH MY TOKEN] Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        '📥 [FETCH MY TOKEN] HTTP Status:',
        response.status,
        response.statusText,
      );

      const json = await response.json();
      console.log('📦 [FETCH MY TOKEN] Response:', json);

      if (response.ok) {
        setMyToken(json.token_balance);
      } else {
        throw json;
      }
    } catch (error) {
      console.log('❌ [FETCH MY TOKEN] Error:', error);
    } finally {
    }
  };

  useFocusEffect(
    useCallback(() => {
      getMyToken();
    }, []),
  );

  const handlePurchaseTryOut = async () => {
    setLoadingBuyTryOut(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const response = await ActionStudent.PurchaseTryout(token, tryoutId);
      console.log(response, 'INI RESPONSE PurchaseTryout');
      if (response.status === 201) {
        setShowBuyWithTokenModal(false);
        if (response.data) {
          navigation.replace('ThankyouPageTryOut', {
            paymentData: response.data,
            tryoutSetDetailData: tryOutDetailData,
          });
        }
      } else {
        setShowErrorModal(true);
        setErrorMessage(response.data?.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      setShowErrorModal(true);
      setErrorMessage('Terjadi kesalahan sistem');
    } finally {
      setLoadingBuyTryOut(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const initializeData = async () => {
        const token = await AsyncStorage.getItem('auth_token');

        dispatch(ActionStudent.GetTryOutDetailData(token, tryoutId));
      };
      initializeData();

      return () => {};
    }, [dispatch]),
  );

  if (!tryOutDetailData?.data) {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor={Colors.white} />
        <MainHeader title="Detail Try Out" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />
      <MainHeader title={'Detail Try Out'} />
      <ScrollView style={styles.bodyContainer}>
        <View style={styles.selectedItemContainer}>
          {tryOutDetailData.data.banner_url !== '' && (
            <Image
              source={{ uri: tryOutDetailData.data.banner_url }}
              style={styles.image}
              resizeMode="cover"
            />
          )}
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
              {tryOutDetailData.data.tryout_name}
            </Text>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>
                {tryOutDetailData.data.category.category_name}
              </Text>
            </View>
          </View>
          <View style={styles.dateContainer}>
            <View style={styles.dateIconContainer}>
              <MaterialCommunityIcons
                name={'calendar-blank'}
                size={12}
                color={Colors.neutral500}
              />
            </View>
            {tryOutDetailData.data.no_time_limit_flag === 0 ? (
              <Text style={styles.detailText}>
                Akses {formatDateMaterial(tryOutDetailData.data.start_time)}{' '}
                {tryOutDetailData.data.end_time
                  ? `- ${formatDateMaterial(tryOutDetailData.data.end_time)}`
                  : ''}
              </Text>
            ) : (
              <Text style={styles.detailText}>Akses kapan saja</Text>
            )}
          </View>
          {tryOutDetailData.data.description !== '' && (
            <View style={styles.descContainer}>
              <View style={styles.dateIconContainer}>
                <MaterialCommunityIcons
                  name="crown-outline"
                  size={12}
                  color={Colors.neutral500}
                />
              </View>
              <Text style={styles.detailText}>
                {tryOutDetailData.data.description}
              </Text>
            </View>
          )}
          {(tryOutDetailData.data.access_type.id == 1 ||
            tryOutDetailData.data.access_type.id == 3) && (
            <View style={styles.showTokenPriceContainer}>
              <View style={styles.seperateBuyContainer}>
                <Ionicons
                  name={'checkmark'}
                  size={14}
                  color={Colors.success500}
                />
                <Text style={styles.seperateBuyText}>
                  Dapat dibeli terpisah
                </Text>
              </View>
              <View style={[styles.row, { gap: 6 }]}>
                <FontAwesome name="money" size={16} color={Colors.warning500} />
                <Text style={bottomSheetModalStyles.priceToken}>
                  {tryOutDetailData.data.price_token}
                </Text>
              </View>
            </View>
          )}
          {tryOutDetailData.data.access_type.id == 4 && (
            <View style={styles.otherContainer}>
              <View style={styles.seperateBuyContainer}>
                <Ionicons
                  name={'time-outline'}
                  size={14}
                  color={Colors.success500}
                />
                <Text style={styles.seperateBuyText}>
                  Gratis untuk saat ini
                </Text>
              </View>
              <Text style={styles.freeText}>Free</Text>
            </View>
          )}
        </View>
        <View style={styles.countDetailContainer}>
          <View style={[styles.countContainer, { width: width / 3.5 }]}>
            <View style={styles.countIconContainer}>
              <MaterialCommunityIcons
                name={'folder-outline'}
                size={20}
                color={Colors.product900}
              />
            </View>
            <Text style={styles.countTitleText}>
              {tryOutDetailData?.data?.statistics?.total_categories}
            </Text>
            <Text style={styles.countText}>Kategori</Text>
          </View>
          <View style={[styles.countContainer, { width: width / 3.5 }]}>
            <View style={styles.countIconContainer}>
              <MaterialCommunityIcons
                name={'progress-question'}
                size={20}
                color={Colors.product900}
              />
            </View>
            <Text style={styles.countTitleText}>
              {tryOutDetailData.data.total_questions} Soal
            </Text>
            <Text style={styles.countText}>Jumlah Soal</Text>
          </View>
          <View style={[styles.countContainer, { width: width / 3.5 }]}>
            <View style={styles.countIconContainer}>
              <MaterialCommunityIcons
                name={'alarm'}
                size={20}
                color={Colors.product900}
              />
            </View>
            <Text style={styles.countTitleText}>
              {tryOutDetailData.data.duration_minutes} Menit
            </Text>
            <Text style={styles.countText}>Durasi</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomComponent}>
        <View style={styles.buttonContainer}>
          {(tryOutDetailData.data.access_type.id == 1 ||
            tryOutDetailData.data.access_type.id == 3) && (
            <TouchableOpacity
              onPress={() => setShowBuyWithTokenModal(true)}
              style={styles.buyWithTokenContainer}
            >
              <Text style={styles.buyWithTokenText}>Beli Dengan Token</Text>
            </TouchableOpacity>
          )}
          {tryOutDetailData.data.access_type.id == 4 && (
            <TouchableOpacity
              onPress={() => {
                handlePurchaseTryOut();
              }}
              style={styles.joinMemberContainer}
            >
              <Text style={styles.joinMemberText}>Ambil</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <BottomModal
        visible={showBuyWithTokenModal}
        onClose={() => setShowBuyWithTokenModal(false)}
        title="Beli try out"
        enableScroll={false}
      >
        <View style={bottomSheetModalStyles.rowContainer}>
          <View style={bottomSheetModalStyles.fileIconContainer}>
            <MaterialCommunityIcons
              name="file-document-edit-outline"
              size={24}
              color={Colors.product900}
            />
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>
              {tryOutDetailData.data.category.category_name}
            </Text>
          </View>
        </View>
        <View style={bottomSheetModalStyles.titleContainer}>
          <Text style={styles.titleText}>
            {tryOutDetailData.data.tryout_name}
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <View style={styles.dateIconContainer}>
            <MaterialCommunityIcons
              name={'calendar-blank'}
              size={12}
              color={Colors.neutral500}
            />
          </View>
          {tryOutDetailData.data.no_time_limit_flag === 0 ? (
            <Text style={styles.dateText}>
              Akses {formatDateMaterial(tryOutDetailData.data.start_time)}{' '}
              {tryOutDetailData.data.end_time
                ? `- ${formatDateMaterial(tryOutDetailData.data.end_time)}`
                : ''}
            </Text>
          ) : (
            <Text style={styles.dateText}>Akses kapan saja</Text>
          )}
        </View>
        <View style={bottomSheetModalStyles.countContainer}>
          {/* <View style={bottomSheetModalStyles.countChildContainer}>
            <Text style={bottomSheetModalStyles.countText}>
              {
                exercisesSetDetailData.data.sub_question_category
                  .sub_question_category_name
              }
            </Text>
          </View> */}
          <View style={bottomSheetModalStyles.countChildContainer}>
            <Text style={bottomSheetModalStyles.countText}>
              {tryOutDetailData.data.total_questions} Soal
            </Text>
          </View>
          <View style={bottomSheetModalStyles.countChildContainer}>
            <Text style={bottomSheetModalStyles.countText}>
              {tryOutDetailData.data.duration_minutes} Menit
            </Text>
          </View>
        </View>
        <View style={bottomSheetModalStyles.tokenTotalContainer}>
          <View style={bottomSheetModalStyles.tokenTotalChildContainer}>
            <Text style={bottomSheetModalStyles.tokenTotalTitleText}>
              Harga try out
            </Text>
            <View style={[styles.row, { gap: 6 }]}>
              <FontAwesome name="money" size={16} color={Colors.warning500} />
              <Text style={styles.priceToken}>
                {tryOutDetailData.data.price_token}
              </Text>
            </View>
          </View>
          <View style={bottomSheetModalStyles.tokenTotalChildContainer}>
            <Text style={bottomSheetModalStyles.tokenTotalTitleText}>
              Token saya
            </Text>
            <View style={[styles.row, { gap: 6 }]}>
              <FontAwesome
                name="money"
                size={13}
                color={
                  myToken >= tryOutDetailData.data.price_token
                    ? Colors.neutral400
                    : Colors.danger500
                }
              />
              <Text
                style={
                  myToken >= tryOutDetailData.data.price_token
                    ? bottomSheetModalStyles.myTokenText
                    : bottomSheetModalStyles.dangerMyTokenText
                }
              >
                {myToken}
              </Text>
            </View>
          </View>
        </View>
        <View style={bottomSheetModalStyles.buttonContainer}>
          {myToken >= tryOutDetailData.data.price_token ? (
            <TouchableOpacity
              onPress={() => {
                handlePurchaseTryOut();
              }}
              style={bottomSheetModalStyles.buyButtonContainer}
              disabled={loadingBuyTryOut}
            >
              {loadingBuyTryOut ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={bottomSheetModalStyles.buyButtonText}>Beli</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={bottomSheetModalStyles.topUpButtonContainer}
              onPress={() => {
                setShowBuyWithTokenModal(false);
                navigation.navigate('MainTabs', { screen: 'ProductPage' });
              }}
            >
              <Text style={bottomSheetModalStyles.topUpButtonText}>
                Isi Token
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </BottomModal>
    </View>
  );
};

export default DetailPurchaseTryOut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  bodyContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
  },
  selectedItemContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  showTokenPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  image: {
    width: '100%',
    borderRadius: 8,
  },
  titleContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontFamily: Fonts.Medium,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.neutral900,
    flex: 1,
  },
  categoryContainer: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 4,
  },
  categoryText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.product900,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  dateIconContainer: {
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    borderRadius: 6,
  },
  dateText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
  },
  descContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  countDetailContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  countContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  countIconContainer: {
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 6,
  },
  countTitleText: {
    marginTop: 10,
    marginBottom: 2,
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  countText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  bottomComponent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingBottom: 46,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  buyDescText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  joinMemberContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.product900,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  joinMemberText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
  seperateBuyContainer: {
    // marginTop: 8,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.success200,
    backgroundColor: Colors.success50,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  seperateBuyText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.success500,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceToken: {
    fontFamily: Fonts.SemiBold,
    fontSize: 20,
    lineHeight: 24,
    color: Colors.neutral900,
  },
  otherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buyWithTokenContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buyWithTokenText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  freeText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 20,
    lineHeight: 24,
    color: Colors.success500,
  },
});

const bottomSheetModalStyles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  fileIconContainer: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
  },
  titleContainer: {
    marginTop: 12,
  },
  countContainer: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  countChildContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.neutral200,
  },
  countText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  tokenTotalContainer: {
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
    gap: 10,
  },
  tokenTotalChildContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tokenTotalTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  myTokenText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral400,
  },
  dangerMyTokenText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.danger500,
  },
  buttonContainer: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  buyButtonContainer: {
    paddingVertical: 10,
    backgroundColor: Colors.product900,
    alignItems: 'center',
    borderRadius: 8,
  },
  buyButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
  topUpButtonContainer: {
    paddingVertical: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  topUpButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
});
