import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-toast-message';

import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

import ErrorModal from '../../Components/ErrorModal';
import { rupiahFormat } from '../../Utils/Helper';
import { ActionStudent } from '../../Redux/Actions';

/* =======================
   PAYMENT STATUS CONSTANT
======================= */
const PAYMENT_STATUS = {
  LOADING: 'LOADING',
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

const ProductPaymentStatusPage = props => {
  const { navigation, route } = props;
  const paymentData = route?.params?.paymentData;

  const [statusPayment, setStatusPayment] = useState(
    PAYMENT_STATUS.LOADING,
  );
  const [loadingCheckStatus, setLoadingCheckStatus] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /* =======================
      COPY VA NUMBER
  ======================= */
  const handleCopy = async () => {
    await Clipboard.setString(paymentData.reference_no);
    Toast.show({
      type: 'success',
      text1: 'Copied!',
      text2: `"${paymentData.reference_no}" berhasil disalin.`,
      position: 'bottom',
      visibilityTime: 2000,
    });
  };

  /* =======================
      CHECK PAYMENT STATUS
  ======================= */
  const handleCheckStatus = async () => {
    setLoadingCheckStatus(true);
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const response = await ActionStudent.CheckStatus(
        token,
        paymentData.reference_no,
      );

      if (response.status === 200 && response.data?.status) {
        setStatusPayment(response.data.status);
      } else {
        setStatusPayment(PAYMENT_STATUS.FAILED);
      }
    } catch (error) {
      setStatusPayment(PAYMENT_STATUS.FAILED);
      setShowErrorModal(true);
      setErrorMessage('Terjadi kesalahan sistem');
    } finally {
      setLoadingCheckStatus(false);
    }
  };

  useEffect(() => {
    handleCheckStatus();
  }, []);

  /* =======================
      DETAIL TRANSACTION
  ======================= */
  const RenderDetailTransaction = () => (
    <View style={styles.detailTransactionContainer}>
      <Text style={styles.detailTransactionTitleText}>
        Detail transaksi
      </Text>

      <View style={[styles.row, styles.detailItemContainer]}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="crown-outline"
            size={16}
            color={Colors.product900}
          />
        </View>
        <View>
          <Text style={styles.detailItemTitleText}>Paket</Text>
          <Text style={styles.detailItemValueText}>
            {paymentData.product_name}
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
          <Text style={styles.detailItemTitleText}>
            Metode pembayaran
          </Text>
          <Text style={styles.detailItemValueText}>
            Bank BSI Virtual Account
          </Text>
        </View>
      </View>

      {statusPayment === PAYMENT_STATUS.PENDING && (
        <View style={[styles.row, styles.detailItemContainer]}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="wallet-outline"
              size={16}
              color={Colors.product900}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailItemTitleText}>
              Nomor Virtual Account
            </Text>
            <Text style={styles.detailItemValueText}>
              {paymentData.reference_no}
            </Text>
          </View>
          <TouchableOpacity onPress={handleCopy}>
            <Ionicons
              name="copy-outline"
              size={16}
              color={Colors.product900}
            />
          </TouchableOpacity>
        </View>
      )}

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
          <Text style={styles.detailItemValueText}>
            {rupiahFormat(paymentData.price)}
          </Text>
        </View>
      </View>
    </View>
  );

  /* =======================
      UI STATES
  ======================= */
  const RenderLoading = () => (
    <View style={styles.headerTitleContainer}>
      <Text style={styles.headerTitleText}>
        Memeriksa status pembayaran
      </Text>
      <View style={styles.pendingIconContainer}>
        <EvilIcons
          name="spinner"
          size={80}
          color={Colors.product900}
        />
      </View>
    </View>
  );

  const RenderPending = () => (
    <>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitleText}>
          Pembelian paket sedang diproses
        </Text>
        <View style={styles.pendingIconContainer}>
          <EvilIcons
            name="spinner"
            size={80}
            color={Colors.product900}
          />
        </View>
        <Text style={styles.descText}>
          Sistem sedang memeriksa pembayaran kamu.
        </Text>
      </View>
      <RenderDetailTransaction />
      <TouchableOpacity
        disabled={loadingCheckStatus}
        style={[
          styles.continueButton,
          loadingCheckStatus && { opacity: 0.6 },
        ]}
        onPress={handleCheckStatus}
      >
        <Text style={styles.continueButtonText}>
          {loadingCheckStatus ? 'Memeriksa...' : 'Cek status transaksi'}
        </Text>
      </TouchableOpacity>
    </>
  );

  const RenderSuccess = () => (
    <>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitleText}>
          Hore! Pembayaran berhasil 🎉
        </Text>
        <View style={styles.successIconContainer}>
          <Ionicons
            name="checkmark"
            size={80}
            color={Colors.success500}
          />
        </View>
        <Text style={styles.descText}>
          Terima kasih, pembayaran kamu telah diterima.
        </Text>
      </View>
      <RenderDetailTransaction />
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.continueButtonText}>Lanjut</Text>
      </TouchableOpacity>
    </>
  );

  const RenderFailed = () => (
    <>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitleText}>
          Pembayaran gagal
        </Text>
        <Text style={styles.descText}>
          Silakan coba ulangi atau hubungi customer support.
        </Text>
      </View>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleCheckStatus}
      >
        <Text style={styles.continueButtonText}>Coba lagi</Text>
      </TouchableOpacity>
    </>
  );

  /* =======================
      MAIN RENDER
  ======================= */
  const renderContent = () => {
    switch (statusPayment) {
      case PAYMENT_STATUS.LOADING:
        return <RenderLoading />;
      case PAYMENT_STATUS.PENDING:
        return <RenderPending />;
      case PAYMENT_STATUS.SUCCESS:
        return <RenderSuccess />;
      case PAYMENT_STATUS.FAILED:
        return <RenderFailed />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={Colors.neutral50}
        barStyle="dark-content"
      />
      {renderContent()}
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

export default ProductPaymentStatusPage;

/* =======================
        STYLES
======================= */
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
    color: Colors.neutral900,
    textAlign: 'center',
  },
  successIconContainer: {
    padding: 16,
    marginTop: 24,
    backgroundColor: Colors.success50,
    borderRadius: 20,
  },
  pendingIconContainer: {
    padding: 16,
    marginTop: 24,
    backgroundColor: Colors.product50,
    borderRadius: 20,
  },
  descText: {
    marginTop: 24,
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.neutral500,
    textAlign: 'center',
  },
  detailTransactionContainer: {
    marginTop: 24,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  detailTransactionTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
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
    color: Colors.neutral500,
  },
  detailItemValueText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.neutral900,
  },
  continueButton: {
    paddingVertical: 12,
    backgroundColor: Colors.product900,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.white,
  },
});
