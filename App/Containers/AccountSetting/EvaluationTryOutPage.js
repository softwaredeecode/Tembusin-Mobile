import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  StatusBar,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// components
import MainHeader from '../../Components/MainHeader';
import TryOutCardComponent from '../../Components/TryOutCardComponent';
import SearchBar from '../../Components/SearchBar';
import BottomModal from '../../Components/BottomModal';
import FilterButton from '../../Components/FilterButton';
import CheckboxRow from '../../Components/CheckboxRow';
import DatePickerField from '../../Components/DatePickerField';
import ListEmptyComponent from '../../Components/ListEmptyComponents';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../Redux/Actions';

const EvaluationTryOutPage = props => {
  const categoryId = props?.route?.params?.categoryId;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { myTryOutData, tryOutSpinner } = useSelector(state => state.tryout);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadMoreData = async () => {
    if (isLoadingMore) return;

    const totalPages = myTryOutData?.data?.total_pages || 1;
    if (page >= totalPages) return;

    setIsLoadingMore(true);

    const nextPage = page + 1;
    const token = await AsyncStorage.getItem('auth_token');

    await dispatch(
      ActionStudent.GetMyTryOutData(token, {
        page: nextPage,
        limit: 10,
        // category_id: categoryId,
      }),
    );

    setPage(nextPage);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    const initializeData = async () => {
      const token = await AsyncStorage.getItem('auth_token');

      dispatch(
        ActionStudent.GetMyTryOutData(token, {
          page: 1,
          limit: 10,
          // category_id: categoryId,
        }),
      );
    };
    initializeData();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View>
          <StatusBar
            translucent
            backgroundColor={Colors.white}
            barStyle="dark-content"
          />
          <MainHeader title="Evaluasi hasil try out" />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.bodyContainer}>
        <FlatList
          data={myTryOutData.data.data || []}
          renderItem={({ item }) => <TryOutCardComponent item={item} />}
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
            !tryOutSpinner ? (
              <ListEmptyComponent
                title={'Belum ada try out yang tersedia'}
                desc={'Mulai eksplorasi dan akses try out-mu di sini.'}
                iconName={'book-open-blank-variant'}
              />
            ) : null
          }
        />
      </View>
    </View>
  );
};

export default EvaluationTryOutPage;

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
