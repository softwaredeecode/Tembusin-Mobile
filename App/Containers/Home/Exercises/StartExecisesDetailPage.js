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
} from 'react-native';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

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

const StartExecisesDetailPage = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const exercisesSetDetailData = props?.route?.params?.exercisesSetDetailData;
  const startNewAttemptData = props?.route?.params?.startNewAttemptData;
  const { exerciseDetailContent, exercisesSpinner } = useSelector(
    state => state.exercises,
  );
  const questions = exercisesSetDetailData?.data?.questions || [];
  const totalQuestion = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answersMap, setAnswersMap] = useState({});
  const [raguMap, setRaguMap] = useState({});
  const [showConfirmationGoBack, setShowConfirmationGoBack] = useState(false);
  const [reportMap, setReportMap] = useState({});

  // 🔽 TAMBAHAN
  const [showQuestionPicker, setShowQuestionPicker] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const currentQuestion = useMemo(() => {
    if (!questions?.length) return null;
    return questions[currentIndex];
  }, [currentIndex, questions]);

  const currentQuestionId = currentQuestion?.id;
  const isRagu = raguMap[currentQuestionId] || false;
  const reportText = reportMap[currentQuestionId] || '';
  const [reportedMap, setReportedMap] = useState({});
  const isReported = !!reportedMap[currentQuestionId];

  const handleSubmitAnswer = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    const questionId = exerciseDetailContent?.data?.id;
    const questionTypeId = exerciseDetailContent?.data?.question_type?.id;
    const payload = {
      question_id: exerciseDetailContent?.data?.id,
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

    const response = await ActionStudent.SubmitAnswer(
      token,
      exercisesSetDetailData?.data?.id,
      startNewAttemptData?.data?.id,
      payload,
    );
    return response;
  };

  const handleNext = async () => {
    const response = await handleSubmitAnswer();
    console.log(response, 'response');
    if (response.data) {
      if (currentIndex === questions.length - 1) {
        navigation.navigate('ConfirmationSubmitExercisesPage', {
          questions,
          answersMap,
          raguMap,
          exercisesSetDetailData,
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
      navigation.navigate('ConfirmationSubmitExercisesPage', {
        questions,
        answersMap,
        raguMap,
        exercisesSetDetailData,
        startNewAttemptData,
      });
    }
  };

  const handlePrev = async () => {
    const response = await handleSubmitAnswer();
    console.log(response, 'response');
    if (response.data) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleReport = async () => {
    const url = `${BASE_URL}/student/questions/${exerciseDetailContent?.data?.id}/reports`;

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

  useEffect(() => {
    const fetchExercisesQuestion = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      dispatch(
        ActionStudent.GetExercisesDetailContent(
          token,
          exercisesSetDetailData?.data?.id,
          currentQuestion?.id,
        ),
      );
    };
    if (currentQuestion?.id) {
      fetchExercisesQuestion();
    }
  }, [currentIndex]);

  const RenderMultipleChoiceAnswer = ({ questionId, answers }) => {
    const selectedAnswerId = answersMap[questionId];

    return (
      <View>
        <Text style={styles.answerText}>Pilih jawaban yang benar</Text>

        {answers.map((item, index) => {
          const isSelected = selectedAnswerId === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.choiceItem,
                isSelected && styles.choiceItemSelected,
              ]}
              onPress={() => {
                setAnswersMap(prev => ({
                  ...prev,
                  [questionId]: item.id,
                }));
              }}
              activeOpacity={0.8}
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
    );
  };

  const RenderMultipleChoiceMultipleAnswer = ({ questionId, answers }) => {
    const selectedAnswerIds = answersMap[questionId] || [];

    const toggleAnswer = answerId => {
      setAnswersMap(prev => {
        const prevSelected = prev[questionId] || [];

        const isSelected = prevSelected.includes(answerId);

        return {
          ...prev,
          [questionId]: isSelected
            ? prevSelected.filter(id => id !== answerId)
            : [...prevSelected, answerId],
        };
      });
    };

    return (
      <View>
        <Text style={styles.answerText}>
          Pilih jawaban yang benar (boleh lebih dari satu)
        </Text>

        {answers.map((item, index) => {
          const isSelected = selectedAnswerIds.includes(item.id);

          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.choiceItem,
                isSelected && styles.choiceItemSelected,
              ]}
              onPress={() => toggleAnswer(item.id)}
              activeOpacity={0.8}
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
    );
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
      />

      {exerciseDetailContent?.data && (
        <ScrollView contentContainerStyle={styles.contentContainer}>
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
            <Text style={styles.exercisesContentText}>
              {exerciseDetailContent.data.content}
            </Text>
          </View>

          {exerciseDetailContent?.data?.question_type?.id === 1 && (
            <RenderMultipleChoiceAnswer
              questionId={currentQuestion?.id}
              answers={exerciseDetailContent?.data?.answers}
            />
          )}
          {exerciseDetailContent?.data?.question_type?.id === 2 && (
            <RenderMultipleChoiceMultipleAnswer
              questionId={currentQuestion?.id}
              answers={exerciseDetailContent?.data?.answers}
            />
          )}
          {exerciseDetailContent?.data?.question_type?.id === 3 && (
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
              exercisesSetDetailData?.data?.sub_question_category
                ?.sub_question_category_name
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

export default StartExecisesDetailPage;

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
