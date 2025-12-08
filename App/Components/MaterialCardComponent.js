import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

//theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

const MaterialCardComponent = ({ item }) => {
  const { width } = useWindowDimensions();
  const buttonText =
    item.progress == 0
      ? 'Pelajari'
      : item.progress < 100
      ? 'Lanjutkan'
      : item.progress == 100
      ? 'Pelajari Ulang'
      : 'Beli';

  return (
    <View style={styles.materialCardContainer}>
      <Image
        source={require('../Assets/Images/dummyHome.png')}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.badgeContainer}>
        {item.jenjang > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.jenjang} Jenjang</Text>
          </View>
        )}
        {item.bab > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.bab} Bab</Text>
          </View>
        )}
        {item.subBab > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.subBab} Sub-bab</Text>
          </View>
        )}
        {item.materi > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.materi} Materi</Text>
          </View>
        )}
      </View>
      <View style={styles.materialInfoContainer}>
        <View style={styles.materialTitleContainer}>
          <Text style={styles.materialTitleText}>{item.materialTitle}</Text>
          <View style={styles.materialCategoryContainer}>
            <Text style={styles.materialCategoryText}>{item.category}</Text>
          </View>
        </View>
      </View>
      <View style={styles.materialInfoDetailContainer}>
        <View style={styles.materialDateContainer}>
          <View style={styles.dateIconContainer}>
            <MaterialCommunityIcons
              name={'calendar-blank'}
              size={12}
              color={Colors.neutral500}
            />
          </View>
          <Text style={styles.materialDateText}>{item.date}</Text>
        </View>
        {item.desc !== '' && (
          <View style={styles.materialDescContainer}>
            <View style={styles.dateIconContainer}>
              <MaterialCommunityIcons
                name="crown-outline"
                size={12}
                color={Colors.neutral500}
              />
            </View>
            <RenderHtml
              contentWidth={width}
              source={{ html: item.desc }}
              tagsStyles={{
                b: { fontWeight: 'bold' },
              }}
              baseStyle={styles.materialDateText}
            />
          </View>
        )}
        {item.seperateBuy && (
          <View style={styles.seperateBuyContainer}>
            <Ionicons name={'checkmark'} size={14} color={Colors.success500} />
            <Text style={styles.seperateBuyText}>Dapat dibeli terpisah</Text>
          </View>
        )}
        {item.closeDeadline && (
          <View style={styles.deadlineBuyContainer}>
            <Ionicons
              name={'time-outline'}
              size={14}
              color={Colors.warning500}
            />
            <Text style={styles.deadlineText}>Terakhir dipelajari</Text>
          </View>
        )}
      </View>
      <View style={styles.materialBuyContainer}>
        {item.progress !== undefined ? (
          <View style={[styles.row, { gap: 6 }]}>
            <AnimatedCircularProgress
              size={24}
              width={4}
              fill={item.progress}
              tintColor={Colors.warning500}
              backgroundColor={Colors.neutral200}
              rotation={180}
              lineCap="round"
            ></AnimatedCircularProgress>
            <Text style={styles.progressText}>{item.progress}%</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        {item.payMethod === 'token' && (
          <View style={[styles.row, { gap: 6 }]}>
            <FontAwesome name={'money'} size={16} color={Colors.warning500} />
            <Text style={styles.priceToken}>50</Text>
          </View>
        )}
        {item.payMethod === 'free' && <Text style={styles.freeText}>Free</Text>}
        <TouchableOpacity style={styles.buyButtonContainer}>
          <Text style={styles.buyButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MaterialCardComponent;

const styles = StyleSheet.create({
  materialCardContainer: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  image: {
    width: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: Colors.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },

  badgeText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral900,
  },

  materialInfoContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  materialTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  materialTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
    flex: 1,
  },
  materialCategoryContainer: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 4,
  },
  materialCategoryText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.product900,
  },
  materialDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateIconContainer: {
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    borderRadius: 6,
  },
  materialDateText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  materialDescContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  materialInfoDetailContainer: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
    paddingHorizontal: 12,
  },
  materialBuyContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buyButtonContainer: {
    paddingVertical: 8,
    paddingHorizontal: 38,
    backgroundColor: Colors.product900,
    borderRadius: 8,
    marginLeft: 16,
  },
  buyButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceToken: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  freeText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.success500,
  },
  seperateBuyContainer: {
    marginTop: 8,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.success200,
    backgroundColor: Colors.success50,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  seperateBuyText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.success500,
  },
  deadlineBuyContainer: {
    marginTop: 8,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.warning200,
    backgroundColor: Colors.warning50,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
  },
  deadlineText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.warning500,
  },
  progressText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
  },
});
