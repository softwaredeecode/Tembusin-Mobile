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
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

//redux
import { useSelector } from 'react-redux';
import { BASE_URL } from '../../Api/GlobalUrl';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

//helper
import { getInitial } from '../../Utils/Helper';
import { showComingSoonToast } from '../../Components/ComingSoonToast';

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

  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [leaderboardList, setLeaderboardList] = useState(null);

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

  //HANDLE LEADERBOARDS
  const fetchLeaderboard = async () => {
    const params = new URLSearchParams();
    const roleId = userData?.role?.id;

    console.log(userData, 'USERDATA');

    params.append('limit', 5);
    params.append('offset', 0);
    if (roleId !== null) params.append('role_id', roleId);

    const url = `${BASE_URL}/student/tryouts/leaderboard?${params.toString()}`;

    try {
      setLoadingLeaderboard(true);
      const token = await AsyncStorage.getItem('auth_token');
      console.log('📡 [FETCH LEADERBOARD] Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(
        '📥 [FETCH LEADERBOARD] HTTP Status:',
        response.status,
        response.statusText,
      );

      const json = await response.json();
      console.log('📦 [FETCH LEADERBOARD] Response:', json);

      if (response.ok) {
        setLeaderboardList(json.data);
      } else {
        throw json;
      }
    } catch (error) {
      console.log('❌ [FETCH LEADERBOARD] Error:', error);
      setLeaderboardList([]);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchLeaderboard();
    }
  }, [userData]);

  const renderLeaderboardItem = ({ item, index }) => {
    const isTopThree = item.rank <= 3;

    return (
      <View style={[styles.leaderboardItem, isTopThree && styles.topThreeItem]}>
        {/* Rank */}
        <View style={styles.rankContainer}>
          <Text style={[styles.rankText, isTopThree && styles.topRankText]}>
            #{item.rank}
          </Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.full_name?.charAt(0).toUpperCase()}
          </Text>
        </View>

        {/* Info */}
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {item.full_name}
          </Text>
          <Text style={styles.userRole}>{item.role_name}</Text>
        </View>

        {/* Score */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{item.total_score}</Text>
          <Text style={styles.scoreLabel}>Score</Text>
        </View>
      </View>
    );
  };

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

          <Text style={styles.titlesText}>{userData?.role?.role_name}</Text>
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
        <View style={[styles.menuContainer, { marginTop: 16 }]}>
          <View style={styles.menuTitleTextContainer}>
            <Text style={styles.menuTitleText}>
              {userData?.role?.id === 4 ? 'Belajar CPNS' : 'Belajar UTBK SNBT'}
            </Text>
          </View>
          <FlatList
            data={menu}
            horizontal
            keyExtractor={item => item.id}
            contentContainerStyle={styles.menuListContainer}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  if (item.id === '4') {
                    showComingSoonToast();
                  } else {
                    navigation.navigate(item.screen_name, {
                      categoryId: userData?.role?.id === 4 ? 3 : 1,
                    });
                  }
                }}
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
            <Text style={styles.menuTitleText}>
              {userData?.role?.id === 4 ? 'Belajar PPPK' : 'Belajar TKA'}
            </Text>
          </View>
          <FlatList
            data={menu}
            horizontal
            keyExtractor={item => item.id}
            contentContainerStyle={styles.menuListContainer}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  console.log(item.id);
                  if (item.id === '4') {
                    showComingSoonToast();
                  } else {
                    navigation.navigate(item.screen_name, {
                      categoryId: userData?.role?.id === 4 ? 4 : 2,
                    });
                  }
                }}
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
        {loadingLeaderboard ? (
          <View style={[styles.menuContainer, styles.loadingContainer]}>
            <ActivityIndicator size="small" color="#6366F1" />
          </View>
        ) : leaderboardList?.length > 0 ? (
          <View style={[styles.menuContainer, { marginTop: 16 }]}>
            <View style={styles.menuTitleTextContainer}>
              <Text style={styles.menuTitleText}>Leaderboard</Text>
            </View>

            <FlatList
              data={leaderboardList}
              scrollEnabled={false}
              keyExtractor={item => item.user_id.toString()}
              renderItem={renderLeaderboardItem}
              contentContainerStyle={{ paddingVertical: 8 }}
              showsVerticalScrollIndicator={false}
            />
          </View>
        ) : null}
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
  menuTitleText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.Medium,
    color: Colors.neutral900,
  },

  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#F9FAFB',
    marginBottom: 10,
    marginHorizontal: 10,
  },

  topThreeItem: {
    backgroundColor: '#EEF2FF',
  },

  rankContainer: {
    width: 40,
    alignItems: 'center',
  },

  rankText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },

  topRankText: {
    color: '#4338CA',
    fontWeight: '800',
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },

  userInfo: {
    flex: 1,
  },

  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },

  userRole: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  scoreContainer: {
    alignItems: 'flex-end',
  },

  loadingContainer: {
    marginTop: 16,
    paddingVertical: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scoreText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#10B981',
  },

  scoreLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
});

export default HomePage;
