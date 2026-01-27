import React, { useCallback } from 'react';
import {
  View,
  StatusBar,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// components
import MainHeader from '../../../Components/MainHeader';
import TryOutCardComponents from '../../../Components/TryOutCardComponent';
import ListEmptyComponent from '../../../Components/ListEmptyComponents';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../../Redux/Actions';

const TryOutPage = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const lastOpenData = {
    title: 'Try Out SNBT 3',
    desc: 'Akses 3 Nov - 4 Nov',
    category: 'SNBT',
  };

  const { allTryOutData, tryOutSpinner } = useSelector(state => state.tryout);

  useFocusEffect(
    useCallback(() => {
      const initializeData = async () => {
        const token = await AsyncStorage.getItem('auth_token');

        dispatch(
          ActionStudent.GetAllTryOutData(token, {
            page: 1,
            limit: 3,
          }),
        );
      };
      initializeData();

      return () => {};
    }, [dispatch]),
  );

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />
      <MainHeader title={'Try Out'} />
      <ScrollView style={styles.bodyContainer}>
        <View style={styles.lastOpenContainer}>
          <Text style={styles.titleText}>Akan Datang</Text>
          <View style={styles.lastOpenedProductContainer}>
            <View style={[styles.row, { gap: 12, alignItems: 'flex-start' }]}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={'clipboard-check-outline'}
                  size={24}
                  color={Colors.product900}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={[styles.row, styles.titleContainer]}>
                  <Text style={styles.lastOpenTitleText}>
                    {lastOpenData.title}
                  </Text>
                  <View style={styles.tryoutCategoryContainer}>
                    <Text style={styles.tryoutCategoryText}>
                      {lastOpenData.category}
                    </Text>
                  </View>
                </View>

                <View style={[styles.row, { gap: 6, alignItems: 'center' }]}>
                  <View style={styles.dateIconContainer}>
                    <MaterialCommunityIcons
                      name={'calendar-blank'}
                      size={12}
                      color={Colors.neutral500}
                    />
                  </View>
                  <Text style={styles.lastOpenDescText}>
                    {lastOpenData.desc}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('MyTryOutPage')}
          style={[styles.row, styles.myProductContainer]}
        >
          <MaterialCommunityIcons
            name={'file-document-edit-outline'}
            size={22}
            color={Colors.neutral900}
          />
          <Text style={styles.myProductText}>Try out saya</Text>
          <View style={styles.myProductQtyContainer}>
            <Text style={styles.myProductQtytext}>3</Text>
          </View>
          <Ionicons
            name={'chevron-forward'}
            size={16}
            color={Colors.neutral400}
          />
        </TouchableOpacity>
        <View style={[styles.row, styles.exploreAllProductTitleContainer]}>
          <Text style={styles.exploreAllProductTitleText}>
            Jelajahi semua try out!
          </Text>
          {allTryOutData.data.total_items && (
            <TouchableOpacity
              onPress={() => navigation.navigate('AllTryOutPage')}
              style={[styles.row, styles.exploreAllProductTitleButtonContainer]}
            >
              <Text style={styles.exploreAllProductTitleButtonText}>
                Lihat semua
              </Text>
              <Ionicons
                name={'chevron-forward'}
                size={14}
                color={Colors.product500}
              />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={allTryOutData?.data?.data || []}
          renderItem={({ item }) => {
            return <TryOutCardComponents item={item} />;
          }}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          gap={12}
          ListEmptyComponent={
            !tryOutSpinner ? (
              <ListEmptyComponent
                title={'Belum ada try out yang tersedia'}
                desc={
                  'Try out belum tersedia untuk saat ini. Silakan cek kembali di lain waktu.'
                }
                iconName={'book-open-blank-variant'}
              />
            ) : null
          }
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('AllTryOutPage')}
          style={styles.openAllMaterialContainer}
        >
          <Text style={styles.openAllMaterialText}>
            Lihat semua try out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default TryOutPage;

const styles = StyleSheet.create({
  bodyContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  lastOpenContainer: {
    backgroundColor: Colors.product900,
    borderRadius: 8,
    padding: 12,
  },
  titleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
  lastOpenedProductContainer: {
    marginTop: 14,
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 6,
  },
  lastOpenTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  lastOpenDescText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  row: {
    flexDirection: 'row',
  },
  iconContainer: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 6,
  },
  dateIconContainer: {
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    borderRadius: 6,
  },
  progressWrapper: {
    width: '85%',
    height: 6,
    backgroundColor: Colors.neutral200,
    borderRadius: 6,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  myProductContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    marginTop: 10,
  },
  myProductText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
    marginLeft: 8,
    flex: 1,
  },
  myProductQtytext: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  myProductQtyContainer: {
    paddingVertical: 1,
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 4,
    backgroundColor: Colors.neutral50,
  },
  exploreAllProductTitleContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingVertical: 10,
  },
  exploreAllProductTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  exploreAllProductTitleButtonContainer: {
    alignItems: 'center',
    gap: 2,
  },
  exploreAllProductTitleButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.product500,
  },
  openAllMaterialContainer: {
    marginBottom: 50,
    marginTop: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderRadius: 8,
  },
  openAllMaterialText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  tryoutCategoryContainer: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 4,
  },
  tryoutCategoryText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.product900,
  },
});
