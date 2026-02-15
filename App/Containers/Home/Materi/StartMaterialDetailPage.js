import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import React, { useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';

// components
import MainHeader from '../../../Components/MainHeader';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../../Redux/Actions';

const StartMaterialDetailPage = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const materialId = props?.route?.params?.materialId;
  const materialCollectionDetailData =
    props?.route?.params?.materialCollectionDetailData;
  const { materialDetailData, materialSpinner } = useSelector(
    state => state.material,
  );
  const materialList = props?.route?.params?.materialList || [];
  const [currentIndex, setCurrentIndex] = React.useState(
    props?.route?.params?.currentIndex ?? 0,
  );
  const currentMaterial = useMemo(() => {
    return materialList[currentIndex];
  }, [currentIndex, materialList]);
  const [showVideo, setShowVideo] = React.useState(false);
  const videoRef = React.useRef(null);

  const getYoutubeId = url => {
    console.log(url, 'YOUTUBE URL');
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  console.log(materialDetailData, 'materialDetailData');

  const getYoutubeThumbnail = url => {
    console.log(url, 'INI URL');
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;

    if (!videoId) return null;

    console.log(videoId, 'VIDEOID');

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  const playVideo = url => {
    if (Platform.OS === 'ios') {
      Linking.openURL(url);
    } else {
      setShowVideo(true);
    }
  };

  useEffect(() => {
    const fetchMaterial = async () => {
      const token = await AsyncStorage.getItem('auth_token');
      dispatch(ActionStudent.GetMaterialDetailData(token, currentMaterial.id));
    };

    if (currentMaterial?.id) {
      fetchMaterial();
    }
  }, [currentIndex]);

  if (!materialDetailData?.data) {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor={Colors.white} />
        <MainHeader />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />
      <MainHeader
        rightComponent={
          <View style={[styles.row, { gap: 6 }]}>
            <AnimatedCircularProgress
              size={24}
              width={4}
              fill={
                materialCollectionDetailData.data.statistics.progress_percentage
              }
              tintColor={Colors.warning500}
              backgroundColor={Colors.neutral200}
              rotation={180}
              lineCap="round"
            ></AnimatedCircularProgress>
            <Text style={styles.progressText}>
              {materialCollectionDetailData.data.statistics.progress_percentage}
              %
            </Text>
          </View>
        }
      />
      {materialDetailData?.data && (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.contentChildContainer}>
            <Text style={styles.materialNameText}>
              {materialDetailData.data.material_name}
            </Text>
            <Text style={styles.materialContentText}>
              {materialDetailData.data.content}
            </Text>
          </View>
          {materialDetailData.data.explanation_url && (
            <View style={styles.contentChildContainer}>
              <Text style={styles.materialNameText}>Pembahasan</Text>

              {/* Thumbnail */}
              <TouchableOpacity
                style={styles.videoThumbnailContainer}
                onPress={() => playVideo(materialDetailData.data.explanation_url)}
              >
                <Image
                  source={{
                    uri: getYoutubeThumbnail(
                      materialDetailData.data.explanation_url,
                    ),
                  }}
                  style={styles.videoThumbnail}
                />

                <View style={styles.playIcon}>
                  <Ionicons name="play-circle" size={56} color="#fff" />
                </View>
              </TouchableOpacity>

              {/* Fullscreen Video */}
              <Modal visible={showVideo} animationType="slide">
                <View style={styles.fullscreenVideoContainer}>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowVideo(false)}
                  >
                    <Ionicons name="close" size={32} color="#fff" />
                  </TouchableOpacity>

                  <WebView
                    originWhitelist={['*']}
                    source={{
                      uri: 'https://www.youtube-nocookie.com/embed/ZZ5LpwO-An4?playsinline=1&autoplay=0&controls=1&rel=0',
                    }}
                    allowsFullscreenVideo
                    allowsInlineMediaPlayback
                    mediaPlaybackRequiresUserAction={false}
                    javaScriptEnabled
                    domStorageEnabled
                    style={{ width: '100%', height: '100%' }}
                  />
                </View>
              </Modal>
            </View>
          )}
        </ScrollView>
      )}
      <View style={styles.bottomComponent}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            disabled={currentIndex === 0}
            onPress={() => setCurrentIndex(prev => prev - 1)}
            style={
              currentIndex === 0 ? styles.disableButton : styles.prevButton
            }
          >
            <Ionicons name="arrow-back" size={16} color={Colors.neutral500} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Text style={styles.buttonTitleText} numberOfLines={1}>
              {materialDetailData.data.material_name}
            </Text>
            <Text style={styles.breadcrumbText} numberOfLines={1}>
              {currentMaterial?.categoryName} · {currentMaterial?.chapterName} ·{' '}
              {currentMaterial?.subchapterName}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              if (currentIndex === materialList.length - 1) {
                navigation.goBack();
              } else {
                setCurrentIndex(prev => prev + 1);
              }
            }}
            style={styles.nextButton}
          >
            <Ionicons
              name="arrow-forward"
              size={16}
              color={Colors.neutral500}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StartMaterialDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
  },
  contentContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    paddingBottom: 120,
  },
  contentChildContainer: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.white,
    borderRadius: 6,
    marginBottom: 16,
  },
  materialNameText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.product900,
    marginBottom: 10,
  },
  materialContentText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
    marginBottom: 10,
  },
  bottomComponent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingBottom: 45,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'center',
    gap: 10,
  },

  prevButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },

  nextButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },

  disableButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    backgroundColor: Colors.neutral300,
  },
  buttonTitleText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.Medium,
    color: Colors.black,
    textAlign: 'center',
  },
  breadcrumbText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Fonts.Regular,
    color: Colors.warning500,
    textAlign: 'center',
    marginTop: 2,
  },
  videoThumbnailContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
  },

  videoThumbnail: {
    width: '100%',
    height: '100%',
  },

  playIcon: {
    position: 'absolute',
    top: '40%',
    left: '42%',
  },

  fullscreenVideoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },

  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
});
