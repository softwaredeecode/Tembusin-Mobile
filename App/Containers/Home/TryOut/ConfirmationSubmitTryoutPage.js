import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

import MainHeader from '../../../Components/MainHeader';
import BottomModal from '../../../Components/BottomModal';

// redux
import { ActionStudent } from '../../../Redux/Actions';
import { useTryoutCountdown, formatTime } from '../../../Utils/Helper';

const ConfirmationSubmitTryoutPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [showConfirmationGoBack, setShowConfirmationGoBack] = useState(false);
  const [loading, setLoading] = useState(false);

  const remainingMs = useTryoutCountdown();
  const countdownText = formatTime(remainingMs);

  const {
    questions = [],
    answersMap = {},
    raguMap = {},
    tryOutDetailData,
    startNewAttemptData,
  } = route.params || {};

  const handleSubmitAttempt = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('auth_token');
    const response = await ActionStudent.SubmitTryOutAttempt(
      token,
      tryOutDetailData?.data?.id,
      startNewAttemptData?.data?.id,
    );
    console.log(response, 'response');
    if (response.data) {
      setShowConfirmationGoBack(false);
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
    setLoading(false);
  };

  useEffect(() => {
    if (remainingMs === null) return;
    console.log(remainingMs, 'remainingMs');
    if (remainingMs === 0) {
      handleSubmitAttempt();
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

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />

      <MainHeader
        title={tryOutDetailData.data.tryout_name}
        showBack={false}
        rightComponent={<CountdownTimer />}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {questions.map((item, index) => {
            const isAnswered = !!answersMap[item.id];
            const isRagu = !!raguMap[item.id];

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.gridItem]}
                onPress={() => {
                  navigation.goBack();
                }}
              >
                <View
                  style={[
                    styles.iconContainer,
                    isAnswered && styles.iconContainerSelected,
                    isRagu && styles.iconContainerRagu,
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
                  style={[styles.gridText, isAnswered && styles.gridTextActive]}
                >
                  {index + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottom}>
        <TouchableOpacity
          onPress={() => {
            setShowConfirmationGoBack(true);
          }}
          style={styles.doneButton}
        >
          <Text style={styles.doneButtonText}>Selesai</Text>
        </TouchableOpacity>
      </View>

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
              color={Colors.warning500}
            />
          </View>
          <Text style={bottomModalStyles.titleText}>Selesaikan Try Out?</Text>
          <Text style={bottomModalStyles.descText}>
            Pastikan semua jawaban sudah kamu pilih. Setelah sesi diselesaikan,
            kamu tidak bisa mengubah jawaban lagi.
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
                handleSubmitAttempt();
              }}
              style={styles.doneButtonContainer}
            >
              <Text style={styles.doneButtonText}>Ya, Selesaikan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomModal>
    </View>
  );
};

export default ConfirmationSubmitTryoutPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
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
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
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
  bottom: {
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
  doneButton: {
    padding: 12,
    backgroundColor: Colors.product900,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
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
  doneButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
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
