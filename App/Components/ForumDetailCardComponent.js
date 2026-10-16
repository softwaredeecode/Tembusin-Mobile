import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

//theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';
import { BASE_URL } from '../Api/GlobalUrl';

//helper
import { getInitial, formatDate } from '../Utils/Helper';

const ForumDetailCardComponent = ({
  forumDetailData,
  showCommentButton = false,
  props,
  hideLike = false,
}) => {
  const navigation = useNavigation();

  console.log(props);
  const [isLiked, setIsLiked] = useState(
    props?.route?.params?.liked ?? forumDetailData.liked,
  );
  const [likes, setLikes] = useState(
    props?.route?.params?.likeCount ?? forumDetailData.like_count,
  );

  const likedPost = async () => {
    const url = `${BASE_URL}/posts/${forumDetailData.id}/like`;
    const token = await AsyncStorage.getItem('auth_token');

    try {
      console.log('📡 [LIKED POST] Request URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();

      console.log('📦 [LIKED POST] Response:', json);

      if (response.ok) {
      }
    } catch (error) {
      console.log('❌ [LIKED POST] Error:', error);
      throw error;
    }
  };

  const unlikedPost = async () => {
    const url = `${BASE_URL}/posts/${forumDetailData.id}/like`;
    const token = await AsyncStorage.getItem('auth_token');

    try {
      console.log('📡 [UNLIKE POST] Request URL:', url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();

      console.log('📦 [UNLIKE POST] Response:', json);

      if (response.ok) {
        // update UI jika perlu
      }
    } catch (error) {
      console.log('❌ [UNLIKE POST] Error:', error);
      throw error;
    }
  };

  const handleLike = async () => {
    if (isLiked) {
      const newCount = likes - 1;
      setIsLiked(false);
      setLikes(newCount);

      props?.route?.params?.onLikeUpdate?.(false, newCount);
      await unlikedPost();
    } else {
      const newCount = likes + 1;
      setIsLiked(true);
      setLikes(newCount);

      props?.route?.params?.onLikeUpdate?.(true, newCount);
      await likedPost();
    }
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.profileInitialContainer}>
          <Text style={styles.initialText}>
            {getInitial(forumDetailData?.user?.full_name)}
          </Text>
        </View>
        <View style={styles.userPostData}>
          <View style={styles.row}>
            <Text style={styles.postedUsernameText}>
              {forumDetailData?.user?.full_name}
            </Text>
            {/* {forumDetailData?.status !== 'customer' && (
              <View style={styles.iconNameContainer}>
                {forumDetailData?.status === 'member' && (
                  <MaterialCommunityIcons
                    name="crown-outline"
                    size={16}
                    color={Colors.product700}
                  />
                )}
                {forumDetailData?.status === 'tutor' && (
                  <Text style={styles.tutorText}>Tutor</Text>
                )}
              </View>
            )} */}
          </View>
          <Text style={styles.postedDateText}>
            {formatDate(forumDetailData?.updated_at)}
          </Text>
        </View>
      </View>
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>{forumDetailData?.content}</Text>
      </View>
      <View style={styles.postStatusContainer}>
        {!hideLike ? (
          <>
            <TouchableOpacity onPress={handleLike} style={[styles.row]}>
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={16}
                color={isLiked ? Colors.danger500 : Colors.neutral500}
              />

              <Text style={styles.statusCountText}>{likes}</Text>
            </TouchableOpacity>
            <View style={[styles.row, { marginLeft: 20, flex: 1 }]}>
              <Ionicons
                name={'eye-outline'}
                size={16}
                color={Colors.neutral500}
              />
              <Text style={styles.statusCountText}>
                {forumDetailData?.view_count}
              </Text>
            </View>
          </>
        ) : null}

        {showCommentButton && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddCommentPage', { forumDetailData })
            }
            style={[styles.row, { gap: 6 }]}
          >
            <Ionicons
              name={'chatbubble-ellipses-outline'}
              size={16}
              color={Colors.product900}
            />
            <Text style={styles.commentText}>Komentar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ForumDetailCardComponent;

const styles = StyleSheet.create({
  postContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInitialContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.yellow,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  initialText: {
    fontFamily: Fonts.Bold,
    fontSize: 16,
    lineHeight: 18,
    color: Colors.white,
  },
  userPostData: {
    flex: 1,
  },
  postedUsernameText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postedDateText: {
    marginTop: 2,
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  messageContainer: {
    marginTop: 12,
  },
  messageText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  statusCountText: {
    marginLeft: 2,
    fontFamily: Fonts.Regular,
    fontSize: 12,
    color: Colors.neutral500,
    lineHeight: 18,
  },
  postStatusContainer: {
    paddingTop: 12,
    paddingRight: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    color: Colors.product900,
    lineHeight: 18,
  },
});
