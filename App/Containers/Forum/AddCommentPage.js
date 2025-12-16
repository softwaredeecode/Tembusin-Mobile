import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// components
import MainHeader from '../../Components/MainHeader';
import ForumDetailCardComponent from '../../Components/ForumDetailCardComponent';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

//helper
import { getInitial } from '../../Utils/Helper';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../Redux/Actions';

const AddCommentPage = props => {
  const forumDetailData = props.route.params.forumDetailData;
  const dispatch = useDispatch();
  const { forumSpinner, addComment, errorModal } = useSelector(
    state => state.forum,
  );
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [comment, setComment] = useState('');
  const [parentCommentId, setParentCommentId] = useState(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const handleAddComment = async () => {
    const token = await AsyncStorage.getItem('auth_token');

    const payload = JSON.stringify({
      content: comment,
      post_id: forumDetailData.id,
      ...(parentCommentId !== null && { parent_comment_id: parentCommentId }),
    });

    const result = await dispatch(ActionStudent.AddComments(payload, token));

    console.log('RESPONSE ADD COMMENT:', result);

    if (result?.status === 201) {
      navigation.goBack();
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
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true),
    );

    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false),
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      {forumSpinner && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.white} />
        </View>
      )}
      <View
        style={[
          styles.container,
          { paddingBottom: isKeyboardVisible ? 0 : 20 },
        ]}
      >
        <MainHeader title={'Tulis komentar'} />
        <ScrollView style={styles.scrollContainer}>
          <ForumDetailCardComponent forumDetailData={forumDetailData} />
          <View style={styles.commentsContainer}>
            <Text style={styles.commentsTitleText}>
              Komentar ke{' '}
              <Text style={styles.nameText}>
                {forumDetailData.user.username}
              </Text>
            </Text>
          </View>
          <View style={styles.row}>
            <View style={styles.profileInitialContainer}>
              <Text style={styles.initialText}>
                {getInitial(userData?.username)}
              </Text>
            </View>
            <TextInput
              placeholder={'Tulis komentar di sini...'}
              style={[styles.textInput]}
              value={comment}
              multiline
              onChangeText={text => setComment(text)}
              placeholderTextColor={Colors.neutral400}
              maxLength={250}
            />
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <Text>{comment.length}/250</Text>
          <TouchableOpacity
            disabled={comment.length == 0}
            onPress={handleAddComment}
            style={styles.sendButtonContainer}
          >
            <Text style={styles.sendButtonText}>Kirim</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddCommentPage;

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContainer: {
    borderTopColor: Colors.neutral200,
    borderTopWidth: 1,
    paddingBottom: 50,
    flex: 1,
  },
  commentsContainer: { paddingTop: 12, paddingHorizontal: 16 },
  commentsTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
    paddingBottom: 10,
  },
  nameText: {
    color: Colors.product900,
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
    marginTop: 4,
  },
  initialText: {
    fontFamily: Fonts.Bold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.white,
  },
  row: {
    flexDirection: 'row',
    gap: 14,
    paddingHorizontal: 16,
    alignItems: 'flex-start',
  },
  textInput: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
    flex: 1,
    textAlignVertical: 'top',
  },
  bottomContainer: {
    paddingBottom: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sendButtonContainer: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.product900,
    borderRadius: 8,
  },
  sendButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
});
