import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  FlatList,
  Dimensions,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

// components
import AuthenticatedHeader from '../../Components/AuthenticatedHeader';

//helper
import { getInitial } from '../../Utils/Helper';

const SCREEN_WIDTH = Dimensions.get('screen').width;

const ForumPage = () => {
  const [activeTab, setActiveTab] = useState('terbaru');
  const [tabWidth, setTabWidth] = useState(0);

  const slideAnim = useRef(new Animated.Value(0)).current;

  const newForumData = [
    {
      id: 1,
      userName: 'Dimas Permadi',
      datePosted: '7 Nov 2025, 17:12',
      message:
        'Teman-teman, ada yang punya tips ngerjain soal analogi verbal di SNBT nggak? Kadang aku bingung nentuin hubungan katanya, terutama yang mirip-mirip kayak “pisau – memotong” vs “pena – menulis”.',
      commentTotal: 4,
      likeTotal: 6,
      viewTotal: 10,
      status: 'member',
    },
    {
      id: 2,
      userName: 'Andini',
      datePosted: '7 Nov 2025, 17:00',
      message:
        'Halo semua Juara SNBT 👋\nKalau kalian masih sering keliru di soal penalaran kuantitatif, coba biasakan nulis langkah kerja tiap soal, bukan cuma hasil akhirnya. Dengan begitu, kalian bisa lebih cepat identifikasi kesalahan logika atau hitungan. Semangat terus, jangan lupa istirahat juga ya! 🌱',
      commentTotal: 12,
      likeTotal: 16,
      viewTotal: 24,
      status: 'tutor',
    },
    {
      id: 3,
      userName: 'Fajar Pradana',
      datePosted: '7 Nov 2025, 16:45',
      message:
        'Mau cerita sedikit dan berbagi pengalaman pribadi ke temen temen. Baru seminggu serius belajar TKA, rasanya otak udah penuh banget. Tapi tiap kali inget tujuan pengen tembus kampus impian, semangatnya balik lagi 💪 Ada yang punya jadwal belajar efektif buat TKA?',
      commentTotal: 14,
      likeTotal: 18,
      viewTotal: 26,
      status: 'customer',
    },
    {
      id: 4,
      userName: 'Dwi Lestari',
      datePosted: '7 Nov 2025, 16:30',
      message:
        'Mau nanya dong, kalau di soal TWK ada pertanyaan tentang “sistem pemerintahan Indonesia”, itu biasanya nyangkut ke topik apa aja ya? Aku takut kelewat pas review materi 😭',
      commentTotal: 14,
      likeTotal: 20,
      viewTotal: 30,
      status: 'member',
    },
  ];

  const trendForumData = [
    {
      id: 1,
      userName: 'Nabila Zahra',
      datePosted: '7 Nov 2025, 12:12',
      message:
        'Dulu aku gagal SNBT 2024, tapi sekarang aku mulai lagi dari awal 💪\nBelajar tiap hari minimal 2 jam dan rutin ikut latihan di tembus.in. Progress-nya mulai keliatan banget!\nJangan takut gagal, yang penting terus belajar dan evaluasi diri. Kita semua bisa tembus impian masing-masing! 🌟',
      commentTotal: 137,
      likeTotal: 412,
      viewTotal: 642,
      status: 'member',
    },
    {
      id: 2,
      userName: 'Rendra',
      datePosted: '7 Nov 2025, 12:02',
      message:
        'Buat teman-teman pejuang CPNS, ingat satu hal penting: strategi lebih penting daripada hafalan.\nGunakan waktu belajar 70% untuk latihan soal dan 30% untuk review kesalahan.\nBelajar cerdas lebih baik daripada belajar keras tanpa arah 💡',
      commentTotal: 178,
      likeTotal: 527,
      viewTotal: 712,
      status: 'tutor',
    },
    {
      id: 3,
      userName: 'Intan Prameswari',
      datePosted: '7 Nov 2025, 11:25',
      message:
        'Baru aja selesai Try Out CPNS di tembus.in 🎯\nNilai TWK-ku naik 25 poin dari minggu lalu! Tipsku: fokus latihan waktu dan baca ulang pembahasan tiap kali salah.\nYang lain gimana hasilnya minggu ini?',
      commentTotal: 121,
      likeTotal: 345,
      viewTotal: 456,
      status: 'member',
    },
    {
      id: 4,
      userName: 'Aldi Saputra',
      datePosted: '7 Nov 2025, 11:05',
      message:
        'Teman-teman, menurut kalian lebih efektif belajar konsep TKA dulu baru latihan soal, atau langsung latihan sambil baca pembahasan? Aku ngerasa kalau langsung latihan sering stuck, tapi kalau baca teori dulu malah kelamaan 😅',
      commentTotal: 96,
      likeTotal: 289,
      viewTotal: 396,
      status: 'member',
    },
  ];

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: activeTab === 'terbaru' ? 0 : 1,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  });
  const translateContent = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -SCREEN_WIDTH],
  });

  const ForumCardComponent = ({ item }) => {
    const [showMoreButton, setShowMoreButton] = useState(false);
    const [textShown, setTextShown] = useState(false);
    const [numLines, setNumLines] = useState(undefined);

    const toggleTextShown = () => {
      setTextShown(!textShown);
    };

    useEffect(() => {
      setNumLines(textShown ? undefined : 5);
    }, [textShown]);

    const onTextLayout = useCallback(
      e => {
        if (e.nativeEvent.lines.length > 5 && !textShown) {
          setShowMoreButton(true);
          setNumLines(5);
        }
      },
      [textShown],
    );

    return (
      <View style={styles.cardContainer}>
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <View style={styles.profileInitialContainer}>
              <Text style={styles.initialText}>
                {getInitial(item.userName)}
              </Text>
            </View>
            <View style={styles.userPostData}>
              <View style={styles.row}>
                <Text style={styles.postedUsernameText}>{item.userName}</Text>
                {item.status !== 'customer' && (
                  <View style={styles.iconNameContainer}>
                    {item.status === 'member' && (
                      <MaterialCommunityIcons
                        name="crown-outline"
                        size={16}
                        color={Colors.product700}
                      />
                    )}
                    {item.status === 'tutor' && (
                      <Text style={styles.tutorText}>Tutor</Text>
                    )}
                  </View>
                )}
              </View>
              <Text style={styles.postedDateText}>{item.datePosted}</Text>
            </View>
            <TouchableOpacity style={styles.moreButton}>
              <MaterialCommunityIcons name={'dots-horizontal'} size={18} />
            </TouchableOpacity>
          </View>
          <View style={styles.messageContainer}>
            <Text
              style={styles.messageText}
              onTextLayout={onTextLayout}
              numberOfLines={numLines}
            >
              {item.message}
            </Text>
            {showMoreButton && (
              <TouchableOpacity
                style={styles.readMore}
                onPress={toggleTextShown}
              >
                <Text style={styles.readMoreText}>
                  {textShown ? 'Tutup' : 'Baca selengkapnya'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.postStatusContainer}>
          <View style={styles.row}>
            <Ionicons
              name={'chatbubble-outline'}
              size={16}
              color={Colors.neutral500}
            />
            <Text style={styles.statusCountText}>{item.commentTotal}</Text>
          </View>
          <View style={[styles.row, { marginLeft: 20 }]}>
            <Ionicons
              name={'heart-outline'}
              size={16}
              color={Colors.neutral500}
            />
            <Text style={styles.statusCountText}>{item.likeTotal}</Text>
          </View>
          <View style={[styles.row, { marginLeft: 20, flex: 1 }]}>
            <Ionicons
              name={'eye-outline'}
              size={16}
              color={Colors.neutral500}
            />
            <Text style={styles.statusCountText}>{item.viewTotal}</Text>
          </View>
          <Feather name={'upload'} size={16} color={Colors.neutral500} />
        </View>
      </View>
    );
  };

  const NewForumComponent = () => {
    return (
      <View style={styles.forumContainer}>
        <FlatList
          data={newForumData}
          renderItem={({ item }) => {
            return <ForumCardComponent item={item} />;
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  const TrendComponent = () => {
    return (
      <View style={styles.forumContainer}>
        <FlatList
          data={trendForumData}
          renderItem={({ item }) => {
            return <ForumCardComponent item={item} />;
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AuthenticatedHeader title={'Forum'} includeSearch={true} />
      <View style={styles.switchContainer}>
        <View
          style={styles.switchChildContainer}
          onLayout={e => {
            const total = e.nativeEvent.layout.width;
            setTabWidth(total / 2);
          }}
        >
          {/* Sliding Indicator */}
          <Animated.View
            style={[
              styles.indicator,
              { width: tabWidth - 8, transform: [{ translateX }] },
            ]}
          />

          {/* Terbaru */}
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

          {/* Trending */}
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
      <Animated.View
        style={{
          flexDirection: 'row',
          width: SCREEN_WIDTH * 2,
          transform: [{ translateX: translateContent }],
        }}
      >
        <View style={{ width: SCREEN_WIDTH }}>
          <NewForumComponent />
        </View>

        <View style={{ width: SCREEN_WIDTH }}>
          <TrendComponent />
        </View>
      </Animated.View>
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  switchContainer: {
    backgroundColor: Colors.white,
    paddingTop: 6,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  switchChildContainer: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: Colors.product900,
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingBottom: 200,
    paddingTop: 4,
  },
  cardContainer: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 6,
    backgroundColor: Colors.white,
  },
  postContainer: {
    paddingLeft: 12,
    paddingTop: 12,
    paddingBottom: 16,
    paddingRight: 8,
    borderBottomColor: Colors.neutral200,
    borderBottomWidth: 1,
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
  iconNameContainer: {
    padding: 1,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    marginLeft: 4,
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
  moreButton: {
    paddingRight: 16,
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
  readMore: {
    marginTop: 6,
  },
  readMoreText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    color: Colors.product400,
    lineHeight: 16,
  },
  postStatusContainer: {
    paddingVertical: 7,
    paddingLeft: 12,
    paddingRight: 16,
    flexDirection: 'row',
  },
  statusCountText: {
    marginLeft: 2,
    fontFamily: Fonts.Regular,
    fontSize: 12,
    color: Colors.neutral500,
    lineHeight: 18,
  },
  tutorText: {
    fontFamily: Fonts.Medium,
    fontSize: 10,
    lineHeight: 14,
    marginHorizontal: 2,
    color: Colors.product900,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    backgroundColor: Colors.warning500,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default ForumPage;
