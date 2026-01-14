import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  Dimensions,
  InteractionManager,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../Redux/Actions';
import * as ActionTypes from '../../Redux/Constants/Types';

// theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

// components
import AuthenticatedHeader from '../../Components/AuthenticatedHeader';
import ForumCardComponent from '../../Components/ForumCardComponent';
import ListEmptyComponent from '../../Components/ListEmptyComponents';

const ForumPage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { latestForumData, trendingForumData, forumSpinner } = useSelector(
    state => state.forum,
  );

  const [activeTab, setActiveTab] = useState('terbaru');
  const [tabWidth, setTabWidth] = useState(0);

  const [refreshingLatest, setRefreshingLatest] = useState(false);
  const [refreshingTrending, setRefreshingTrending] = useState(false);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const hasFetched = useRef(false);

  /* ===================== FETCH INITIAL (SEKALI SAJA) ===================== */
  const fetchInitialData = async () => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const token = await AsyncStorage.getItem('auth_token');

    await Promise.all([
      dispatch(
        ActionStudent.GetLatestForumData({ limit: 20, offset: 0 }, token),
      ),
      dispatch(
        ActionStudent.GetTrendingForumData({ limit: 20, offset: 0 }, token),
      ),
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        fetchInitialData();
        dispatch({ type: ActionTypes.RESET_COMMENTS_STATE });
      });
      return () => task.cancel();
    }, []),
  );

  /* ===================== TAB ANIMATION ===================== */
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: activeTab === 'terbaru' ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });

  /* ===================== PULL TO REFRESH ===================== */
  const onRefreshLatest = async () => {
    setRefreshingLatest(true);
    const token = await AsyncStorage.getItem('auth_token');

    await dispatch(
      ActionStudent.GetLatestForumData({ limit: 20, offset: 0 }, token),
    );

    setRefreshingLatest(false);
  };

  const onRefreshTrending = async () => {
    setRefreshingTrending(true);
    const token = await AsyncStorage.getItem('auth_token');

    await dispatch(
      ActionStudent.GetTrendingForumData({ limit: 20, offset: 0 }, token),
    );

    setRefreshingTrending(false);
  };

  /* ===================== LIST COMPONENTS ===================== */
  const renderForumItem = useCallback(
    ({ item }) => <ForumCardComponent item={item} navigation={navigation} />,
    [],
  );

  /* ===================== UI ===================== */
  return (
    <View style={styles.container}>
      <AuthenticatedHeader title="Forum" includeSearch />

      {/* TAB SWITCH */}
      <View style={styles.switchContainer}>
        <View
          style={styles.switchChildContainer}
          onLayout={e => {
            const total = e.nativeEvent.layout.width;
            setTabWidth(total / 2);
          }}
        >
          <Animated.View
            style={[
              styles.indicator,
              { width: tabWidth - 8, transform: [{ translateX }] },
            ]}
          />

          <TouchableOpacity
            style={styles.widthFlex}
            onPress={() => setActiveTab('terbaru')}
          >
            <Text
              style={
                activeTab === 'terbaru'
                  ? styles.activeSwitchText
                  : styles.inActiveSwitchText
              }
            >
              Terbaru
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.widthFlex}
            onPress={() => setActiveTab('trending')}
          >
            <Text
              style={
                activeTab === 'trending'
                  ? styles.activeSwitchText
                  : styles.inActiveSwitchText
              }
            >
              Trending
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1 }}>
        {activeTab === 'terbaru' ? (
          <FlatList
            data={latestForumData?.data?.data || []}
            renderItem={renderForumItem}
            keyExtractor={item => item.id.toString()}
            refreshing={refreshingLatest}
            onRefresh={onRefreshLatest}
            contentContainerStyle={styles.forumContainer}
            removeClippedSubviews
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            ListEmptyComponent={
              !forumSpinner ? (
                <ListEmptyComponent
                  title={'Belum ada postingan yang tersedia'}
                  desc={
                    'Postingan belum tersedia untuk saat ini. Silakan cek kembali di lain waktu'
                  }
                  iconName={'message'}
                />
              ) : null
            }
            updateCellsBatchingPeriod={50}
          />
        ) : (
          <FlatList
            data={trendingForumData?.data?.data || []}
            renderItem={renderForumItem}
            keyExtractor={item => item.id.toString()}
            refreshing={refreshingTrending}
            onRefresh={onRefreshTrending}
            contentContainerStyle={styles.forumContainer}
            removeClippedSubviews
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            ListEmptyComponent={
              !forumSpinner ? (
                <ListEmptyComponent
                  title={'Belum ada postingan yang tersedia'}
                  desc={
                    'Postingan belum tersedia untuk saat ini. Silakan cek kembali di lain waktu'
                  }
                  iconName={'message'}
                />
              ) : null
            }
            updateCellsBatchingPeriod={50}
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddPostPage')}
        style={styles.fab}
      >
        <Ionicons name="add" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

/* ===================== STYLES ===================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  switchContainer: {
    backgroundColor: Colors.product900,
    paddingTop: 6,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  switchChildContainer: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: Colors.product950,
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    left: 4,
    top: 4,
    bottom: 4,
    backgroundColor: Colors.white,
    borderRadius: 4,
  },
  widthFlex: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  inActiveSwitchText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.product500,
  },
  activeSwitchText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    color: Colors.neutral900,
  },
  forumContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 12,
    backgroundColor: Colors.warning500,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default ForumPage;
