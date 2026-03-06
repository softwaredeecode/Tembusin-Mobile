import { StyleSheet, Text, View, StatusBar, ScrollView } from 'react-native';
import React from 'react';

// Components
import MainHeader from '../../Components/MainHeader';

// Theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

// JSON
import termsData from '../../Data/TermsCondition.json';

const TermsCondition = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />

      <MainHeader title={'Syarat dan Ketentuan'} />

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.textBodyTitle}>
          Dengan menggunakan platform tembus.in, Anda dianggap telah membaca,
          memahami, dan menyetujui syarat dan ketentuan berikut:
        </Text>

        {termsData.termsCondition.map((item, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.title}>
              {index + 1}. {item.title}
            </Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TermsCondition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  body: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  textBodyTitle: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
    textAlign: 'justify',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.black,
    marginBottom: 10,
  },
  desc: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
    textAlign: 'justify',
  },
});
