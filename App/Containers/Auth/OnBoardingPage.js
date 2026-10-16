import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// theme
import { Fonts } from '../../Theme/Fonts';
import { Colors } from '../../Theme/Colors';

const { width } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Raih prestasi, wujudkan mimpi!',
    description:
      'Bergabung dan tumbuh bersama komunitas belajar yang siap menembus setiap tantangan.',
    image: require('../../Assets/Images/onboardingOne.png'),
  },
  {
    key: '2',
    title: 'Siapkan dirimu untuk masa depan',
    description:
      'Temukan cara belajar efektif dan tingkatkan peluangmu menembus universitas favorit.',
    image: require('../../Assets/Images/onboardingTwo.png'),
  },
  {
    key: '3',
    title: 'Langkah pasti menuju ASN',
    description:
      'Tingkatkan kemampuanmu lewat latihan seru dan strategi jitu untuk wujudkan karier impian.',
    image: require('../../Assets/Images/onboardingThree.png'),
  },
];

const OnBoardingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const onViewRef = useRef(({ viewableItems }) => {
    setCurrentIndex(viewableItems[0].index);
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= slides.length) {
        nextIndex = 0;
      }
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.key}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
        style={{ flexGrow: 0 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />
            <View style={styles.dotsContainer}>
              {slides.map((_, i) => (
                <View
                  key={i.toString()}
                  style={[styles.dot, currentIndex === i && styles.activeDot]}
                />
              ))}
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('LoginPage')}
        >
          <Text style={styles.loginText}>Mulai Belajar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate('RegisterChooseAccountPage')}
        >
          <Text style={styles.registerText}>Daftar Sekarang</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnBoardingPage;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  slide: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  image: {
    width: 375,
    height: '65%',
    marginBottom: 40,
    paddingVertical: 12,
  },
  dotsContainer: { flexDirection: 'row', marginBottom: 24 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: Colors.neutral300,
    marginHorizontal: 8,
  },
  activeDot: { backgroundColor: Colors.neutral900 },
  title: {
    fontFamily: Fonts.Medium,
    fontSize: 32,
    marginBottom: 16,
    lineHeight: 40,
    color: Colors.neutral900,
  },
  description: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
  },
  buttonContainer: {
    marginTop: 40,
    paddingHorizontal: 16,
  },
  loginButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.product900,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  loginText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
  registerButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  registerText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
});
