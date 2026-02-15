import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Octicons from 'react-native-vector-icons/Octicons';
import { useNavigation } from '@react-navigation/native';

// components
import MainHeader from '../../Components/MainHeader';
import ErrorModal from '../../Components/ErrorModal';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

// redux
import { useSelector, useDispatch } from 'react-redux';
import { ActionStudent } from '../../Redux/Actions';
import { rupiahFormat } from '../../Utils/Helper';

const ProductDetailPurchasePage = props => {
  const productData = props?.route?.params?.productData;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { productDetailData, productSpinner } = useSelector(
    state => state.product,
  );
  const userToken = 50000;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [loadingBuyProduct, setLoadingBuyProduct] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const isTokenInsufficient =
    userToken < productDetailData?.data?.price_token &&
    selectedPaymentMethod === 1;

  const handlePurchaseProduct = async () => {
    setLoadingBuyProduct(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const currency = selectedPaymentMethod === 1 ? 'token' : 'currency';

      const response = await ActionStudent.PurchaseProduct(
        token,
        productDetailData.data.id,
        currency,
      );

      console.log(response, 'INI RESPONSE PurchaseProduct');

      if (response.status === 201) {
        if (selectedPaymentMethod === 2) {
          navigation.replace('ProductPaymentCurrencyStatusPage', {
            paymentData: response.data,
          });
        } else {
          navigation.replace('ProductPaymentTokenStatusPage', {
            paymentData: response.data,
          });
        }
      } else {
        setShowErrorModal(true);
        setErrorMessage(response.data?.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      console.log('PurchaseProduct error:', error);
      setShowErrorModal(true);
      setErrorMessage('Terjadi kesalahan sistem');
    } finally {
      setLoadingBuyProduct(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const initializeData = async () => {
        const token = await AsyncStorage.getItem('auth_token');

        dispatch(ActionStudent.GetProductDetailData(token, productData.id));
      };
      initializeData();

      return () => {};
    }, [dispatch]),
  );

  if (!productDetailData?.data) {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor={Colors.white} />
        <MainHeader title="Beli Produk" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />
      <MainHeader title={'Beli Produk'} />
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        <View style={styles.titleIconCategoryContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="crown-outline"
              size={24}
              color={Colors.product900}
            />
          </View>
          {productDetailData?.data?.category_name && (
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>
                {productDetailData.data.category_name}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.productNameContainer}>
          <Text style={styles.productNameText}>
            {productDetailData.data.product_name}
          </Text>
        </View>
        {productDetailData?.data?.package_items?.material_count > 0 && (
          <View style={styles.packageItemContainer}>
            <View style={styles.packageItemIconContainer}>
              <Ionicons name="checkmark" size={14} color={Colors.neutral500} />
            </View>
            <Text style={styles.packageItemText}>
              {productDetailData.data.package_items.material_count} materi
              pembelajaran
            </Text>
          </View>
        )}
        {productDetailData?.data?.package_items?.practice_set_count > 0 && (
          <View style={styles.packageItemContainer}>
            <View style={styles.packageItemIconContainer}>
              <Ionicons name="checkmark" size={14} color={Colors.neutral500} />
            </View>
            <Text style={styles.packageItemText}>
              {productDetailData.data.package_items.practice_set_count} latihan
              soal
            </Text>
          </View>
        )}
        {productDetailData?.data?.package_items?.tryout_count > 0 && (
          <View style={styles.packageItemContainer}>
            <View style={styles.packageItemIconContainer}>
              <Ionicons name="checkmark" size={14} color={Colors.neutral500} />
            </View>
            <Text style={styles.packageItemText}>
              {productDetailData.data.package_items.tryout_count} Akses ke 5 try
              out {productDetailData.data.category_name}
            </Text>
          </View>
        )}
        <View style={styles.priceContainer}>
          <Text style={styles.priceTitleText}>Harga</Text>
          {productDetailData.data.price_token > 0 && (
            <View style={styles.priceItemContainer}>
              <Text style={styles.priceItemTitleText}>Bayar dengan Token</Text>
              <View style={styles.priceValueContainer}>
                <FontAwesome
                  name={'money'}
                  size={14}
                  color={Colors.warning500}
                />
                <Text style={styles.priceItemValueText}>
                  {productDetailData.data.price_token}
                </Text>
              </View>
            </View>
          )}
          {productDetailData.data.price > 0 && (
            <View style={styles.priceItemContainer}>
              <Text style={styles.priceItemTitleText}>Bayar dengan Bank</Text>
              <View style={styles.priceValueContainer}>
                {productDetailData.data.discount_percentage > 0 && (
                  <View style={styles.discountContainer}>
                    <Text style={styles.discountText}>
                      {productDetailData.data.discount_percentage}%
                    </Text>
                  </View>
                )}
                <Text style={styles.priceItemValueText}>
                  {rupiahFormat(
                    productDetailData.data.discount_percentage > 0
                      ? productDetailData.data.final_price
                      : productDetailData.data.price,
                  )}
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={styles.paymentMethodContainer}>
          <Text style={styles.paymentMethodTitleText}>Metode Pembayaran</Text>
          {productDetailData?.data?.price_token > 0 && (
            <View>
              <TouchableOpacity
                disabled={isTokenInsufficient}
                onPress={() => {
                  setSelectedPaymentMethod(1);
                }}
                style={[
                  paymentMethodStyles.buttonContainer,
                  selectedPaymentMethod === 1 &&
                    paymentMethodStyles.selectedButtonContainer,
                  isTokenInsufficient &&
                    paymentMethodStyles.selectedButtonContainerInsufficient,
                ]}
              >
                <View
                  style={paymentMethodStyles.paymentMethodIconContainerToken}
                >
                  <FontAwesome
                    name="money"
                    size={14}
                    color={Colors.warning500}
                  />
                </View>

                <Text style={paymentMethodStyles.buttonText}>Token</Text>

                <View style={paymentMethodStyles.valueContainer}>
                  <FontAwesome
                    name="money"
                    size={14}
                    color={Colors.neutral500}
                  />
                  <Text style={paymentMethodStyles.priceItemValueText}>
                    {productDetailData.data.price_token}
                  </Text>
                </View>

                <Ionicons
                  name={
                    selectedPaymentMethod === 1
                      ? 'radio-button-on'
                      : 'radio-button-off'
                  }
                  size={18}
                  color={
                    isTokenInsufficient
                      ? Colors.error500
                      : selectedPaymentMethod === 1
                      ? Colors.product900
                      : Colors.neutral200
                  }
                />
              </TouchableOpacity>

              {isTokenInsufficient && (
                <Text style={paymentMethodStyles.insufficientText}>
                  Token tidak mencukupi
                </Text>
              )}
            </View>
          )}
          {productDetailData.data.price > 0 && (
            <View>
              <TouchableOpacity
                onPress={() => {
                  setSelectedPaymentMethod(2);
                }}
                style={[
                  paymentMethodStyles.buttonContainer,
                  selectedPaymentMethod === 2 &&
                    paymentMethodStyles.selectedButtonContainer,
                ]}
              >
                <View
                  style={paymentMethodStyles.paymentMethodIconContainerBank}
                >
                  <Octicons
                    name={'arrow-switch'}
                    size={14}
                    color={Colors.product900}
                  />
                </View>
                <Text style={paymentMethodStyles.buttonText}>
                  Bank Virtual Account
                </Text>
                <Ionicons
                  name={
                    selectedPaymentMethod === 2
                      ? 'radio-button-on'
                      : 'radio-button-off'
                  }
                  size={18}
                  color={
                    selectedPaymentMethod === 2
                      ? Colors.product900
                      : Colors.neutral200
                  }
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        {selectedPaymentMethod !== null && (
          <View style={detailTransactionStyles.detailTransactionContainer}>
            <Text style={detailTransactionStyles.detailTransactionTitle}>
              Detail Transaksi
            </Text>
            {selectedPaymentMethod === 1 ? (
              <>
                <View style={detailTransactionStyles.productNameContainerToken}>
                  <Text style={detailTransactionStyles.productNameText}>
                    Paket {productDetailData.data.product_name}
                  </Text>
                  <Text style={detailTransactionStyles.productPriceValue}>
                    {productDetailData.data.price_token} Token
                  </Text>
                </View>
                <View style={detailTransactionStyles.totalPriceContainer}>
                  <Text style={detailTransactionStyles.totalPriceTitleText}>
                    Total Harga
                  </Text>
                  <Text style={detailTransactionStyles.totalPriceValueText}>
                    {productDetailData.data.price_token} Token
                  </Text>
                </View>
              </>
            ) : (
              <>
                <View
                  style={[
                    detailTransactionStyles.productNameContainer,
                    { paddingTop: 10 },
                  ]}
                >
                  <Text style={detailTransactionStyles.productNameText}>
                    Paket {productDetailData.data.product_name}
                  </Text>
                  <Text style={detailTransactionStyles.productPriceValue}>
                    {rupiahFormat(productDetailData.data.price)}
                  </Text>
                </View>
                <View style={detailTransactionStyles.productNameContainer}>
                  <Text style={detailTransactionStyles.productNameText}>
                    Biaya Aplikasi
                  </Text>
                  <Text style={detailTransactionStyles.productPriceValue}>
                    {rupiahFormat(1000)}
                  </Text>
                </View>
                {productDetailData.data.discount_percentage > 0 && (
                  <View style={detailTransactionStyles.productNameContainer}>
                    <Text style={detailTransactionStyles.productNameText}>
                      Diskon Paket
                    </Text>
                    <Text
                      style={detailTransactionStyles.productPriceDiscountValue}
                    >
                      -
                      {rupiahFormat(
                        productDetailData.data.price -
                          productDetailData.data.final_price,
                      )}
                    </Text>
                  </View>
                )}
                <View style={[detailTransactionStyles.totalPriceContainer]}>
                  <Text style={detailTransactionStyles.totalPriceTitleText}>
                    Total Harga
                  </Text>
                  <Text style={detailTransactionStyles.totalPriceValueText}>
                    {rupiahFormat(
                      productDetailData.data.discount_percentage > 0
                        ? productDetailData.data.final_price + 1000
                        : productDetailData.data.price + 1000,
                    )}
                  </Text>
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>
      {selectedPaymentMethod !== null && (
        <View style={styles.bottomComponent}>
          <TouchableOpacity
            onPress={handlePurchaseProduct}
            disabled={loadingBuyProduct}
            style={styles.buyButton}
          >
            {loadingBuyProduct ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buyText}>Bayar</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      <ErrorModal
        visible={showErrorModal}
        description={errorMessage}
        onClose={() => {
          setShowErrorModal(false);
          setErrorMessage('');
        }}
      />
    </View>
  );
};

export default ProductDetailPurchasePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  titleIconCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  iconContainer: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 6,
  },
  categoryContainer: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 4,
  },
  categoryText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.product900,
  },
  productNameContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  productNameText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  packageItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  packageItemIconContainer: {
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    borderRadius: 6,
  },
  packageItemText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
  },
  priceContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  priceTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  priceItemContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  priceItemTitleText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
  },
  priceItemValueText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  discountContainer: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: Colors.danger200,
    backgroundColor: Colors.danger50,
    borderRadius: 4,
  },
  discountText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 10,
    lineHeight: 14,
    color: Colors.danger500,
  },
  paymentMethodContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
    padding: 16,
  },
  paymentMethodTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
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
  buyButton: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.product900,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buyText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
});

const paymentMethodStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    gap: 8,
  },
  selectedButtonContainer: {
    borderColor: Colors.product900,
  },
  selectedButtonContainerInsufficient: {
    borderColor: Colors.danger500,
  },
  paymentMethodIconContainerToken: {
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.warning200,
    backgroundColor: Colors.warning50,
    borderRadius: 6,
  },
  paymentMethodIconContainerBank: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 6,
  },
  buttonText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  priceItemValueText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  insufficientText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.danger500,
    marginTop: 2,
  },
});

const detailTransactionStyles = StyleSheet.create({
  detailTransactionContainer: {
    padding: 16,
  },
  detailTransactionTitle: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  productNameContainerToken: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productNameContainer: {
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productNameText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  productPriceValue: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  productPriceDiscountValue: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.danger500,
  },
  totalPriceContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  totalPriceTitleText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
  },
  totalPriceValueText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
});
