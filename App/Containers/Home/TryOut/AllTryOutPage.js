import React, { useState, useRef } from 'react';
import {
  View,
  StatusBar,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// components
import MainHeader from '../../../Components/MainHeader';
import TryOutCardComponent from '../../../Components/TryOutCardComponent';
import SearchBar from '../../../Components/SearchBar';
import BottomModal from '../../../Components/BottomModal';
import FilterButton from '../../../Components/FilterButton';
import CheckboxRow from '../../../Components/CheckboxRow';
import DatePickerField from '../../../Components/DatePickerField';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

const screenHeight = Dimensions.get('window').height;

const AllTryOutPage = () => {
  const navigation = useNavigation();
  const [searchMaterial, setSearchMaterial] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [filter, setFilter] = useState({
    SBNT: false,
    UTBK: false,
    memberPaket: false,
    dapatDibeliTerpisah: false,
    free: false,
    SNBTJuara: false,
    SNBTHebat: false,
    SNBTBisa: false,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const openFilter = () => setFilterVisible(true);
  const closeFilter = () => setFilterVisible(false);

  const allTryoutData = [
    {
      materialTitle: 'Try Out SNBT 5',
      date: 'Akses 3 Nov - 5 Nov',
      desc: 'Untuk memberi <b>SNBT Juara.</b>',
      category: 'SNBT',
      seperateBuy: false,
      categoryCount: 4,
      question: 20,
      time: 90,
      tokenPrice: 0,
      payMethod: 'member',
    },
    {
      materialTitle: 'Try Out SNBT 4',
      date: 'Akses 3 Nov - 5 Nov',
      desc: 'Untuk memberi <b>SNBT Juara.</b>',
      category: 'SNBT',
      seperateBuy: true,
      categoryCount: 3,
      question: 20,
      time: 90,
      tokenPrice: 65,
      payMethod: 'token',
    },
    {
      materialTitle: 'Try Out SNBT 2 (Lite)',
      date: 'Akses 3 Nov - 5 Nov',
      desc: '',
      category: 'SNBT',
      seperateBuy: false,
      categoryCount: 2,
      question: 20,
      time: 90,
      tokenPrice: 0,
      payMethod: 'free',
    },
  ];

  const handleOnPress = item => {
    navigation.navigate('DetailPurchaseTryOut', { selectedItem: item });
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />

      <MainHeader title={'Semua Try Out'} />

      <View style={styles.searchBarContainer}>
        <SearchBar
          value={searchMaterial}
          setValue={setSearchMaterial}
          placeholder={'Cari try out...'}
        />
        <FilterButton onPress={openFilter} />
      </View>

      <View style={styles.bodyContainer}>
        <FlatList
          data={allTryoutData}
          renderItem={({ item }) => <TryOutCardComponent item={item} onPress={handleOnPress} />}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardDismissMode="on-drag"
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
        <View style={styles.filterAccessContainer}>
          <Text style={styles.filterChildTitleText}>Member Paket</Text>
          <CheckboxRow
            label="SNBT Juara"
            checked={filter.SNBTJuara}
            onPress={() =>
              setFilter({ ...filter, SNBTJuara: !filter.SNBTJuara })
            }
          />
          <CheckboxRow
            label="SNBT Hebat"
            checked={filter.SNBTHebat}
            onPress={() =>
              setFilter({
                ...filter,
                SNBTHebat: !filter.SNBTHebat,
              })
            }
          />
          <CheckboxRow
            label="SNBT Bisa"
            checked={filter.SNBTBisa}
            onPress={() => setFilter({ ...filter, SNBTBisa: !filter.SNBTBisa })}
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

export default AllTryOutPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  searchBarContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: Colors.neutral200,
    borderBottomColor: Colors.neutral200,
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
