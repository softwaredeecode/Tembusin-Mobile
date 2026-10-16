import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  KeyboardAvoidingView,
  Platform,
  Image,
  useWindowDimensions,
} from 'react-native';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';

// components
import MainHeader from '../../../Components/MainHeader';
import BottomModal from '../../../Components/BottomModal';
import { BASE_URL } from '../../../Api/GlobalUrl';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { ActionStudent } from '../../../Redux/Actions';

import { useTryoutCountdown, formatTime } from '../../../Utils/Helper';

const StartDetailTryOutPage = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { tryoutQuestionDetail, tryOutSpinner } = useSelector(
    state => state.tryout,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [raguMap, setRaguMap] = useState({});
  const [showConfirmationGoBack, setShowConfirmationGoBack] = useState(false);
  const [reportMap, setReportMap] = useState({});
  const [showReportModal, setShowReportModal] = useState(false);

  // 🔽 TAMBAHAN
  const [showQuestionPicker, setShowQuestionPicker] = useState(false);
  const tryOutDetailData = props?.route?.params?.tryOutDetailData;
  const startNewAttemptData = props?.route?.params?.startNewAttemptData;

  const remainingMs = useTryoutCountdown();
  const countdownText = formatTime(remainingMs);

  const questions = tryOutDetailData?.data?.questions || [];
  const totalQuestion = questions.length;

  const currentQuestion = useMemo(() => {
    if (!questions?.length) return null;
    return questions[currentIndex];
  }, [currentIndex, questions]);

  const currentQuestionId = currentQuestion?.id;
  const isRagu = raguMap[currentQuestionId] || false;
  const reportText = reportMap[currentQuestionId] || '';
  const [reportedMap, setReportedMap] = useState({});
  const isReported = !!reportedMap[currentQuestionId];

  useEffect(() => {
    const fetchTryoutQuestion = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      dispatch(
        ActionStudent.GetTryoutQuestionDetail(
          token,
          tryOutDetailData?.data?.id,
          currentQuestion?.id,
        ),
      );
    };
    if (currentQuestion?.id) {
      fetchTryoutQuestion();
    }
  }, [currentIndex]);

  useEffect(() => {
    if (remainingMs === null) return;
    console.log(remainingMs, 'remainingMs');
    if (remainingMs === 0) {
      handleTimesUp();
    }
  }, [remainingMs]);

  const CountdownTimer = () => {
    const isDanger = remainingMs <= 60;

    return (
      <View style={styles.timerContainer}>
        <MaterialIcons
          name="timer"
          size={16}
          color={isDanger ? Colors.error500 : Colors.warning500}
        />
        <Text
          style={[styles.timerText, isDanger && { color: Colors.error500 }]}
        >
          {countdownText}
        </Text>
      </View>
    );
  };

  const handleTimesUp = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await ActionStudent.SubmitTryOutAttempt(
      token,
      tryOutDetailData?.data?.id,
      startNewAttemptData?.data?.id,
    );
    console.log(response, 'response');
    if (response.data) {
      navigation.reset({
        index: 3,
        routes: [
          { name: 'MainTabs' },
          { name: 'TryOutPage' },
          { name: 'MyTryOutPage' },
          {
            name: 'TryOutResultPage',
            params: {
              resultData: response.data,
              tryOutDetailData: tryOutDetailData,
            },
          },
        ],
      });
    }
  };

  const handleSubmitAnswer = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    const questionId = tryoutQuestionDetail?.data?.id;
    const questionTypeId = tryoutQuestionDetail?.data?.question_type?.id;
    const payload = {
      question_id: tryoutQuestionDetail?.data?.id,
    };
    console.log(answersMap, 'answerMap');
    if (questionTypeId === 1) {
      const selectedAnswerId = answersMap[questionId];
      payload.answer_id = selectedAnswerId;
    } else if (questionTypeId === 2) {
      const selectedAnswerId = answersMap[questionId];
      payload.answer_ids = selectedAnswerId;
    } else if (questionTypeId === 3) {
      const selectedAnswerId = answersMap[questionId];
      payload.essay_text = selectedAnswerId;
    }

    const response = await ActionStudent.SubmitTryoutAnswer(
      token,
      tryOutDetailData?.data?.id,
      startNewAttemptData?.data?.id,
      payload,
    );
    return response;
  };

  const handlePrev = async () => {
    const response = await handleSubmitAnswer();
    console.log(response, 'response');
    if (response.data) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = async () => {
    const response = await handleSubmitAnswer();
    console.log(response, 'response');
    if (response.data) {
      if (currentIndex === questions.length - 1) {
        navigation.navigate('ConfirmationSubmitTryoutPage', {
          questions,
          answersMap,
          raguMap,
          tryOutDetailData,
          startNewAttemptData,
        });
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    }
  };

  const handleDoneButton = async () => {
    const response = await handleSubmitAnswer();
    console.log(response, 'response');
    if (response.data) {
      navigation.navigate('ConfirmationSubmitTryoutPage', {
        questions,
        answersMap,
        raguMap,
        tryOutDetailData,
        startNewAttemptData,
      });
    }
  };

  const handleReport = async () => {
    const url = `${BASE_URL}/student/questions/${tryoutQuestionDetail?.data?.id}/reports`;

    try {
      const token = await AsyncStorage.getItem('auth_token');

      console.log('📡 [POST REPORT] Request URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: reportText,
        }),
      });

      console.log(
        '📥 [POST REPORT] HTTP Status:',
        response.status,
        response.statusText,
      );

      const json = await response.json();
      console.log('📦 [POST REPORT] Response:', json);

      if (response.ok) {
        setReportedMap(prev => ({
          ...prev,
          [currentQuestionId]: true,
        }));
        console.log('✅ Report berhasil dikirim');
      } else {
        throw json;
      }
    } catch (error) {
      console.log('❌ [POST REPORT] Error:', error);
    } finally {
      setShowReportModal(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />
      <MainHeader
        title={`${currentIndex + 1} / ${totalQuestion}`}
        onBackPress={() => {
          setShowConfirmationGoBack(true);
        }}
        noBack={true}
        rightComponent={<CountdownTimer />}
      />

      {tryoutQuestionDetail?.data && (
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.reportRaguContainer}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch
                value={isRagu}
                onValueChange={val => {
                  setRaguMap(prev => ({
                    ...prev,
                    [currentQuestionId]: val,
                  }));
                }}
                trackColor={{ false: '#ccc', true: Colors.product900 }}
                style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }] }}
              />
              <Text style={styles.raguText}>Ragu ragu</Text>
            </View>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                setShowReportModal(true);
              }}
            >
              <Ionicons
                name="flag-outline"
                color={Colors.neutral500}
                size={16}
              />
              <Text style={styles.raguText}>Report</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentChildContainer}>
            {tryoutQuestionDetail?.data?.image_url ? (
              <Image
                source={{ uri: tryoutQuestionDetail.data.image_url }}
                style={{
                  width: '100%',
                  resizeMode: 'contain',
                  aspectRatio: 1.5,
                  marginBottom: 12,
                }}
              />
            ) : null}
            <RenderHTML
              contentWidth={width}
              source={{ html: tryoutQuestionDetail.data.content }}
            />
          </View>
          {tryoutQuestionDetail?.data?.question_type?.id === 1 && (
            <View>
              <Text style={styles.answerText}>Pilih jawaban yang benar</Text>

              {tryoutQuestionDetail.data.answers.map((item, index) => {
                const isSelected = answersMap[currentQuestion?.id] === item.id;

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    style={[
                      styles.choiceItem,
                      isSelected && styles.choiceItemSelected,
                    ]}
                    onPress={() => {
                      setAnswersMap(prev => ({
                        ...prev,
                        [currentQuestion.id]: item.id,
                      }));
                    }}
                  >
                    <View
                      style={[
                        styles.alphabetContainer,
                        isSelected && styles.alphabetContainerSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.alphabetText,
                          isSelected && styles.alphabetTextSelected,
                        ]}
                      >
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>

                    <Text style={styles.choiceText}>{item.content}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {tryoutQuestionDetail?.data?.question_type?.id === 2 && (
            <View>
              <Text style={styles.answerText}>
                Pilih jawaban yang benar (boleh lebih dari satu)
              </Text>

              {tryoutQuestionDetail.data.answers.map((item, index) => {
                const selectedAnswerIds = answersMap[currentQuestion?.id] || [];

                const isSelected = selectedAnswerIds.includes(item.id);

                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.8}
                    style={[
                      styles.choiceItem,
                      isSelected && styles.choiceItemSelected,
                    ]}
                    onPress={() => {
                      setAnswersMap(prev => {
                        const prevSelected = prev[currentQuestion.id] || [];

                        return {
                          ...prev,
                          [currentQuestion.id]: isSelected
                            ? prevSelected.filter(id => id !== item.id)
                            : [...prevSelected, item.id],
                        };
                      });
                    }}
                  >
                    <View
                      style={[
                        styles.alphabetContainer,
                        isSelected && styles.alphabetContainerSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.alphabetText,
                          isSelected && styles.alphabetTextSelected,
                        ]}
                      >
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text style={[styles.choiceText, { flex: 1 }]}>
                      {item.content}
                    </Text>
                    <Text style={[styles.choiceText, { fontSize: 11 }]}>
                      {isSelected ? 'Setuju' : 'Tidak Setuju'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {tryoutQuestionDetail?.data?.question_type?.id === 3 && (
            <View style={styles.essayContainer}>
              <View style={styles.textInputContainer}>
                <TextInput
                  value={answersMap[currentQuestion?.id] || ''}
                  multiline
                  placeholder="Tulis jawaban anda..."
                  style={styles.essayInput}
                  onChangeText={text => {
                    setAnswersMap(prev => ({
                      ...prev,
                      [currentQuestion.id]: text,
                    }));
                  }}
                  textAlignVertical="top"
                />
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* BOTTOM NAV */}
      <View style={styles.bottomComponent}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            disabled={currentIndex === 0}
            onPress={handlePrev}
            style={
              currentIndex === 0 ? styles.disableButton : styles.prevButton
            }
          >
            <Ionicons name="arrow-back" size={16} color={Colors.neutral500} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.buttonTitleText} numberOfLines={1}>
              Soal {currentIndex + 1}
            </Text>

            {/* 🔽 TAMBAHAN */}
            <TouchableOpacity
              style={styles.row}
              onPress={() => setShowQuestionPicker(true)}
            >
              <Text style={styles.breadcrumbText} numberOfLines={1}>
                Pilih soal
              </Text>
              <Ionicons
                name="chevron-down"
                size={14}
                color={Colors.warning500}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={Colors.neutral500}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 🔽 MODAL PILIH SOAL */}
      <BottomModal
        visible={showQuestionPicker}
        onClose={() => setShowQuestionPicker(false)}
        enableScroll={true}
        title={'Pilih soal'}
        withHeader={true}
      >
        <View style={pickerStyles.container}>
          <Text style={pickerStyles.categoryText}>
            {
              tryoutQuestionDetail?.data?.sub_sub_question_category
                ?.sub_sub_question_category_name
            }
          </Text>

          <View style={pickerStyles.grid}>
            {questions.map((item, index) => {
              const isAnswered = !!answersMap[item.id];
              const isActive = index === currentIndex;
              const isRagu = !!raguMap[item.id];

              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    pickerStyles.gridItem,
                    isActive && pickerStyles.active,
                  ]}
                  onPress={() => {
                    setCurrentIndex(index);
                    setShowQuestionPicker(false);
                  }}
                >
                  <View
                    style={[
                      pickerStyles.iconContainer,
                      isAnswered && pickerStyles.iconContainerSelected,
                      isRagu && pickerStyles.iconContainerRagu,
                    ]}
                  >
                    <Ionicons
                      name={isAnswered ? 'checkmark' : 'close-outline'}
                      size={14}
                      color={
                        isRagu
                          ? Colors.warning500
                          : isAnswered
                          ? Colors.success500
                          : Colors.neutral500
                      }
                    />
                  </View>
                  <Text
                    style={[
                      pickerStyles.gridText,
                      (isAnswered || isActive) && pickerStyles.gridTextActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={pickerStyles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setShowQuestionPicker(false);
                handleDoneButton();
              }}
              style={pickerStyles.doneButtonContainer}
            >
              <Text style={styles.doneButtonText}>Selesai</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomModal>

      {/* MODAL KONFIRMASI KELUAR */}
      <BottomModal
        visible={showConfirmationGoBack}
        onClose={() => setShowConfirmationGoBack(false)}
        enableScroll={false}
        withHeader={false}
      >
        <View style={bottomModalStyles.container}>
          <View style={bottomModalStyles.iconContainer}>
            <SimpleLineIcons
              name={'question'}
              size={40}
              color={Colors.danger500}
            />
          </View>
          <Text style={bottomModalStyles.titleText}>
            Keluar dari sesi latihan ?
          </Text>
          <Text style={bottomModalStyles.descText}>
            Sesi latihan akan dianggap selesai dan tidak dapat dilanjutkan lagi.
            Jawaban yang sudah kamu isi akan tersimpan apa adanya.
          </Text>
          <View style={bottomModalStyles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setShowConfirmationGoBack(false);
              }}
              style={styles.exitButtonContainer}
            >
              <Text style={styles.exitButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowConfirmationGoBack(false);
                navigation.goBack();
              }}
              style={styles.doneButtonContainer}
            >
              <Text style={styles.doneButtonText}>Ya, Keluar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomModal>

      {/* 🔽 MODAL REPORT*/}
      <BottomModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        enableScroll={true}
        title={'Report'}
        withHeader={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={reportStyles.container}>
            <View style={reportStyles.textInputContainer}>
              <TextInput
                value={reportText}
                multiline
                maxLength={150}
                placeholder="Tulis report..."
                style={reportStyles.essayInput}
                editable={!isReported}
                onChangeText={text => {
                  setReportMap(prev => ({
                    ...prev,
                    [currentQuestionId]: text,
                  }));
                }}
                textAlignVertical="top"
              />
            </View>

            <Text style={{ alignSelf: 'flex-end', marginTop: 4 }}>
              {reportText.length}/150
            </Text>
          </View>

          <View style={reportStyles.buttonContainer}>
            <TouchableOpacity
              disabled={isReported}
              onPress={handleReport}
              style={
                isReported
                  ? reportStyles.disableDoneButtonContainer
                  : reportStyles.doneButtonContainer
              }
            >
              <Text style={reportStyles.doneButtonText}>Selesai</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </BottomModal>
    </View>
  );
};

export default StartDetailTryOutPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  reportRaguContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  raguText: {
    marginLeft: 4,
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  timerText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.neutral900,
  },

  contentContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    paddingBottom: 120,
  },
  contentChildContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.white,
    borderRadius: 6,
    marginBottom: 12,
  },
  exercisesContentText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  bottomComponent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingBottom: 45,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'center',
    gap: 10,
  },

  prevButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },

  nextButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },

  disableButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    backgroundColor: Colors.neutral300,
  },
  buttonTitleText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.Medium,
    color: Colors.black,
    textAlign: 'center',
  },
  breadcrumbText: {
    fontSize: 12,
    // lineHeight: 18,
    fontFamily: Fonts.Regular,
    color: Colors.warning500,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    gap: 2,
  },
  answerText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Fonts.Medium,
    color: Colors.neutral500,
  },
  choiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    marginBottom: 4,
    marginTop: 6,
    backgroundColor: Colors.white,
  },
  choiceItemSelected: {
    borderColor: Colors.product900,
    backgroundColor: Colors.product50,
  },
  choiceText: {
    marginLeft: 12,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.neutral900,
    flexShrink: 1,
  },
  alphabetContainer: {
    padding: 4,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
  },
  alphabetText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.Medium,
    color: Colors.neutral500,
    width: 20,
    height: 20,
    textAlign: 'center',
  },
  alphabetContainerSelected: {
    borderColor: Colors.product900,
    backgroundColor: Colors.product900,
  },
  alphabetTextSelected: {
    color: Colors.white,
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
    backgroundColor: Colors.danger500,
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
  essayContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  textInputContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    height: 370,
  },
});

const bottomModalStyles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  iconContainer: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.danger200,
    backgroundColor: Colors.danger50,
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

const pickerStyles = StyleSheet.create({
  container: {
    // margin: 12
  },
  categoryText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.product900,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 16,
  },
  gridItem: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 27,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  answered: {
    backgroundColor: Colors.product50,
    borderColor: Colors.product900,
  },
  active: {
    borderWidth: 2,
    borderColor: Colors.warning500,
  },
  gridText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.neutral700,
    marginTop: 4,
  },
  gridTextActive: {
    color: Colors.product900,
  },
  iconContainer: {
    padding: 6,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: Colors.neutral50,
    borderColor: Colors.neutral200,
  },
  iconContainerSelected: {
    backgroundColor: Colors.success50,
    borderColor: Colors.success200,
  },
  buttonContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  doneButtonContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.product900,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  iconContainerRagu: {
    backgroundColor: Colors.warning50,
    borderColor: Colors.warning200,
  },
});

const reportStyles = StyleSheet.create({
  container: {},
  buttonContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  doneButtonContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.product900,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  disableDoneButtonContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.neutral400,
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
  textInputContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    height: 100,
  },
  essayInput: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
});
