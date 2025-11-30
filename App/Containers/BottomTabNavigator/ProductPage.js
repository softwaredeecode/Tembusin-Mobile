import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

// components
import AuthenticatedHeader from '../../Components/AuthenticatedHeader';

//helper
import { rupiahFormat } from '../../Utils/Helper';

const SCREEN_WIDTH = Dimensions.get('screen').width;

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState('Paket');
  const [tabWidth, setTabWidth] = useState(0);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });
  const translateContent = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH],
  });

  const paketData = [
    {
      id: 1,
      title: 'Juara SNBT',
      category: 'SNBT',
      description: [
        {
          descId: 1,
          descMessage: '5 materi pembelajaran',
        },
        {
          descId: 2,
          descMessage: '5 latihan soal',
        },
        {
          descId: 3,
          descMessage: 'Akses ke 5 try out SNBT',
        },
      ],
      token: 50,
      normalPrice: 150000,
      discount: 30,
    },
    {
      id: 2,
      title: 'Hebat SNBT',
      category: 'SNBT',
      description: [
        {
          descId: 1,
          descMessage: '5 materi pembelajaran',
        },
        {
          descId: 2,
          descMessage: '5 latihan soal',
        },
        {
          descId: 3,
          descMessage: 'Akses ke 5 try out SNBT',
        },
      ],
      token: 50,
      normalPrice: 150000,
      discount: 30,
    },
    {
      id: 3,
      title: 'Juara TKA',
      category: 'TKA',
      description: [
        {
          descId: 1,
          descMessage: '5 materi pembelajaran',
        },
        {
          descId: 2,
          descMessage: '5 latihan soal',
        },
        {
          descId: 3,
          descMessage: 'Akses ke 5 try out TKA',
        },
      ],
      token: 50,
      normalPrice: 150000,
      discount: 30,
    },
    {
      id: 4,
      title: 'Hebat TKA',
      category: 'TKA',
      description: [
        {
          descId: 1,
          descMessage: '5 materi pembelajaran',
        },
        {
          descId: 2,
          descMessage: '5 latihan soal',
        },
        {
          descId: 3,
          descMessage: 'Akses ke 5 try out TKA',
        },
      ],
      token: 50,
      normalPrice: 150000,
      discount: 30,
    },
  ];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: activeTab === 'paket' ? 0 : activeTab === 'token' ? 1 : 2,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const PaketComponent = () => {
    return (
      <View style={styles.productContainer}>
        <FlatList
          data={paketData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.packageProductContainer}>
                <View style={styles.packageProductInfoContainer}>
                  <View style={styles.row}>
                    <Text style={styles.productPackageTitleText}>
                      {item.title}
                    </Text>
                    <View style={styles.packageCategoryContainer}>
                      <Text style={styles.packageCategoryText}>
                        {item.category}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.descContainer}>
                    {item.description.map((itemDesc, index) => {
                      return (
                        <View
                          key={itemDesc.descId}
                          style={[styles.row, { marginTop: 8 }]}
                        >
                          <View style={styles.checkIconContainer}>
                            <Ionicons
                              name={'checkmark'}
                              size={14}
                              color={Colors.neutral500}
                            />
                          </View>
                          <Text>{itemDesc.descMessage}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
                <View style={styles.packageProductPriceContainer}>
                  <View style={[styles.row, { gap: 6 }]}>
                    <FontAwesome
                      name={'money'}
                      size={16}
                      color={Colors.warning500}
                    />
                    <Text style={styles.priceToken}>50</Text>
                  </View>
                  <Text style={{ color: Colors.neutral200 }}>|</Text>
                  <View style={[styles.row, { gap: 6, alignItems: 'center' }]}>
                    {item.discount > 0 ? (
                      <>
                        {/* Harga setelah diskon */}
                        <Text style={styles.priceAfterDisc}>
                          {rupiahFormat(
                            item.normalPrice -
                              (item.normalPrice * item.discount) / 100,
                          )}
                        </Text>

                        {/* Harga normal tercoret */}
                        <Text style={styles.normalPrice}>
                          {rupiahFormat(item.normalPrice)}
                        </Text>

                        {/* Persentase diskon */}
                        <View style={styles.discountContainer}>
                          <Text style={styles.discountText}>
                            {item.discount}%
                          </Text>
                        </View>
                      </>
                    ) : (
                      <>
                        {/* Hanya harga normal */}
                        <Text style={styles.normalPriceWithoutDisc}>
                          {rupiahFormat(item.normalPrice)}
                        </Text>
                      </>
                    )}
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    );
  };
  const TokenComponent = () => {
    return (
      <View style={styles.productContainer}>
        <Text>TOKEN</Text>
      </View>
    );
  };
  const HistoryComponent = () => {
    return (
      <View style={styles.productContainer}>
        <Text>HISTORY</Text>
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
                  <Text style={styles.addButtonText}>Tambah</Text>
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
            onPress={() => setActiveTab('paket')}
          >
            <Text
              style={
                activeTab === 'paket'
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
            onPress={() => setActiveTab('token')}
          >
            <Text
              style={
                activeTab === 'token'
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
            onPress={() => setActiveTab('history')}
          >
            <Text
              style={
                activeTab === 'history'
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
    backgroundColor: Colors.product900
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
    paddingBottom: 380,
    paddingTop: 4,
  },
  packageProductContainer: {
    marginTop: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  packageProductInfoContainer: {
    padding: 12,
    borderBottomColor: Colors.neutral200,
    borderBottomWidth: 1,
  },
  productPackageTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
    flex: 1,
  },
  packageCategoryContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 4,
  },
  packageCategoryText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.product900,
  },
  descContainer: {
    marginTop: 4,
  },
  checkIconContainer: {
    padding: 2,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    marginRight: 6,
  },
  packageProductPriceContainer: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  priceToken: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  priceAfterDisc: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  normalPrice: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral500,
    textDecorationLine: 'line-through',
  },
  discountContainer: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.danger200,
    backgroundColor: Colors.danger50,
    borderRadius: 4,
  },
  discountText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.danger500,
  },
  normalPriceWithoutDisc: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
});

export default ProductPage;
