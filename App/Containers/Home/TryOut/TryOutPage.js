import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  StatusBar,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// components
import MainHeader from '../../../Components/MainHeader';
import TryOutCardComponents from '../../../Components/TryOutCardComponent';
import ListEmptyComponent from '../../../Components/ListEmptyComponents';
import { BASE_URL } from '../../../Api/GlobalUrl';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../../Redux/Actions';

const TryOutPage = props => {
  const categoryId = props?.route?.params?.categoryId;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [userData, setUserData] = useState(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false);
  const [leaderboardList, setLeaderboardList] = useState(null);

  const { allTryOutData, comingSoonTryoutData, tryOutSpinner } = useSelector(
    state => state.tryout,
  );

  const fetchLeaderboard = async () => {
    const params = new URLSearchParams();
    const roleId = userData?.role?.id;

    console.log(userData, 'USERDATA');

    params.append('limit', 3);
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
    const getUserData = async () => {
      const storedData = await AsyncStorage.getItem('user_data');

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchLeaderboard();
    }
  }, [userData]);

  useFocusEffect(
    useCallback(() => {
      const initializeData = async () => {
        const token = await AsyncStorage.getItem('auth_token');

        Promise.all([
          dispatch(
            ActionStudent.GetAllTryOutData(token, {
              page: 1,
              limit: 3,
              category_id: categoryId,
            }),
          ),
          // dispatch(ActionStudent.GetComingSoonTryout(token)),
        ]);
      };
      initializeData();

      return () => {};
    }, [dispatch]),
  );

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

        {/* Duration */}
        <View style={[styles.scoreContainer, { marginLeft: 10 }]}>
          <Text style={styles.scoreText}>{item.total_duration_minutes}</Text>
          <Text style={styles.scoreLabel}>Menit</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />
      <MainHeader title={'Try Out'} />
      <ScrollView style={styles.bodyContainer}>
        {loadingLeaderboard ? (
          <View style={[styles.menuContainer, styles.loadingContainer]}>
            <ActivityIndicator size="small" color="#6366F1" />
          </View>
        ) : leaderboardList?.length > 0 ? (
          <View style={[styles.menuContainer, { marginTop: 16 }]}>
            <View style={styles.menuTitleTextContainer}>
              <Text style={styles.menuTitleText}>Leaderboard</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('LeaderboardTryoutPage');
                }}
              >
                <Text style={styles.otherButtonText}>Selengkapnya</Text>
              </TouchableOpacity>
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
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('MyTryOutPage', { categoryId: categoryId })
          }
          style={[styles.row, styles.myProductContainer]}
        >
          <MaterialCommunityIcons
            name={'file-document-edit-outline'}
            size={22}
            color={Colors.neutral900}
          />
          <Text style={styles.myProductText}>Try out saya</Text>
          <View style={styles.myProductQtyContainer}>
            <Text style={styles.myProductQtytext}>3</Text>
          </View>
          <Ionicons
            name={'chevron-forward'}
            size={16}
            color={Colors.neutral400}
          />
        </TouchableOpacity>

        <View style={[styles.row, styles.exploreAllProductTitleContainer]}>
          <Text style={styles.exploreAllProductTitleText}>
            Jelajahi semua try out!
          </Text>
          {allTryOutData.data.total_items > 3 && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AllTryOutPage', { categoryId: categoryId })
              }
              style={[styles.row, styles.exploreAllProductTitleButtonContainer]}
            >
              <Text style={styles.exploreAllProductTitleButtonText}>
                Lihat semua
              </Text>
              <Ionicons
                name={'chevron-forward'}
                size={14}
                color={Colors.product500}
              />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          data={allTryOutData?.data?.data || []}
          renderItem={({ item }) => {
            return <TryOutCardComponents item={item} />;
          }}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          gap={12}
          ListEmptyComponent={
            !tryOutSpinner ? (
              <ListEmptyComponent
                title={'Belum ada try out yang tersedia'}
                desc={
                  'Try out belum tersedia untuk saat ini. Silakan cek kembali di lain waktu.'
                }
                iconName={'book-open-blank-variant'}
              />
            ) : null
          }
        />
        {allTryOutData.data.total_items > 3 && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AllTryOutPage', { categoryId: categoryId })
            }
            style={styles.openAllMaterialContainer}
          >
            <Text style={styles.openAllMaterialText}>Lihat semua try out</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default TryOutPage;

const styles = StyleSheet.create({
  bodyContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    paddingHorizontal: 16,
  },
  lastOpenContainer: {
    backgroundColor: Colors.product900,
    borderRadius: 8,
    padding: 12,
  },
  titleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
  lastOpenedProductContainer: {
    marginTop: 14,
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 6,
  },
  lastOpenTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  lastOpenDescText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  row: {
    flexDirection: 'row',
  },
  iconContainer: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 6,
  },
  dateIconContainer: {
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    borderRadius: 6,
  },
  progressWrapper: {
    width: '85%',
    height: 6,
    backgroundColor: Colors.neutral200,
    borderRadius: 6,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  myProductContainer: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    marginTop: 10,
  },
  myProductText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
    marginLeft: 8,
    flex: 1,
  },
  myProductQtytext: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  myProductQtyContainer: {
    paddingVertical: 1,
    paddingHorizontal: 3,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 4,
    backgroundColor: Colors.neutral50,
  },
  exploreAllProductTitleContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingVertical: 10,
  },
  exploreAllProductTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  exploreAllProductTitleButtonContainer: {
    alignItems: 'center',
    gap: 2,
  },
  exploreAllProductTitleButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.product500,
  },
  openAllMaterialContainer: {
    marginBottom: 50,
    marginTop: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderRadius: 8,
  },
  openAllMaterialText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  tryoutCategoryContainer: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 4,
  },
  tryoutCategoryText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.product900,
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  otherButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.product900,
  },
});
