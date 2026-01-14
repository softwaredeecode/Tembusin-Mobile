import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

//redux
import { useSelector } from 'react-redux';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

//helper
import { getInitial } from '../../Utils/Helper';

const { width } = Dimensions.get('window');

const HomePage = () => {
  const navigation = useNavigation();
  const slides = [
    {
      key: '1',
      image: require('../../Assets/Images/dummyHome.png'),
    },
    {
      key: '2',
      image: require('../../Assets/Images/dummyHome.png'),
    },
    {
      key: '3',
      image: require('../../Assets/Images/dummyHome.png'),
    },
  ];
  const menu = [
    {
      id: '1',
      menu_name: 'Materi',
      menu_icon: 'book-open-blank-variant',
      screen_name: 'MaterialPage',
    },
    {
      id: '2',
      menu_name: 'Latihan',
      menu_icon: 'file-document-edit-outline',
      screen_name: 'ExercisesPage',
    },
    {
      id: '3',
      menu_name: 'Try Out',
      menu_icon: 'clipboard-check-outline',
      screen_name: 'TryOutPage',
    },
    {
      id: '4',
      menu_name: 'Live Class',
      menu_icon: 'video-outline',
      screen_name: 'LiveClassPage',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userData, setUserData] = useState(null);

  const flatListRef = useRef(null);
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

  useEffect(() => {
    const getUserData = async () => {
      const storedData = await AsyncStorage.getItem('user_data');

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      }
    };

    getUserData();
  }, []);

  return (
    <ScrollView style={styles.container} bounces={false} overScrollMode="never">
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContainer}>
        <View style={styles.profileInitialContainer}>
          <Text style={styles.initialText}>
            {getInitial(userData?.full_name)}
          </Text>
        </View>
        <View style={styles.userDataContainer}>
          <View style={styles.row}>
            <Text style={styles.profileNameText}>{userData?.full_name}</Text>
            <View style={styles.iconNameContainer}>
              <MaterialCommunityIcons
                name="crown-outline"
                size={16}
                color={Colors.product700}
              />
            </View>
          </View>

          <Text style={styles.titlesText}>Juara</Text>
        </View>
        <TouchableOpacity>
          <Ionicons
            name={'notifications-outline'}
            size={20}
            color={Colors.white}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>
        <View style={styles.carouselContainer}>
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
                  resizeMode="cover"
                />
              </View>
            )}
          />
          <View style={styles.dotsContainer}>
            {slides.map((_, i) => (
              <View
                key={i.toString()}
                style={[styles.dot, currentIndex === i && styles.activeDot]}
              />
            ))}
          </View>
        </View>
        <View style={styles.menuContainer}>
          <View style={styles.menuTitleTextContainer}>
            <Text>Belajar UTBK SNBT</Text>
          </View>
          <FlatList
            data={menu}
            horizontal
            keyExtractor={item => item.id}
            contentContainerStyle={styles.menuListContainer}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate(item.screen_name)}
                style={styles.menuItem}
              >
                <View style={styles.menuItemContainer}>
                  <MaterialCommunityIcons
                    name={item.menu_icon}
                    size={24}
                    color={Colors.product900}
                  />
                </View>
                <Text style={styles.menuText}>{item.menu_name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={[styles.menuContainer, { marginTop: 16 }]}>
          <View style={styles.menuTitleTextContainer}>
            <Text>Belajar TKA</Text>
          </View>
          <FlatList
            data={menu}
            horizontal
            keyExtractor={item => item.id}
            contentContainerStyle={styles.menuListContainer}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate(item.screen_name)}
                style={styles.menuItem}
              >
                <View style={styles.menuItemContainer}>
                  <MaterialCommunityIcons
                    name={item.menu_icon}
                    size={24}
                    color={Colors.product900}
                  />
                </View>
                <Text style={styles.menuText}>{item.menu_name}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={[styles.menuContainer, { marginTop: 16 }]}>
          <View style={styles.menuTitleTextContainer}>
            <Text>Leaderboard</Text>
          </View>
          <View style={styles.leaderboardContainer}>
            <Image
              source={require('../../Assets/Images/dummyLeaderboard.png')}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  statusBarBackground: {
    height: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
    backgroundColor: Colors.product900,
  },
  headerContainer: {
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 16,
    paddingBottom: 175,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: Colors.product900,
  },
  profileInitialContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.yellow,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  initialText: {
    fontFamily: Fonts.Bold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.white,
  },
  userDataContainer: {
    flex: 1,
  },
  iconNameContainer: {
    padding: 1,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    marginLeft: 4,
  },
  profileNameText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.white,
  },
  titlesText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.product500,
  },
  bodyContainer: {
    marginTop: -157,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  carouselContainer: {
    alignItems: 'center',
  },
  slide: {
    borderRadius: 6,
    overflow: 'hidden',
  },
  image: {
    width: 375,
  },
  dotsContainer: { flexDirection: 'row', marginBottom: 24, marginTop: 12 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: Colors.neutral300,
    marginHorizontal: 8,
  },
  activeDot: { backgroundColor: Colors.neutral900 },
  menuContainer: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.white,
  },
  menuTitleTextContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  menuListContainer: {
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  menuItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: {
    marginTop: 4,
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
    width: 80,
    textAlign: 'center',
  },
  menuItemContainer: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 4,
  },
  leaderboardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
});

export default HomePage;
