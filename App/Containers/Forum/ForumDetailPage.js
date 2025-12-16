import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import MainHeader from '../../Components/MainHeader';
import ForumDetailCardComponent from '../../Components/ForumDetailCardComponent';

import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../Redux/Actions';
import * as ActionTypes from '../../Redux/Constants/Types';

const LIMIT = 10;

const ForumDetailPage = props => {
  const forumDetailData = props.route.params.item;
  const dispatch = useDispatch();
  const { comments, forumSpinner } = useSelector(state => state.forum);

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const getCommentList = async (offset = 0) => {
    if (forumSpinner || isFetchingMore) return;

    setIsFetchingMore(true);

    const token = await AsyncStorage.getItem('auth_token');
    const payload = {
      limit: LIMIT,
      offset,
    };

    await dispatch(
      ActionStudent.GetComments(forumDetailData.id, payload, token),
    );

    setIsFetchingMore(false);
  };

  //   useEffect(() => {
  //     dispatch({ type: ActionTypes.RESET_COMMENTS_STATE });
  //     getCommentList(0);
  //   }, []);

  const handleLoadMore = () => {
    if (comments.length >= 32) {
      return;
    }

    getCommentList(comments.length);
  };

  useFocusEffect(
    useCallback(() => {
      dispatch({ type: ActionTypes.RESET_COMMENTS_STATE });
      getCommentList(0);
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
        title={'Baca postingan'}
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
      <View style={{flex: 1, backgroundColor: Colors.neutral50}}>
        <FlatList
          data={comments}
          keyExtractor={item => item.id.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1}
          contentContainerStyle={styles.scrollContainer}
          onMomentumScrollBegin={() => setIsFetchingMore(false)}
          ListHeaderComponent={
            <>
              <ForumDetailCardComponent
                forumDetailData={forumDetailData}
                showCommentButton={true}
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
          renderItem={({ item, index }) => {
            return (
              <View
                style={
                  index == 0
                    ? styles.itemContainerFirst
                    : index == comments.length - 1
                    ? styles.lastItemContainer
                    : styles.itemContainer
                }
              >
                <ForumDetailCardComponent forumDetailData={item} />
              </View>
            );
          }}
        />
      </View>
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
  commentsContainer: { paddingTop: 16, paddingHorizontal: 16 },
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
