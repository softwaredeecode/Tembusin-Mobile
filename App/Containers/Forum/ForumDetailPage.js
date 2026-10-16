import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  InteractionManager,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainHeader from '../../Components/MainHeader';
import ForumDetailCardComponent from '../../Components/ForumDetailCardComponent';
import ForumCommentCardComponent from '../../Components/ForumCommentCardComponent';

import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

import { useDispatch } from 'react-redux';
import { ActionStudent } from '../../Redux/Actions';
import * as ActionTypes from '../../Redux/Constants/Types';

const LIMIT = 10;

const ForumDetailPage = props => {
  const forumDetailData = props?.route?.params?.item;
  const dispatch = useDispatch();

  // ===== LOCAL UI STATE =====
  const [commentList, setCommentList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // ===== FETCH COMMENTS =====
  const getCommentList = async offset => {
    if (isFetchingMore || !hasMore) return;

    setIsFetchingMore(true);

    const token = await AsyncStorage.getItem('auth_token');

    const payload = {
      limit: LIMIT,
      offset,
    };

    const result = await dispatch(
      ActionStudent.GetComments(forumDetailData.id, payload, token),
    );

    const responseData = result?.data?.data || [];
    const meta = result?.data;

    setCommentList(prev =>
      offset === 0 ? responseData : [...prev, ...responseData],
    );

    // === STOP FETCH KALAU DATA HABIS ===
    if (responseData.length < LIMIT || meta?.page >= meta?.total_pages) {
      setHasMore(false);
    }

    setIsFetchingMore(false);
    setIsInitialLoad(false);
  };

  // ===== LOAD MORE =====
  const handleLoadMore = () => {
    if (isInitialLoad) return;
    if (isFetchingMore) return;
    if (!hasMore) return;

    getCommentList(commentList.length);
  };

  // ===== FIRST LOAD =====
  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        dispatch({ type: ActionTypes.RESET_COMMENTS_STATE });
        setCommentList([]);
        setHasMore(true);
        setIsInitialLoad(true);
        getCommentList(0);
      });

      return () => task.cancel();
    }, []),
  );

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />

      <MainHeader
        title="Baca postingan"
        rightComponent={
          <TouchableOpacity style={styles.shareButtonContainer}>
            <Ionicons
              name="share-outline"
              size={16}
              color={Colors.neutral500}
            />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={commentList}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.scrollContainer}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListHeaderComponent={
          <>
            <ForumDetailCardComponent
              forumDetailData={forumDetailData}
              showCommentButton
              props={props}
            />
            <View style={styles.commentsContainer}>
              <Text style={styles.commentsTitleText}>
                {forumDetailData.comment_count} komentar
              </Text>
            </View>
          </>
        }
        ListFooterComponent={
          isFetchingMore ? (
            <View style={{ padding: 16 }}>
              <ActivityIndicator size="small" color={Colors.neutral500} />
            </View>
          ) : null
        }
        renderItem={({ item, index }) => (
          <View
            style={
              index === 0
                ? styles.itemContainerFirst
                : index === commentList.length - 1
                ? styles.lastItemContainer
                : styles.itemContainer
            }
          >
            <ForumCommentCardComponent forumDetailData={item} />
          </View>
        )}
      />
    </View>
  );
};

export default ForumDetailPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  shareButtonContainer: { padding: 8 },
  scrollContainer: {
    borderTopColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    borderTopWidth: 1,
    paddingBottom: 50,
  },
  commentsContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  commentsTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
    paddingBottom: 12,
  },
  itemContainerFirst: {
    marginHorizontal: 16,
    backgroundColor: Colors.neutral50,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderLeftColor: Colors.neutral200,
    borderRightColor: Colors.neutral200,
    borderTopColor: Colors.neutral200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  itemContainer: {
    marginHorizontal: 16,
    backgroundColor: Colors.neutral50,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderLeftColor: Colors.neutral200,
    borderRightColor: Colors.neutral200,
  },
  lastItemContainer: {
    marginHorizontal: 16,
    backgroundColor: Colors.neutral50,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderLeftColor: Colors.neutral200,
    borderRightColor: Colors.neutral200,
    borderBottomColor: Colors.neutral200,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
});
