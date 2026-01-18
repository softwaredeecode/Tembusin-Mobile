import React, { useState, useCallback } from 'react';
import {
  View,
  StatusBar,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

// components
import MainHeader from '../../../Components/MainHeader';
import MaterialCardComponent from '../../../Components/MaterialCardComponent';
import SearchBar from '../../../Components/SearchBar';
import BottomModal from '../../../Components/BottomModal';
import FilterButton from '../../../Components/FilterButton';
import CheckboxRow from '../../../Components/CheckboxRow';
import DatePickerField from '../../../Components/DatePickerField';
import ListEmptyComponent from '../../../Components/ListEmptyComponents';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../../Redux/Actions';

const MyMaterialPage = () => {
  const dispatch = useDispatch();
  const [searchMaterial, setSearchMaterial] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filter, setFilter] = useState({
    SBNT: false,
    UTBK: false,
    memberPaket: false,
    dapatDibeliTerpisah: false,
    free: false,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const openFilter = () => setFilterVisible(true);
  const closeFilter = () => setFilterVisible(false);

  const { myMaterialCollectionData, materialSpinner } = useSelector(
    state => state.material,
  );

  useFocusEffect(
    useCallback(() => {
      loadInitialData();
      return () => {};
    }, [dispatch]),
  );

  const loadInitialData = async () => {
    const token = await AsyncStorage.getItem('auth_token');
    setPage(1);

    dispatch(
      ActionStudent.GetMyMaterialCollectionData(token, {
        page: 1,
        limit: 10,
      }),
    );
  };

  const loadMoreData = async () => {
    if (isLoadingMore) return;

    const totalPages = myMaterialCollectionData?.data?.total_pages || 1;
    if (page >= totalPages) return;

    setIsLoadingMore(true);

    const nextPage = page + 1;
    const token = await AsyncStorage.getItem('auth_token');

    await dispatch(
      ActionStudent.GetMyMaterialCollectionData(token, {
        page: nextPage,
        limit: 10,
      }),
    );

    setPage(nextPage);
    setIsLoadingMore(false);
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          <StatusBar
            translucent
            backgroundColor={Colors.white}
            barStyle="dark-content"
          />
          <MainHeader
            rightComponent={
              <View style={styles.searchBarContainer}>
                <SearchBar
                  value={searchMaterial}
                  setValue={setSearchMaterial}
                  placeholder={'Cari materi...'}
                />
                <FilterButton onPress={openFilter} />
              </View>
            }
          />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.bodyContainer}>
        <FlatList
          data={myMaterialCollectionData?.data?.data || []}
          renderItem={({ item }) => <MaterialCardComponent item={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardDismissMode="on-drag"
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={{ paddingVertical: 16 }}>
                <ActivityIndicator size="small" color={Colors.product900} />
              </View>
            ) : null
          }
          ListEmptyComponent={
            !materialSpinner ? (
              <ListEmptyComponent
                title={'Belum ada materi yang tersedia'}
                desc={'Mulai eksplorasi dan akses materi-mu di sini.'}
                iconName={'book-open-blank-variant'}
              />
            ) : null
          }
        />
      </View>
      <BottomModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        title="Filter"
      >
        <View style={styles.filterTypeContainer}>
          <Text style={styles.filterChildTitleText}>Tipe</Text>
          <CheckboxRow
            label="SBNT"
            checked={filter.SBNT}
            onPress={() => setFilter({ ...filter, SBNT: !filter.SBNT })}
          />

          <CheckboxRow
            label="UTBK"
            checked={filter.UTBK}
            onPress={() => setFilter({ ...filter, UTBK: !filter.UTBK })}
          />
        </View>
        <View style={styles.filterAccessContainer}>
          <Text style={styles.filterChildTitleText}>Akses</Text>
          <CheckboxRow
            label="Member Paket"
            checked={filter.memberPaket}
            onPress={() =>
              setFilter({ ...filter, memberPaket: !filter.memberPaket })
            }
          />
          <CheckboxRow
            label="Dapat dibeli terpisah"
            checked={filter.dapatDibeliTerpisah}
            onPress={() =>
              setFilter({
                ...filter,
                dapatDibeliTerpisah: !filter.dapatDibeliTerpisah,
              })
            }
          />
          <CheckboxRow
            label="Free"
            checked={filter.free}
            onPress={() => setFilter({ ...filter, free: !filter.free })}
          />
        </View>
        <View style={styles.filterDateContainer}>
          <Text style={styles.filterChildTitleText}>Periode</Text>
          <View style={styles.filterDateChildContainer}>
            <DatePickerField
              placeholder="Tanggal dari"
              value={startDate}
              onChange={setStartDate}
            />
            <DatePickerField
              placeholder="Tanggal sampai"
              value={endDate}
              onChange={setEndDate}
            />
          </View>
        </View>
      </BottomModal>
    </View>
  );
};

export default MyMaterialPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchBarContainer: {
    paddingVertical: 10,
    // paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bodyContainer: {
    backgroundColor: Colors.neutral50,
    flex: 1,
    padding: 16,
  },
  filterChildTitleText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Fonts.Medium,
    color: Colors.neutral400,
    paddingVertical: 4,
  },
  filterTypeContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
    paddingBottom: 8,
  },
  filterAccessContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
    paddingVertical: 8,
  },
  filterDateContainer: {
    paddingVertical: 8,
  },
  filterDateChildContainer: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
