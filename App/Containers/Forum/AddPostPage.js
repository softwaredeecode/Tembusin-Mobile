import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TextInput,
  Text,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// components
import MainHeader from '../../Components/MainHeader';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

//helper
import { getInitial } from '../../Utils/Helper';

//redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../Redux/Actions';

const AddPostPage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { forumSpinner, errorModal } = useSelector(state => state.forum);

  const [userData, setUserData] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const handleAddPost = async () => {
    Keyboard.dismiss();
    const token = await AsyncStorage.getItem('auth_token');

    const payload = JSON.stringify({
      content: newPost,
    });

    const result = await dispatch(ActionStudent.AddPost(payload, token));

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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={[
            styles.container,
            {
              paddingBottom: isKeyboardVisible
                ? Platform.OS === 'android'
                  ? 35
                  : 0
                : Platform.OS === 'android'
                ? 0
                : 20,
            },
          ]}
        >
          <StatusBar
            translucent
            backgroundColor={Colors.white}
            barStyle="dark-content"
          />

          <MainHeader title={'Tulis postingan'} />

          <View style={styles.scrollContainer}>
            <View style={styles.row}>
              <View style={styles.profileInitialContainer}>
                <Text style={styles.initialText}>
                  {getInitial(userData?.username)}
                </Text>
              </View>

              <TextInput
                placeholder="Tulis postingan di sini..."
                style={styles.textInput}
                value={newPost}
                multiline
                onChangeText={setNewPost}
                placeholderTextColor={Colors.neutral400}
                maxLength={250}
              />
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <Text>{newPost.length}/250</Text>
            <TouchableOpacity
              disabled={newPost.length === 0}
              onPress={handleAddPost}
              style={styles.sendButtonContainer}
            >
              <Text style={styles.sendButtonText}>Kirim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddPostPage;

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
    paddingTop: 16,
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
