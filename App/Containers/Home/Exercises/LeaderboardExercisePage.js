import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

// components
import MainHeader from '../../../Components/MainHeader';
import SearchBar from '../../../Components/SearchBar';
import FilterButton from '../../../Components/FilterButton';
import { BASE_URL } from '../../../Api/GlobalUrl';
import ListEmptyComponent from '../../../Components/ListEmptyComponents';
import BottomModal from '../../../Components/BottomModal';
import CheckboxRow from '../../../Components/CheckboxRow';

const LeaderboardExercisePage = props => {
  const [searchLeaderboard, setSearchLeaderboard] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [leaderboardList, setLeaderboardList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [sortBy, setSortBy] = useState('');

  const openFilter = () => setFilterVisible(true);

  //HANDLE LEADERBOARDS
  const fetchLeaderboard = async (pageParam = page, isLoadMore = false) => {
    const params = new URLSearchParams();
    const roleId = userData?.role?.id;

    params.append('limit', 10);
    params.append('offset', pageParam);
    params.append('search', searchLeaderboard);
    params.append('sort_by', sortBy);
    if (roleId !== null) params.append('role_id', roleId);

    const url = `${BASE_URL}/student/practice-sets/leaderboard?${params.toString()}`;

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
        setLeaderboardList(prev =>
          isLoadMore ? [...prev, ...json.data] : json.data,
        );
        setTotalPage(json.total_pages - 1);
      } else {
        throw json;
      }
    } catch (error) {
      console.log('❌ [FETCH LEADERBOARD] Error:', error);
      if (!isLoadMore) setLeaderboardList([]);
    } finally {
      setLoadingLeaderboard(false);
    }
  };

  const loadMoreData = () => {
    if (isLoadingMore) return;
    if (page >= totalPage) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchLeaderboard(nextPage, true);
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
    if (!userData) return;

    const debounce = setTimeout(() => {
      setPage(0);
      fetchLeaderboard(0, false);
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchLeaderboard, userData, sortBy]);

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

        {/* Attempt */}
        <View style={[styles.scoreContainer, { marginLeft: 10 }]}>
          <Text style={styles.scoreText}>{item.total_practice_sets}</Text>
          <Text style={styles.scoreLabel}>Attempt</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <StatusBar
            translucent
            backgroundColor={Colors.white}
            barStyle="dark-content"
          />

          <MainHeader
            rightComponent={
              <View style={styles.searchBarContainer}>
                <SearchBar
                  value={searchLeaderboard}
                  setValue={setSearchLeaderboard}
                  placeholder={'Cari di leaderboard latihan...'}
                />
                <FilterButton onPress={openFilter} />
              </View>
            }
          />
          <FlatList
            data={leaderboardList}
            scrollEnabled={false}
            keyExtractor={item => item.user_id.toString()}
            renderItem={renderLeaderboardItem}
            contentContainerStyle={{ paddingVertical: 8 }}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isLoadingMore || loadingLeaderboard ? (
                <View style={{ paddingVertical: 16 }}>
                  <ActivityIndicator size="small" color={Colors.product900} />
                </View>
              ) : null
            }
            ListEmptyComponent={
              !loadingLeaderboard && !isLoadingMore ? (
                <ListEmptyComponent
                  title={'Belum ada leaderboard yang tersedia'}
                  desc={'Mulai eksplorasi dan akses latihan soal-mu'}
                  iconName={'book-open-blank-variant'}
                />
              ) : null
            }
          />
        </View>
      </TouchableWithoutFeedback>
      <BottomModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        title="Sort by"
      >
        <View style={styles.filterTypeContainer}>
          <Text style={styles.filterChildTitleText}>Urutkan berdasarkan</Text>
          <TouchableOpacity
            style={styles.buttonFilter}
            onPress={() => {
              setSortBy('score');
              setFilterVisible(false);
            }}
          >
            <Text>Nilai</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonFilter}
            onPress={() => {
              setSortBy('duration');
              setFilterVisible(false);
            }}
          >
            <Text>Durasi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonFilter}
            onPress={() => {
              setSortBy('attempts');
              setFilterVisible(false);
            }}
          >
            <Text>Attempt</Text>
          </TouchableOpacity>
        </View>
      </BottomModal>
    </View>
  );
};

export default LeaderboardExercisePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchBarContainer: {
    paddingVertical: 10,
    // paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    alignItems: 'center',
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
  filterChildTitleText: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: Fonts.Medium,
    color: Colors.neutral400,
    paddingVertical: 4,
  },
  filterTypeContainer: {
    paddingBottom: 8,
  },
  buttonFilter: {
    paddingTop: 8,
    paddingLeft: 8,
  },
});
