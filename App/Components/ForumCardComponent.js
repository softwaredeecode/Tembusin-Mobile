import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

//theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

//helper
import { getInitial, formatDate } from '../Utils/Helper';

const ForumCardComponent = React.memo(({ item, navigation }) => {
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
    <TouchableOpacity
      onPress={() => navigation.navigate('ForumDetailPage', { item })}
      style={styles.cardContainer}
    >
      <View style={styles.postContainer}>
        <View style={styles.postHeader}>
          <View style={styles.profileInitialContainer}>
            <Text style={styles.initialText}>
              {getInitial(item?.user?.username)}
            </Text>
          </View>
          <View style={styles.userPostData}>
            <View style={styles.row}>
              <Text style={styles.postedUsernameText}>
                {item?.user?.username}
              </Text>
              {/* {item?.status !== 'customer' && (
                  <View style={styles.iconNameContainer}>
                    {item?.status === 'member' && (
                      <MaterialCommunityIcons
                        name="crown-outline"
                        size={16}
                        color={Colors.product700}
                      />
                    )}
                    {item?.status === 'tutor' && (
                      <Text style={styles.tutorText}>Tutor</Text>
                    )}
                  </View>
                )} */}
            </View>
            <Text style={styles.postedDateText}>
              {formatDate(item?.updated_at)}
            </Text>
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
            {item?.content}
          </Text>
          {showMoreButton && (
            <TouchableOpacity style={styles.readMore} onPress={toggleTextShown}>
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
          <Text style={styles.statusCountText}>{item?.comment_count}</Text>
        </View>
        <View style={[styles.row, { marginLeft: 20 }]}>
          <Ionicons
            name={'heart-outline'}
            size={16}
            color={Colors.neutral500}
          />
          <Text style={styles.statusCountText}>{item?.like_count}</Text>
        </View>
        <View style={[styles.row, { marginLeft: 20, flex: 1 }]}>
          <Ionicons name={'eye-outline'} size={16} color={Colors.neutral500} />
          <Text style={styles.statusCountText}>{item?.view_count}</Text>
        </View>
        <Feather name={'upload'} size={16} color={Colors.neutral500} />
      </View>
    </TouchableOpacity>
  );
});

export default ForumCardComponent;

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
    borderBottomColor: Colors.neutral200,
    borderBottomWidth: 1,
  },
  switchChildContainer: {
    padding: 4,
    borderRadius: 6,
    backgroundColor: Colors.product950,
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
    paddingBottom: 180,
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
