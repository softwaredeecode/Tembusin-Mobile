import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

// components
import MainHeader from '../../../Components/MainHeader';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

const ResultReviewDetailPage = props => {
  const resultData = props?.route?.params?.data;
  const navigation = useNavigation();
  console.log(resultData, 'resultData');

  const getScoreMeta = score => {
    if (score === null) {
      return {
        introLabel: 'Aduh',
        label: 'Tidak Selesai!',
        color: Colors.neutral500,
        border: Colors.neutral200,
        background: Colors.neutral50,
      };
    }
    if (score >= 75) {
      return {
        introLabel: 'Wah',
        label: 'Hebat!',
        color: Colors.success500,
        border: Colors.success200,
        background: Colors.success50,
      };
    }

    if (score > 45) {
      return {
        introLabel: 'Hmm',
        label: 'Lumayan!',
        color: Colors.warning500,
        border: Colors.warning200,
        background: Colors.warning50,
      };
    }

    return {
      introLabel: 'Aduh',
      label: 'Kurang!',
      color: Colors.danger500,
      border: Colors.danger200,
      background: Colors.danger50,
    };
  };
  const scoreMeta = getScoreMeta(resultData.total_score ?? null);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />
      <MainHeader title="Review hasil latihan" />
      <View style={styles.contentContainer}>
        <Text style={styles.labelCongratsText}>
          {scoreMeta.introLabel},{' '}
          {resultData.total_score !== undefined ? 'Skor Kamu' : 'Latihan soal kamu'}{' '}
          {scoreMeta.label}
        </Text>
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
            {resultData.total_score !== undefined ? Math.round(resultData.total_score) : '--'}
          </Text>
        </View>
        <Text style={styles.labelText}>{scoreMeta.label}</Text>
        <View style={styles.detailResultContainer}>
          <Text style={styles.detailResultTitleContainer}>
            Performa latihan kamu
          </Text>
          <View style={styles.detailRow}>
            <View style={styles.detailChildContainer}>
              <View
                style={[
                  styles.detailIconContainer,
                  {
                    borderColor: Colors.product200,
                    backgroundColor: Colors.product50,
                  },
                ]}
              >
                <Feather name={'target'} size={16} color={Colors.product900} />
              </View>
              <View>
                <Text style={styles.titleText}>Akurasi</Text>
                <Text style={styles.valueText}>
                  {resultData.percentage_score !== undefined ? Math.round(resultData.percentage_score) : '--'}%
                </Text>
              </View>
            </View>
            <View style={styles.detailChildContainer}>
              <View
                style={[
                  styles.detailIconContainer,
                  {
                    borderColor: Colors.success200,
                    backgroundColor: Colors.success50,
                  },
                ]}
              >
                <Feather name={'check'} size={16} color={Colors.success500} />
              </View>
              <View>
                <Text style={styles.titleText}>Jawaban benar</Text>
                <Text style={styles.valueText}>
                  {resultData.correct_answers}/{resultData.total_questions}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailChildContainer}>
              <View
                style={[
                  styles.detailIconContainer,
                  {
                    borderColor: Colors.danger200,
                    backgroundColor: Colors.danger50,
                  },
                ]}
              >
                <Feather name={'x'} size={16} color={Colors.danger500} />
              </View>
              <View>
                <Text style={styles.titleText}>Jawaban salah</Text>
                <Text style={styles.valueText}>
                  {resultData.total_questions - resultData.correct_answers}/
                  {resultData.total_questions}
                </Text>
              </View>
            </View>
            <View style={styles.detailChildContainer}>
              <View
                style={[
                  styles.detailIconContainer,
                  {
                    borderColor: Colors.neutral200,
                    backgroundColor: Colors.neutral50,
                  },
                ]}
              >
                <Feather name={'info'} size={16} color={Colors.neutral500} />
              </View>
              <View>
                <Text style={styles.titleText}>Tidak dijawab</Text>
                <Text style={styles.valueText}>
                  {resultData.total_questions - resultData.answered_questions}/
                  {resultData.total_questions}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ResultReviewDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 80,
    alignItems: 'center',
    borderTopColor: Colors.neutral200,
    borderTopWidth: 1,
  },
  labelCongratsText: {
    fontFamily: Fonts.Medium,
    fontSize: 20,
    lineHeight: 24,
    color: Colors.neutral900,
    textAlign: 'center',
    marginBottom: 40,
  },
  scoreContainer: {
    padding: 16,
    borderWidth: 2,
    width: 112,
    height: 112,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 40,
    lineHeight: 80,
    fontFamily: Fonts.SemiBold,
  },
  labelText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.Medium,
    color: Colors.neutral900,
    marginTop: 12,
    marginBottom: 40,
  },
  detailResultContainer: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.white,
    width: '100%',
  },
  detailResultTitleContainer: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.Medium,
    color: Colors.neutral500,
  },
  detailRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailChildContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flex: 1,
  },
  detailIconContainer: {
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  titleText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Fonts.Medium,
    color: Colors.neutral500,
  },
  valueText: {
    fontSize: 16,
    lineHeight: 20,
    fontFamily: Fonts.SemiBold,
    color: Colors.neutral900,
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
  buttonContainer: {
    paddingVertical: 10,
    width: '100%',
    backgroundColor: Colors.product900,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.Medium,
    color: Colors.white,
  },
  buttonOutlineContainer: {
    paddingVertical: 10,
    width: '100%',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral900,
    marginTop: 12,
  },
});
