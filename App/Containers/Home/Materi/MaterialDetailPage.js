import { StyleSheet, Text, View, StatusBar } from 'react-native';
import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// components
import MainHeader from '../../../Components/MainHeader';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../../Redux/Actions';

const MaterialDetailPage = props => {
  const dispatch = useDispatch();
  const materialCollectionId = props?.route?.params?.materialCollectionId;

  const { materialCollectionDetailData, materialSpinner } = useSelector(
    state => state.material,
  );

  //   useFocusEffect(
  //     useCallback(() => {
  //       const initializeData = async () => {
  //         const token = await AsyncStorage.getItem('auth_token');

  //         dispatch(
  //           ActionStudent.GetMaterialCollectionData(token, {
  //             page: 1,
  //             limit: 3,
  //           }),
  //         );
  //       };
  //       initializeData();

  //       return () => {};
  //     }, [dispatch]),
  //   );

  useEffect(() => {
    const initializeData = async () => {
      const token = await AsyncStorage.getItem('auth_token');

      dispatch(
        ActionStudent.GetMaterialCollectionDetailData(
          token,
          materialCollectionId,
        ),
      );
    };
    initializeData();
  }, []);

  console.log('materialCollectionDetailData: ', materialCollectionDetailData);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />

      <MainHeader title={'Detail Materi'} />
      <Text>TEST</Text>
    </View>
  );
};

export default MaterialDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
