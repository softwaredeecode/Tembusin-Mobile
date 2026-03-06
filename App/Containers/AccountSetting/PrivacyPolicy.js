import { StyleSheet, Text, View, StatusBar, ScrollView } from 'react-native';
import React from 'react';

// Components
import MainHeader from '../../Components/MainHeader';

// Theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

// JSON
import privacyData from '../../Data/PrivacyPolicy.json';

const PrivacyPolicy = () => {
  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor={Colors.white} barStyle="dark-content" />

      <MainHeader title={'Kebijakan Privasi'} />

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <Text style={styles.textBodyTitle}>
          Kami di tembus.in berkomitmen untuk menjaga keamanan dan kerahasiaan
          data pribadi Anda. Kebijakan privasi ini menjelaskan secara ringkas
          bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi
          Anda saat menggunakan layanan kami.
        </Text>

        {privacyData.privacyPolicy.map((item, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.title}>{index + 1}. {item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>

            {item.points &&
              item.points.map((point, i) => (
                <Text key={i} style={styles.point}>
                  • {point}
                </Text>
              ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

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
  point: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
    marginLeft: 8,
  },
});
