import {
  StyleSheet,
  StatusBar,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

// components
import MainHeader from '../../../Components/MainHeader';
import ErrorModal from '../../../Components/ErrorModal';
import BottomModal from '../../../Components/BottomModal';

//Constant
import { BASE_URL, TRYOUT } from '../../../Api/GlobalUrl';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { ActionStudent } from '../../../Redux/Actions';

const ReviewTryOutPage = props => {
  const dispatch = useDispatch();
  const resultData = props?.route?.params?.resultData;
  const [reviewResult, setResultReview] = useState(null);
  const { tryoutQuestionDetail, tryOutSpinner } = useSelector(
    state => state.tryout,
  );

  const questions = reviewResult || [];
  const totalQuestion = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestionPicker, setShowQuestionPicker] = useState(false);

  console.log(resultData, 'resultData');

  const currentQuestion = useMemo(() => {
    if (!questions?.length) return null;
    return questions[currentIndex];
  }, [currentIndex, questions]);

  const getAnswerStatus = question => {
    if (!question?.student_answer_id) return 'not_answered';
    if (question?.is_correct) return 'correct';
    return 'wrong';
  };

  const getMyReviewResult = async () => {
    const url = `${BASE_URL}${TRYOUT.tryoutDetail}/${resultData.tryout_id}/attempts/${resultData.id}/review`;

    try {
      const token = await AsyncStorage.getItem('auth_token');
      console.log('📡 [FETCH MY REVIEW RESULT] Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        '📥 [FETCH MY REVIEW RESULT] HTTP Status:',
        response.status,
        response.statusText,
      );

      const json = await response.json();
      console.log('📦 [FETCH MY REVIEW RESULT] Response:', json);

      if (response.ok) {
        setResultReview(json.questions);
      } else {
        throw json;
      }
    } catch (error) {
      console.log('❌ [FETCH MY REVIEW RESULT] Error:', error);
    } finally {
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestion - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    const fetchExercisesQuestion = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      dispatch(
        ActionStudent.GetTryoutQuestionDetail(
          token,
          resultData.tryout_id,
          currentQuestion?.id,
        ),
      );
    };
    if (currentQuestion?.id) {
      fetchExercisesQuestion();
    }
  }, [currentIndex, reviewResult]);

  useEffect(() => {
    getMyReviewResult();
  }, []);

  console.log(questions, 'questions');

  const RenderMultipleChoiceAnswer = ({ question, answers }) => {
    const status = getAnswerStatus(question);
    return (
      <View>
        <Text style={styles.answerText}>Review Jawaban</Text>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: Colors.success500 },
              ]}
            />
            <Text style={styles.legendText}>Jawaban benar</Text>
          </View>

          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: Colors.product900 },
              ]}
            />
            <Text style={styles.legendText}>Jawaban kamu</Text>
          </View>
        </View>
        {status === 'not_answered' && (
          <Text style={styles.notAnsweredText}>
            Kamu tidak menjawab soal ini!
          </Text>
        )}
        {answers.map((item, index) => {
          const isSelected = item.id === question?.student_answer_id;
          const isCorrect = item.correct_flag === 1;

          console.log(isCorrect, 'isCorrect');

          return (
            <View
              key={item.id}
              style={[
                styles.choiceItem,
                isSelected && styles.choiceItemSelected,
                isCorrect && styles.choiceItemCorrect,
              ]}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.alphabetContainer,
                  isSelected && styles.alphabetContainerSelected,
                  isCorrect && styles.alphabetContainerCorrect,
                ]}
              >
                <Text
                  style={[
                    styles.alphabetText,
                    isSelected && styles.alphabetTextSelected,
                    isCorrect && styles.alphabetTextCorrect,
                  ]}
                >
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>

              <Text style={styles.choiceText}>{item.content}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const RenderMultipleChoiceMultipleAnswer = ({ question, answers }) => {
    const status = getAnswerStatus(question);
    return (
      <View>
        <Text style={styles.answerText}>Review Jawaban</Text>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: Colors.success500 },
              ]}
            />
            <Text style={styles.legendText}>Jawaban benar</Text>
          </View>

          {/* <View style={styles.legendItem}>
            <View
              style={[
                styles.legendColor,
                { backgroundColor: Colors.product900 },
              ]}
            />
            <Text style={styles.legendText}>Jawaban kamu</Text>
          </View> */}
        </View>
        {/* {status === 'not_answered' && (
          <Text style={styles.notAnsweredText}>
            Kamu tidak menjawab soal ini!
          </Text>
        )} */}
        {answers.map((item, index) => {
          const isSelected = item.id === question?.student_answer_id;
          const isCorrect = item.correct_flag === 1;

          console.log(isCorrect, 'isCorrect');

          return (
            <View
              key={item.id}
              style={[
                styles.choiceItem,
                isSelected && styles.choiceItemSelected,
                isCorrect && styles.choiceItemCorrect,
              ]}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.alphabetContainer,
                  isSelected && styles.alphabetContainerSelected,
                  isCorrect && styles.alphabetContainerCorrect,
                ]}
              >
                <Text
                  style={[
                    styles.alphabetText,
                    isSelected && styles.alphabetTextSelected,
                    isCorrect && styles.alphabetTextCorrect,
                  ]}
                >
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>

              <Text style={styles.choiceText}>{item.content}</Text>
            </View>
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
      <MainHeader title="Review hasil try out" />
      {tryoutQuestionDetail?.data && (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.contentChildContainer}>
            <Text style={styles.exercisesContentText}>
              {tryoutQuestionDetail.data.content}
            </Text>
          </View>

          {tryoutQuestionDetail?.data?.question_type?.id === 1 && (
            <RenderMultipleChoiceAnswer
              question={currentQuestion}
              answers={tryoutQuestionDetail?.data?.answers}
            />
          )}
          {tryoutQuestionDetail?.data?.question_type?.id === 3 && (
            <View>
              <Text style={styles.answerText}>Jawaban Benar</Text>

              <View style={[styles.contentChildContainer, { marginTop: 5 }]}>
                <Text style={styles.exercisesContentText}>
                  {tryoutQuestionDetail?.data?.answers[0].content}
                </Text>
              </View>
            </View>
          )}
          {tryoutQuestionDetail?.data?.question_type?.id === 2 && (
            <RenderMultipleChoiceMultipleAnswer
              questionId={currentQuestion?.id}
              answers={tryoutQuestionDetail?.data?.answers}
            />
          )}
          {/* {tryoutQuestionDetail?.data?.question_type?.id === 3 && (
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
          )} */}
          {currentQuestion?.explanation && (
            <>
              <Text style={[styles.answerText, { marginVertical: 8 }]}>
                Penjelasan
              </Text>
              <View style={styles.essayContainer}>
                <View style={[styles.textInputContainer, { height: 'auto' }]}>
                  <Text
                    style={[styles.essayInput, { color: Colors.neutral900 }]}
                  >
                    {currentQuestion?.explanation}
                  </Text>
                </View>
              </View>
            </>
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

          <TouchableOpacity
            disabled={currentIndex === questions.length - 1}
            onPress={handleNext}
            style={
              currentIndex === questions.length - 1
                ? styles.disableButton
                : styles.nextButton
            }
          >
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
          <View style={pickerStyles.grid}>
            {questions.map((item, index) => {
              const isActive = index === currentIndex;
              const status = getAnswerStatus(item);

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
                      status === 'correct' && pickerStyles.iconContainerCorrect,
                      status === 'wrong' && pickerStyles.iconContainerRagu,
                    ]}
                  >
                    <Ionicons
                      name={
                        status === 'correct'
                          ? 'checkmark'
                          : status === 'not_answered'
                          ? 'help'
                          : 'close-outline'
                      }
                      size={14}
                      color={
                        status === 'correct'
                          ? Colors.success500
                          : status === 'wrong'
                          ? Colors.danger500
                          : Colors.neutral500
                      }
                    />
                  </View>
                  <Text
                    style={[
                      pickerStyles.gridText,
                      isActive && pickerStyles.gridTextActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </BottomModal>
    </View>
  );
};

export default ReviewTryOutPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
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
  choiceItemCorrect: {
    borderColor: Colors.success500,
    backgroundColor: Colors.success50,
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
  alphabetContainerCorrect: {
    borderColor: Colors.success500,
    backgroundColor: Colors.success500,
  },
  alphabetTextSelected: {
    color: Colors.white,
  },
  alphabetTextCorrect: {
    color: Colors.white,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    gap: 16,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 3,
    marginRight: 6,
  },

  legendText: {
    fontSize: 12,
    fontFamily: Fonts.Regular,
    color: Colors.neutral500,
  },

  notAnsweredText: {
    marginTop: 6,
    marginBottom: 4,
    fontSize: 12,
    fontFamily: Fonts.Medium,
    color: Colors.warning600,
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
  essayInput: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral400,
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
  iconContainerCorrect: {
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
    backgroundColor: Colors.danger50,
    borderColor: Colors.danger200,
  },
});
