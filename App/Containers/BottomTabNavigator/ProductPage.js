import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  InteractionManager,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

// components
import AuthenticatedHeader from '../../Components/AuthenticatedHeader';
import ProductPackageCardComponent from '../../Components/ProductPackageCardComponent';
import ProductTokenCardComponent from '../../Components/ProductTokenCardComponent';
import ListEmptyComponent from '../../Components/ListEmptyComponents';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../Redux/Actions';
import * as ActionTypes from '../../Redux/Constants/Types';

const SCREEN_WIDTH = Dimensions.get('screen').width;
const SCREEN_HEIGHT = Dimensions.get('screen').height;

const ProductPage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const hasFetched = useRef(false);

  const { productListData, productSpinner } = useSelector(
    state => state.product,
  );

  const [activeTab, setActiveTab] = useState('2');
  const [tabWidth, setTabWidth] = useState(0);
  const [page, setPage] = useState(1);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });
  const translateContent = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH],
  });

  const loadMoreData = async () => {
    if (productSpinner) return;

    const totalPages = productListData?.data?.total_pages || 1;
    if (page >= totalPages) return;

    const nextPage = page + 1;
    const token = await AsyncStorage.getItem('auth_token');

    await Promise.all([
      dispatch(
        ActionStudent.GetProductList(token, {
          page: nextPage,
          limit: 10,
          product_category_id: activeTab,
        }),
      ),
    ]);

    setPage(nextPage);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await dispatch({ type: ActionTypes.RESET_PRODUCT_LIST_DATA });
      setPage(1);
      const token = await AsyncStorage.getItem('auth_token');
      await Promise.all([
        dispatch(
          ActionStudent.GetProductList(token, {
            page: 1,
            limit: 10,
            product_category_id: activeTab,
          }),
        ),
      ]);
    };
    fetchInitialData();
  }, [activeTab]);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: activeTab === '2' ? 0 : activeTab === '1' ? 1 : 2,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const renderProductPackageItem = useCallback(
    ({ item }) => (
      <ProductPackageCardComponent item={item} navigation={navigation} />
    ),
    [],
  );

  const renderTokenPackageItem = useCallback(
    ({ item }) => (
      <ProductTokenCardComponent item={item} navigation={navigation} />
    ),
    [],
  );

  const renderEmptyComponent = () => {
    return (
      <ListEmptyComponent
        title={'Belum ada produk yang tersedia'}
        desc={
          'Produk belum tersedia untuk saat ini. Silakan cek kembali di lain waktu'
        }
        iconName={'book-open-blank-variant'}
      />
    );
  };

  const PaketComponent = () => {
    return (
      <View style={styles.productContainer}>
        <FlatList
          data={productListData?.data?.data}
          renderItem={renderProductPackageItem}
          keyboardDismissMode="on-drag"
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            productSpinner ? (
              <View style={{ paddingVertical: 16 }}>
                <ActivityIndicator size="small" color={Colors.product900} />
              </View>
            ) : null
          }
          keyExtractor={item => item?.id?.toString()}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          ListEmptyComponent={!productSpinner ? renderEmptyComponent() : null}
        />
      </View>
    );
  };
  const TokenComponent = () => {
    return (
      <View style={styles.productContainer}>
        <FlatList
          data={productListData?.data?.data}
          renderItem={renderTokenPackageItem}
          keyboardDismissMode="on-drag"
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            productSpinner ? (
              <View style={{ paddingVertical: 16 }}>
                <ActivityIndicator size="small" color={Colors.product900} />
              </View>
            ) : null
          }
          keyExtractor={item => item?.id?.toString()}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
          ListEmptyComponent={!productSpinner ? renderEmptyComponent() : null}
        />
      </View>
    );
  };
  const HistoryComponent = () => {
    return (
      <View style={styles.comingSoonContainer}>
        <MaterialCommunityIcons
          name="clock-outline"
          size={64}
          color={Colors.neutral300}
        />
        <Text style={styles.comingSoonTitle}>Coming Soon</Text>
        <Text style={styles.comingSoonDesc}>
          Fitur riwayat transaksi akan segera tersedia. Nantikan pembaruannya
          ya!
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AuthenticatedHeader title={'Produk'} />
      <View style={styles.bodyContainer}>
        <View style={styles.balanceContainer}>
          <View style={styles.tokenInformationContainer}>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.tokenText}>Token</Text>
                <View style={styles.row}>
                  <FontAwesome
                    name={'money'}
                    size={16}
                    color={Colors.warning500}
                  />
                  <Text style={styles.balanceText}>50</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.addButtonContainer}>
                <View style={styles.row}>
                  <Ionicons name={'add'} size={14} color={Colors.neutral500} />
                  <Text style={styles.addButtonText}>Top Up</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.datelineContainer, styles.row]}>
              <TouchableOpacity style={styles.champButtonContainer}>
                <View style={styles.row}>
                  <MaterialCommunityIcons
                    name="crown-outline"
                    size={16}
                    color={Colors.product900}
                  />
                  <Text style={styles.champButtonText}>Juara</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.deadlineText}>Aktif sampai 1 Jan 2025</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.activeProductContainer}>
            <Text style={styles.activeProductText}>1 produk aktif</Text>
            <Ionicons
              name={'chevron-forward'}
              size={14}
              color={Colors.product400}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.switchContainer}>
        <View
          style={styles.switchChildContainer}
          onLayout={e => {
            const total = e.nativeEvent.layout.width;
            setTabWidth(total / 3);
          }}
        >
          {/* Sliding Indicator */}
          <Animated.View
            style={[
              styles.indicator,
              { width: tabWidth - 8, transform: [{ translateX }] },
            ]}
          />

          {/* Paket */}
          <TouchableOpacity
            style={styles.widthFlex}
            onPress={() => setActiveTab('2')}
          >
            <Text
              style={
                activeTab === '2'
                  ? styles.activeSwitchText
                  : styles.inActiveSwitchText
              }
            >
              Paket
            </Text>
          </TouchableOpacity>

          {/* Token */}
          <TouchableOpacity
            style={styles.widthFlex}
            onPress={() => setActiveTab('1')}
          >
            <Text
              style={
                activeTab === '1'
                  ? styles.activeSwitchText
                  : styles.inActiveSwitchText
              }
            >
              Token
            </Text>
          </TouchableOpacity>

          {/* History */}
          <TouchableOpacity
            style={styles.widthFlex}
            onPress={() => setActiveTab('3')}
          >
            <Text
              style={
                activeTab === '3'
                  ? styles.activeSwitchText
                  : styles.inActiveSwitchText
              }
            >
              History
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View
        style={{
          flexDirection: 'row',
          width: SCREEN_WIDTH * 2,
          transform: [{ translateX: translateContent }],
        }}
      >
        <View style={{ width: SCREEN_WIDTH }}>
          <PaketComponent />
        </View>

        <View style={{ width: SCREEN_WIDTH }}>
          <TokenComponent />
        </View>
        <View style={{ width: SCREEN_WIDTH }}>
          <HistoryComponent />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  bodyContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.product900,
  },
  balanceContainer: {
    borderRadius: 6,
    backgroundColor: Colors.white,
  },
  tokenInformationContainer: {
    padding: 12,
    borderBottomColor: Colors.neutral200,
    borderBottomWidth: 1,
  },
  tokenText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 20,
    lineHeight: 24,
    color: Colors.neutral900,
    marginLeft: 6,
  },
  addButtonContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  addButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral900,
    marginLeft: 6,
  },
  datelineContainer: {
    marginTop: 12,
    justifyContent: 'space-between',
  },
  champButtonContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: Colors.product50,
    borderWidth: 1,
    borderColor: Colors.product200,
  },
  champButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.product900,
    marginLeft: 6,
  },
  deadlineText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  activeProductText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.product500,
  },
  activeProductContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  switchContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.product900,
  },
  switchChildContainer: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: Colors.product950,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 4,
    backgroundColor: Colors.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  widthFlex: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  inActiveSwitchText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.product500,
  },
  activeSwitchText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.neutral900,
  },
  productContainer: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: SCREEN_HEIGHT * 0.3,
  },
  comingSoonContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },

  comingSoonTitle: {
    marginTop: 16,
    fontFamily: Fonts.SemiBold,
    fontSize: 18,
    color: Colors.neutral700,
  },

  comingSoonDesc: {
    marginTop: 8,
    fontFamily: Fonts.Regular,
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ProductPage;
