import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

// components
import MainHeader from '../../../Components/MainHeader';
import BottomModal from '../../../Components/BottomModal';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../../Redux/Actions';

import { formatDateMaterial } from '../../../Utils/Helper';

const screenWidth = Dimensions.get('screen').width;

const StartTryOut = props => {
  const { width } = useWindowDimensions();
  const tryoutId = props?.route?.params?.tryoutId;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { tryOutDetailData, tryoutAttemptList, tryOutSpinner } = useSelector(
    state => state.tryout,
  );
  const [showReviewResult, setShowReviewResult] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const isAfterDeadline = deadline => {
    const now = new Date();
    const deadlineDate = new Date(deadline);

    return now > deadlineDate;
  };
  const {
    guidebook_url = '',
    telegram_group_url = '',
    whatsapp_group_url = '',
  } = tryOutDetailData?.data ?? {};
  const hasAnyResource =
    guidebook_url !== '' ||
    telegram_group_url !== '' ||
    whatsapp_group_url !== '';

  useFocusEffect(
    useCallback(() => {
      const initializeData = async () => {
        const token = await AsyncStorage.getItem('auth_token');

        const response = await dispatch(
          ActionStudent.GetTryOutDetailData(token, tryoutId),
        );

        console.log(response, 'INI RESPONSE');
        if (response?.status !== 200 || !response?.data) return;

        const { no_time_limit_flag, end_time } = response.data;

        fetchAttempList();

        if (no_time_limit_flag === 0) {
          setIsExpired(isAfterDeadline(end_time));
        } else {
          setIsExpired(false);
        }
      };
      initializeData();

      return () => {};
    }, [dispatch]),
  );

  const fetchAttempList = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    dispatch(ActionStudent.GetAttemptListTryout(token, tryoutId));
  };

  const getScoreMeta = score => {
    if (score >= 75) {
      return {
        label: 'Hebat!',
        color: Colors.success500,
        border: Colors.success200,
        background: Colors.success50,
      };
    }

    if (score > 45) {
      return {
        label: 'Lumayan!',
        color: Colors.warning500,
        border: Colors.warning200,
        background: Colors.warning50,
      };
    }

    return {
      label: 'Kurang!',
      color: Colors.danger500,
      border: Colors.danger200,
      background: Colors.danger50,
    };
  };
  const scoreMeta = getScoreMeta(tryOutDetailData?.data?.best_score);

  const openExternalLink = async url => {
    try {
      await Linking.openURL(url);
    } catch (err) {
      Alert.alert('Terjadi kesalahan');
    }
  };

  if (!tryOutDetailData?.data) {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor={Colors.white} />
        <MainHeader title="Detail Try Out" />
      </View>
    );
  }

  const initTimer = async () => {
    const durationMinutes = tryOutDetailData?.data?.duration_minutes;
    // const durationMinutes = 90;

    const now = Date.now();
    const endTime = now + durationMinutes * 60 * 1000;

    await AsyncStorage.setItem('tryout_end_time', endTime.toString());
  };

  const handleCreateNewAttempt = async () => {
    await AsyncStorage.removeItem('tryout_end_time');
    const token = await AsyncStorage.getItem('auth_token');
    const response = await dispatch(
      ActionStudent.StartNewAttemptTryOut(token, tryoutId),
    );
    if (response.data) {
      initTimer();
      navigation.navigate('StartDetailTryOutPage', {
        tryOutDetailData: tryOutDetailData,
        startNewAttemptData: response,
      });
    }
  };

  const RenderAttemptList = ({ data, onPressItem }) => {
    const submittedData = data;

    const formatDate = isoString => {
      const date = new Date(isoString);

      const day = date.getDate();
      const month = date.toLocaleString('en-GB', { month: 'short' });
      const year = date.getFullYear();

      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return `${day} ${month} ${year}, ${hours}:${minutes}`;
    };

    const reversedData = [...submittedData].reverse();
    const chartData = {
      labels: reversedData.map((_, index) => `#${index + 1}`),
      datasets: [
        {
          data: reversedData.map(item =>
            item.status === 'in_progress' ? 0 : item.total_score,
          ),
          strokeWidth: 2,
        },
      ],
    };

    if (!submittedData.length) {
      return (
        <Text style={bottomModalStyles.emptyText}>Belum ada hasil tryout</Text>
      );
    }

    return (
      <View>
        {submittedData.length > 1 && (
          <LineChart
            data={chartData}
            width={screenWidth - 32}
            height={220}
            yAxisSuffix=""
            yAxisInterval={1}
            chartConfig={{
              backgroundColor: Colors.white,
              backgroundGradientFrom: Colors.white,
              backgroundGradientTo: Colors.white,
              decimalPlaces: 0,
              color: () => Colors.product900,
              labelColor: () => Colors.neutral500,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: Colors.product900,
              },
            }}
            bezier
            style={{
              marginVertical: 16,
              borderRadius: 8,
            }}
          />
        )}

        {submittedData.map((item, index) => {
          const scoreMeta = getScoreMeta(item.total_score);

          return (
            <TouchableOpacity
              key={item.id}
              style={bottomModalStyles.itemContainer}
              onPress={() => onPressItem?.(item)}
            >
              <View style={bottomModalStyles.row}>
                <Text style={bottomModalStyles.attemptText}>
                  Kesempatan {submittedData.length - index}
                </Text>
                <Text style={bottomModalStyles.dateText}>
                  {formatDate(item.started_at)}
                </Text>
              </View>
              <View style={[bottomModalStyles.row, { marginTop: 10 }]}>
                {item.status === 'in_progress' ? (
                  <View style={bottomModalStyles.scoreContainer}>
                    <Entypo
                      name="dot-single"
                      size={22}
                      color={Colors.neutral400}
                    />
                    <Text style={bottomModalStyles.notesText}>
                      Tidak selesai
                    </Text>
                  </View>
                ) : (
                  <View style={bottomModalStyles.scoreContainer}>
                    <Entypo
                      name="dot-single"
                      size={22}
                      color={scoreMeta.color}
                    />

                    <Text
                      style={[
                        bottomModalStyles.scoreText,
                        { color: scoreMeta.color },
                      ]}
                    >
                      {Math.round(item.total_score)}
                    </Text>

                    <Text style={bottomModalStyles.dividerText}> | </Text>

                    <Text style={[bottomModalStyles.notesText]}>
                      {scoreMeta.label}
                    </Text>
                  </View>
                )}
                <View style={bottomModalStyles.iconNextContainer}>
                  <Ionicons
                    name={'chevron-forward'}
                    size={14}
                    color={Colors.neutral500}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

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
          <View style={styles.materialDescContainer}>
            <View style={styles.dateIconContainer}>
              <FontAwesome name={'money'} size={10} color={Colors.neutral500} />
            </View>
            <Text style={styles.materialDateText}>
              {`Kesempatan: ${tryOutDetailData.data.used_attempts}/${tryOutDetailData.data.max_attempts}`}
            </Text>
          </View>
        </View>
        {tryOutDetailData.data.used_attempts > 0 && (
          <View style={styles.selectedItemContainer}>
            <View style={styles.selectedItemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.scoreTextLabel}>
                  Skor: {scoreMeta.label}
                </Text>
                <Text style={styles.scoreTextLabelDesc}>
                  Skor ini diambil dari kesempatan terbaikmu.
                </Text>
              </View>
              <View
                style={[
                  styles.scoreContainer,
                  {
                    borderColor: scoreMeta.border,
                    backgroundColor: scoreMeta.background,
                  },
                ]}
              >
                <Text style={[styles.scoreText, { color: scoreMeta.color }]}>
                  {Math.round(tryOutDetailData.data.best_score)}
                </Text>
              </View>
            </View>
          </View>
        )}
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

        {!isExpired && hasAnyResource && (
          <View style={styles.resourceContainer}>
            <Text style={styles.resourceTitleText}>Resource</Text>
            {tryOutDetailData.data.guidebook_url !== '' && (
              <View style={styles.resourceChildContainer}>
                <View style={styles.resourceTitleContainer}>
                  <View style={styles.resourceIconContainer}>
                    <MaterialCommunityIcons
                      name={'file-outline'}
                      size={20}
                      color={Colors.neutral500}
                    />
                  </View>
                  <View style={styles.resourceDescContainer}>
                    <Text style={styles.resourceTitleText}>Buku Panduan</Text>
                    <Text style={styles.resourceDescText}>
                      Pelajari langkah lengkap dan strategi pengerjaan latihan.
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('TryOutGuidelinePage', {
                      pdfUrl: tryOutDetailData.data.guidebook_url,
                    });
                  }}
                  style={styles.resourceButtonContainer}
                >
                  <Text style={styles.resourceButtonText}>Baca</Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.resourceChildContainer}>
              <View style={styles.resourceTitleContainer}>
                <View style={styles.resourceIconContainer}>
                  <MaterialCommunityIcons
                    name={'image-outline'}
                    size={20}
                    color={Colors.neutral500}
                  />
                </View>
                <View style={styles.resourceDescContainer}>
                  <Text style={styles.resourceTitleText}>Twibbon</Text>
                  <Text style={styles.resourceDescText}>
                    Bagikan proses belajarmu dengan twibbon.
                  </Text>
                </View>
              </View>
              <View style={styles.multiButtonContainer}>
                <TouchableOpacity
                  style={[styles.resourceButtonContainer, { width: 36 }]}
                >
                  <MaterialCommunityIcons
                    name={'download'}
                    size={20}
                    color={Colors.neutral500}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.resourceButtonContainer}>
                  <Text style={styles.resourceButtonText}>Lihat</Text>
                </TouchableOpacity>
              </View>
            </View>
            {tryOutDetailData.data.telegram_group_url !== '' &&
              tryOutDetailData.data.whatsapp_group_url !== '' && (
                <View style={styles.resourceChildContainer}>
                  <View style={styles.resourceTitleContainer}>
                    <View style={styles.resourceIconContainer}>
                      <MaterialCommunityIcons
                        name={'account-multiple-outline'}
                        size={20}
                        color={Colors.neutral500}
                      />
                    </View>
                    <View style={styles.resourceDescContainer}>
                      <Text style={styles.resourceTitleText}>Grup Belajar</Text>
                      <Text style={styles.resourceDescText}>
                        Gabung ke grup WhatsApp atau Telegram untuk berdiskusi
                        dan berbagi tips.
                      </Text>
                    </View>
                  </View>
                  <View style={styles.multiButtonContainer}>
                    {tryOutDetailData.data.telegram_group_url !== '' && (
                      <TouchableOpacity
                        onPress={() => {
                          openExternalLink(
                            tryOutDetailData.data.telegram_group_url,
                          );
                        }}
                        style={styles.resourceButtonContainer}
                      >
                        <Text style={styles.resourceButtonText}>Telegram</Text>
                      </TouchableOpacity>
                    )}
                    {tryOutDetailData.data.whatsapp_group_url !== '' && (
                      <TouchableOpacity
                        onPress={() => {
                          openExternalLink(
                            tryOutDetailData.data.whatsapp_group_url,
                          );
                        }}
                        style={styles.resourceButtonContainer}
                      >
                        <Text style={styles.resourceButtonText}>WhatsApp</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
          </View>
        )}
      </ScrollView>
      <View style={styles.bottomComponent}>
        <View style={styles.buttonContainer}>
          {(tryOutDetailData.data.used_attempts > 0 || isExpired) && (
            <TouchableOpacity
              disabled={tryOutSpinner}
              onPress={() => {
                setShowReviewResult(true);
              }}
              style={[styles.reviewMemberContainer]}
              activeOpacity={0.8}
            >
              <Text style={styles.reviewMemberText}>Review Hasil</Text>
            </TouchableOpacity>
          )}
          {tryOutDetailData.data.used_attempts <
            tryOutDetailData.data.max_attempts &&
            !isExpired && (
              <TouchableOpacity
                disabled={tryOutSpinner}
                onPress={() => {
                  setConfirmationModal(true);
                }}
                style={[styles.joinMemberContainer]}
                activeOpacity={0.8}
              >
                {tryOutSpinner ? (
                  <ActivityIndicator size="small" color={Colors.white} />
                ) : (
                  <Text style={styles.joinMemberText}>
                    {tryOutDetailData.data.used_attempts > 0
                      ? 'Mulai Ulang'
                      : 'Mulai'}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          {/* <TouchableOpacity
            disabled={tryOutSpinner}
            onPress={handleCreateNewAttempt}
            style={[styles.joinMemberContainer]}
            activeOpacity={0.8}
          >
            {tryOutSpinner ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={styles.joinMemberText}>
                {tryOutDetailData.data.used_attempts > 0
                  ? 'Mulai Ulang'
                  : 'Mulai'}
              </Text>
            )}
          </TouchableOpacity> */}
        </View>
      </View>
      <BottomModal
        visible={showReviewResult}
        onClose={() => setShowReviewResult(false)}
        enableScroll={true}
        title={'Review hasil tryout'}
      >
        <View style={bottomModalStyles.container}>
          <Text style={bottomModalStyles.childTitleText}>Pilih kesempatan</Text>
          <RenderAttemptList
            data={tryoutAttemptList?.data?.data}
            onPressItem={item => {
              console.log('Selected attempt:', item);
              setShowReviewResult(false);
              navigation.navigate('ResultReviewDetailTryOutPage', {
                data: item,
              });
            }}
          />
        </View>
      </BottomModal>
      <BottomModal
        visible={confirmationModal}
        onClose={() => setConfirmationModal(false)}
        enableScroll={false}
        withHeader={false}
      >
        <View style={confirmationModalStyles.container}>
          <View style={confirmationModalStyles.iconContainer}>
            <SimpleLineIcons
              name={'question'}
              size={40}
              color={Colors.warning500}
            />
          </View>
          <Text style={confirmationModalStyles.titleText}>
            Mulai sesi try out sekarang?
          </Text>
          <Text style={confirmationModalStyles.descText}>
            Begitu sesi dimulai, timer akan langsung berjalan dan jangan keluar
            dari halaman ini karena percobaan tidak dapat diulang. Pastikan kamu
            siap melanjutkan.
          </Text>
          <View style={confirmationModalStyles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setConfirmationModal(false);
              }}
              style={styles.exitButtonContainer}
            >
              <Text style={styles.exitButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setConfirmationModal(false);
                handleCreateNewAttempt();
              }}
              style={styles.doneButtonContainer}
            >
              <Text style={styles.doneButtonText}>Ya, mulai</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomModal>
    </View>
  );
};

export default StartTryOut;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  exitButtonContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  exitButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  doneButtonContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.product900,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  doneButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
  bodyContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    marginBottom: 120,
  },
  materialDescContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  materialDateText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  selectedItemContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
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
  reviewMemberContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  reviewMemberText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  joinMemberText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
  seperateBuyContainer: {
    marginTop: 10,
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
  resourceContainer: {
    marginTop: 10,
    marginHorizontal: 16,
  },
  resourceTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.neutral500,
  },
  resourceChildContainer: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.white,
    marginTop: 10,
    borderRadius: 8,
  },
  resourceTitleContainer: {
    paddingVertical: 8,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  resourceIconContainer: {
    padding: 6,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    marginLeft: 12,
  },
  resourceTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  resourceDescText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  resourceDescContainer: {
    flex: 1,
    flexShrink: 1,
    marginRight: 12,
  },
  resourceButtonContainer: {
    marginVertical: 8,
    marginRight: 12,
    paddingVertical: 6,
    width: 100,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  resourceButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  multiButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  selectedItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  scoreContainer: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 50,
    height: 42,
  },
  scoreText: {
    fontSize: 16,
    lineHeight: 30,
    fontFamily: Fonts.SemiBold,
  },
  scoreTextLabel: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.Medium,
    color: Colors.neutral900,
  },
  scoreTextLabelDesc: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Fonts.Regular,
    color: Colors.neutral500,
  },
});

const bottomModalStyles = StyleSheet.create({
  container: {},
  childTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.product900,
    marginBottom: 6,
  },
  itemContainer: {
    padding: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attemptText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  dateText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  scoreText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 16,
    lineHeight: 20,
  },
  dividerText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral200,
  },
  iconNextContainer: {
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
  },
});

const confirmationModalStyles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  iconContainer: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.warning200,
    backgroundColor: Colors.warning50,
  },
  titleText: {
    fontFamily: Fonts.Medium,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.neutral900,
    marginTop: 20,
  },
  descText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
    marginTop: 6,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
});
