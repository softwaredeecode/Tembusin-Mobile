import React, { useEffect, useCallback } from 'react';
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
import MaterialCardComponent from '../../../Components/MaterialCardComponent';
import ListEmptyComponent from '../../../Components/ListEmptyComponents';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../../Redux/Actions';
import * as ActionTypes from '../../../Redux/Constants/Types';
import { formatDateMaterial } from '../../../Utils/Helper';

const MaterialPage = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    materialCollectionData,
    materialLastReadCollectionDetailData,
    materialSpinner,
  } = useSelector(state => state.material);
  const progress =
    Math.min(
      Number(
        materialLastReadCollectionDetailData?.data?.data[0]?.statistics
          ?.progress_percentage,
      ),
      100,
    ) || 0;

  useFocusEffect(
    useCallback(() => {
      const initializeData = async () => {
        const token = await AsyncStorage.getItem('auth_token');

        Promise.all([
          dispatch(
            ActionStudent.GetMaterialCollectionData(token, {
              page: 1,
              limit: 3,
            }),
          ),
          dispatch(
            ActionStudent.GetLastReadMaterialCollectionDetailData(token, {
              limit: 1,
            }),
          ),
        ]);
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
      <MainHeader title={'Materi'} />
      <ScrollView style={styles.bodyContainer}>
        <View style={styles.lastOpenContainer}>
          <Text style={styles.titleText}>Terakhir Dipelajari</Text>
          {!materialLastReadCollectionDetailData.data ? (
            <View style={styles.lastOpenedProductContainer}>
              <Text style={styles.noneLasOpenProductText}>Belum ada</Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('MaterialDetailPage', {
                  materialCollectionId:
                    materialLastReadCollectionDetailData.data.data[0].id,
                });
              }}
              style={styles.lastOpenedProductContainer}
            >
              <View style={[styles.row, { gap: 12, alignItems: 'flex-start' }]}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name={'book-open-blank-variant'}
                    size={24}
                    color={Colors.product900}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lastOpenTitleText}>
                    {
                      materialLastReadCollectionDetailData.data.data[0]
                        .material_collection_name
                    }
                  </Text>
                  <View style={[styles.row, { gap: 6, alignItems: 'center' }]}>
                    <View style={styles.dateIconContainer}>
                      <MaterialCommunityIcons
                        name={'calendar-blank'}
                        size={12}
                        color={Colors.neutral500}
                      />
                    </View>
                    <Text style={styles.lastOpenDescText}>
                      {formatDateMaterial(
                        materialLastReadCollectionDetailData.data.data[0]
                          .last_read_at,
                      )}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.row,
                      { gap: 10, alignItems: 'center', marginTop: 10 },
                    ]}
                  >
                    <View style={styles.progressWrapper}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${progress}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {
                        materialLastReadCollectionDetailData.data.data[0]
                          .statistics.progress_percentage
                      }
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('MyMaterialPage')}
          style={[styles.row, styles.myProductContainer]}
        >
          <MaterialCommunityIcons
            name={'book-open-blank-variant'}
            size={22}
            color={Colors.neutral900}
          />
          <Text style={styles.myProductText}>Materi saya</Text>
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
            Jelajahi semua materi!
          </Text>
          {materialCollectionData?.data?.total_items > 3 && (
            <TouchableOpacity
              onPress={() => navigation.navigate('AllMaterialPage')}
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
          data={materialCollectionData?.data?.data || []}
          renderItem={({ item }) => <MaterialCardComponent item={item} />}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            !materialSpinner ? (
              <ListEmptyComponent
                title={'Belum ada materi yang tersedia'}
                desc={
                  'Materi belum tersedia untuk saat ini. Silakan cek kembali di lain waktu'
                }
                iconName={'book-open-blank-variant'}
              />
            ) : null
          }
        />
        {materialCollectionData?.data?.total_items > 3 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('AllMaterialPage')}
            style={styles.openAllMaterialContainer}
          >
            <Text style={styles.openAllMaterialText}>Lihat semua materi</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default MaterialPage;

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
    marginBottom: 10,
  },
  lastOpenDescText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  noneLasOpenProductText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral500,
    paddingVertical: 16,
    textAlign: 'center'
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
  progressFill: {
    height: '100%',
    backgroundColor: Colors.warning500,
    borderRadius: 6,
  },
  progressText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.neutral500,
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
});
