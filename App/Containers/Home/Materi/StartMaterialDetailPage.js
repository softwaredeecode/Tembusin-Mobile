import { StyleSheet, Text, View, StatusBar, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

// components
import MainHeader from '../../../Components/MainHeader';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../../Redux/Actions';

const StartMaterialDetailPage = props => {
  const dispatch = useDispatch();
  const materialId = props?.route?.params?.materialId;
  const materialCollectionDetailData =
    props?.route?.params?.materialCollectionDetailData;
  const { materialDetailData, materialSpinner } = useSelector(
    state => state.material,
  );

  useEffect(() => {
    const initializeData = async () => {
      const token = await AsyncStorage.getItem('auth_token');

      dispatch(ActionStudent.GetMaterialDetailData(token, materialId));
    };
    initializeData();
  }, []);

  console.log(materialDetailData, 'materialDetailData');

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />
      <MainHeader
        rightComponent={
          <View style={[styles.row, { gap: 6 }]}>
            <AnimatedCircularProgress
              size={24}
              width={4}
              fill={
                materialCollectionDetailData.data.statistics.progress_percentage
              }
              tintColor={Colors.warning500}
              backgroundColor={Colors.neutral200}
              rotation={180}
              lineCap="round"
            ></AnimatedCircularProgress>
            <Text style={styles.progressText}>
              {materialCollectionDetailData.data.statistics.progress_percentage}
              %
            </Text>
          </View>
        }
      />
      {materialDetailData?.data && (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.contentChildContainer}>
            <Text style={styles.materialNameText}>
              {materialDetailData.data.material_name}
            </Text>
            <Text style={styles.materialContentText}>
              {materialDetailData.data.content}
            </Text>
          </View>
          <View style={styles.contentChildContainer}>
            <Text style={styles.materialNameText}>
              Pembahasan
            </Text>
            <Text style={styles.materialContentText}>
              {materialDetailData.data.explanation_url}
            </Text>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default StartMaterialDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
  },
  contentContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  contentChildContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.white,
    borderRadius: 6,
    marginBottom:16,
  },
  materialNameText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.product900,
    marginBottom: 10,
  },
  materialContentText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
    marginBottom: 10,
  },
});
