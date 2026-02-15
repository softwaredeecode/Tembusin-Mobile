import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

const ThankyouPageMaterial = props => {
  const navigation = useNavigation();
  const paymentData = props?.route?.params?.paymentData;
  const materialCollectionDetailDataPrev =
    props?.route?.params?.materialCollectionDetailDataPrev;

  const accessId =
    materialCollectionDetailDataPrev?.data?.access_type?.id ?? null;
  const canBuyWithToken = accessId === 1 || accessId === 3;

  console.log(paymentData, 'paymentData');
  console.log(
    materialCollectionDetailDataPrev,
    'materialCollectionDetailDataPrev',
  );
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.neutral50} barStyle={'dark-content'} />
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitleText}>
          Hore! Pembayaran kamu berhasil
        </Text>
        <View style={styles.successIconContainer}>
          <Ionicons name={'checkmark'} size={80} color={Colors.success500} />
        </View>
        <Text style={styles.descText}>
          Terima kasih! Pembayaran kamu telah berhasil diterima.
        </Text>
      </View>
      <View style={styles.detailTransactionContainer}>
        <Text style={styles.detailTransactionTitleText}>Detail transaksi</Text>
        <View style={[styles.row, styles.detailItemContainer]}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="book-open-blank-variant"
              size={16}
              color={Colors.product900}
            />
          </View>
          <View>
            <Text style={styles.detailItemTitleText}>Materi</Text>
            <Text style={styles.detailItemValueText}>
              {materialCollectionDetailDataPrev.data.material_collection_name}
            </Text>
          </View>
        </View>
        <View style={[styles.row, styles.detailItemContainer]}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="swap-horizontal"
              size={16}
              color={Colors.product900}
            />
          </View>
          <View>
            <Text style={styles.detailItemTitleText}>Metode pembayaran</Text>
            <Text
              style={[
                styles.detailItemValueText,
                { textTransform: 'capitalize' },
              ]}
            >
              {canBuyWithToken ? 'Token' : 'Free'}
            </Text>
          </View>
        </View>
        {canBuyWithToken && (
          <View style={[styles.row, styles.detailItemContainer]}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="receipt-outline"
                size={16}
                color={Colors.product900}
              />
            </View>
            <View>
              <Text style={styles.detailItemTitleText}>Total harga</Text>
              <Text
                style={[
                  styles.detailItemValueText,
                  { textTransform: 'capitalize' },
                ]}
              >
                {paymentData.price}
              </Text>
            </View>
          </View>
        )}
      </View>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => {
          navigation.replace('MaterialDetailPage', {
            materialCollectionId:
              materialCollectionDetailDataPrev.data.id,
          });
        }}
      >
        <Text style={styles.continueButtonText}>Lanjut</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ThankyouPageMaterial;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  headerTitleContainer: {
    marginTop: 40,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  headerTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 20,
    lineHeight: 24,
    color: Colors.neutral900,
    textAlign: 'center',
  },
  successIconContainer: {
    padding: 16,
    marginTop: 24,
    backgroundColor: Colors.success50,
    borderWidth: 1,
    borderColor: Colors.success200,
    borderRadius: 20,
  },
  descText: {
    marginTop: 24,
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
    textAlign: 'center',
  },
  detailTransactionContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.neutral200,
    borderRadius: 8,
  },
  detailTransactionTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.neutral500,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailItemContainer: {
    padding: 10,
    borderWidth: 1,
    marginTop: 10,
    borderColor: Colors.neutral200,
    borderRadius: 8,
  },
  iconContainer: {
    padding: 6,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: Colors.product50,
    borderColor: Colors.product200,
  },
  detailItemTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  detailItemValueText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  continueButton: {
    paddingVertical: 10,
    backgroundColor: Colors.product900,
    marginTop: 24,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.white,
  },
});
