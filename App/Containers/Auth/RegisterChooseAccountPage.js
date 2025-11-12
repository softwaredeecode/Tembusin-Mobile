import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

//components
import Header from '../../Components/Header';
import Stepper from '../../Components/Stepper';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

const RegisterChooseAccountPage = () => {
  const navigation = useNavigation();
  const [selectedAccount, setSelectedAccount] = useState(null);

  return (
    <View style={styles.container}>
      <Header headerText={'Setup profil'} />
      <Stepper total={3} current={1} />
      <View style={styles.chooseAccountContainer}>
        <Text style={styles.titleText}>Tentukan jalur suksesmu, Juara!</Text>
        <TouchableOpacity
          style={[
            styles.accountTypeContainer,
            selectedAccount === 'ptn' && styles.selectedAccountType,
          ]}
          onPress={() => setSelectedAccount('ptn')}
        >
          <View style={styles.row}>
            <View
              style={[
                styles.iconContainer,
                selectedAccount === 'ptn' && styles.selectedIconContainer,
              ]}
            >
              <FontAwesome
                color={
                  selectedAccount === 'ptn'
                    ? Colors.product900
                    : Colors.neutral500
                }
                name="graduation-cap"
                size={18}
                style={styles.icon}
              />
            </View>
            <View
              style={[
                styles.radioButton,
                selectedAccount === 'ptn' && styles.selectedRadioButton,
              ]}
            ></View>
          </View>
          <Text style={styles.catalogTitle}>Masuk PTN Impianmu</Text>
          <Text style={styles.catalogDesc}>
            Latihan dan materi lengkap untuk persiapan UTBK – SNBT & TKA.
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.accountTypeContainer,
            styles.catalogGap,
            selectedAccount === 'cpns' && styles.selectedAccountType,
          ]}
          onPress={() => setSelectedAccount('cpns')}
        >
          <View style={styles.row}>
            <View
              style={[
                styles.iconContainer,
                selectedAccount === 'cpns' && styles.selectedIconContainer,
              ]}
            >
              <FontAwesome
                color={
                  selectedAccount === 'cpns'
                    ? Colors.product900
                    : Colors.neutral500
                }
                name="graduation-cap"
                size={18}
                style={styles.icon}
              />
            </View>
            <View
              style={[
                styles.radioButton,
                selectedAccount === 'cpns' && styles.selectedRadioButton,
              ]}
            ></View>
          </View>
          <Text style={styles.catalogTitle}>Siap jadi ASN Hebat</Text>
          <Text style={styles.catalogDesc}>
            Belajar dan latihan soal seleksi CPNS & PPPK dengan simulasi CAT.
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('RegisterAccountPage', { selectedAccount })
          }
          disabled={selectedAccount == null}
          style={styles.continueButton}
        >
          <Text style={styles.continueText}>Lanjut</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterChooseAccountPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  chooseAccountContainer: {
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  titleText: {
    fontFamily: Fonts.Medium,
    fontSize: 16,
    lineHeight: 20,
    color: Colors.neutral900,
    marginBottom: 24,
  },
  accountTypeContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 6,
  },
  selectedAccountType: {
    borderColor: Colors.product900,
  },
  catalogGap: {
    marginTop: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconContainer: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 6,
    backgroundColor: Colors.neutral50,
    width: 40,
    height: 40,
  },
  selectedIconContainer: {
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
  },
  icon: {
    marginTop: 2,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    borderRadius: 8,
  },
  selectedRadioButton: {
    borderWidth: 4,
    borderColor: Colors.product900,
    backgroundColor: Colors.white,
  },
  catalogTitle: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
    marginTop: 12,
    marginBottom: 6,
  },
  catalogDesc: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  buttonContainer: {
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  continueButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.product900,
    borderRadius: 6,
    height: 40,
    alignItems: 'center',
    marginTop: 28,
  },
  continueText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.white,
  },
});
