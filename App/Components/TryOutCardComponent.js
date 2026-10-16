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
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNavigation } from '@react-navigation/native';

//theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';
import { formatDateMaterial } from '../Utils/Helper';

const TryOutCardComponents = ({ item }) => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const now = new Date();
  const endTime = new Date(item.end_time);
  const buttonText = item.purchase_date
    ? item.no_time_limit_flag === 0 && endTime < now
      ? 'Review'
      : item.used_attempts > 0 && item.used_attempts < item.max_attempts
      ? 'Mulai Ulang'
      : item.used_attempts >= item.max_attempts
      ? 'Lihat Detail'
      : 'Mulai'
    : item?.access_type?.id == 4
    ? 'Ambil'
    : 'Beli';

  const getScoreMeta = score => {
    if (score >= 75) {
      return {
        label: 'Hebat',
        color: Colors.success500,
      };
    }

    if (score > 45) {
      return {
        label: 'Lumayan',
        color: Colors.warning500,
      };
    }

    return {
      label: 'Kurang',
      color: Colors.danger500,
    };
  };
  const scoreMeta = getScoreMeta(item.best_score);

  const handleOnPress = item => {
    if (buttonText === 'Beli' || buttonText === 'Ambil') {
      navigation.navigate('DetailPurchaseTryOut', {
        tryoutId: item.id,
      });
    } else if (
      buttonText === 'Mulai' ||
      buttonText === 'Mulai Ulang' ||
      buttonText === 'Lihat Detail' ||
      buttonText === 'Review'
    ) {
      navigation.navigate('StartTryOut', {
        tryoutId: item.tryout_id ?? item.id,
      });
    }
  };

  return (
    <View style={styles.materialCardContainer}>
      {item.banner_url !== '' && (
        <Image
          source={{ uri: item.banner_url }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.materialInfoContainer}>
        <View style={styles.materialTitleContainer}>
          <Text style={styles.materialTitleText}>{item.tryout_name}</Text>
          <View style={styles.materialCategoryContainer}>
            <Text style={styles.materialCategoryText}>
              {item.category.category_name}
            </Text>
          </View>
        </View>
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item?.statistics?.total_categories} Kategori</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.total_questions} Soal</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.duration_minutes} Menit</Text>
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
          {item.no_time_limit_flag === 0 ? (
            <Text style={styles.materialDateText}>
              {formatDateMaterial(item.start_time)}{' '}
              {item.end_time ? `- ${formatDateMaterial(item.end_time)}` : ''}
            </Text>
          ) : (
            <Text style={styles.materialDateText}>Akses kapan saja</Text>
          )}
        </View>
        {item.description !== '' && (
          <View style={styles.materialDescContainer}>
            <View style={styles.dateIconContainer}>
              <MaterialCommunityIcons
                name="crown-outline"
                size={12}
                color={Colors.neutral500}
              />
            </View>
            <Text style={styles.materialDateText}>{item.description}</Text>
          </View>
        )}
        {item.seperateBuy && item.buyStatus == 'purchased' && (
          <View style={styles.materialDescContainer}>
            <View style={styles.dateIconContainer}>
              <FontAwesome name={'money'} size={10} color={Colors.neutral500} />
            </View>
            <RenderHtml
              contentWidth={width}
              source={{ html: 'Dibeli terpisah' }}
              tagsStyles={{
                b: { fontWeight: 'bold' },
              }}
              baseStyle={styles.materialDateText}
            />
          </View>
        )}
        {(item?.access_type?.id == 1 || item?.access_type?.id == 3) &&
          !item?.purchase_date && (
            <View style={styles.seperateBuyContainer}>
              <Ionicons
                name={'checkmark'}
                size={14}
                color={Colors.success500}
              />
              <Text style={styles.seperateBuyText}>Dapat dibeli terpisah</Text>
            </View>
          )}
        {item.purchase_date &&
          (endTime > now || item.no_time_limit_flag === 1) && (
            <View style={styles.materialDescContainer}>
              <View style={styles.dateIconContainer}>
                <MaterialCommunityIcons
                  name={'file-document-edit-outline'}
                  size={10}
                  color={Colors.neutral500}
                />
              </View>
              <Text style={styles.materialDateText}>
                {`Kesempatan: ${item.used_attempts}/${item.max_attempts}`}
              </Text>
            </View>
          )}
        {item?.access_type?.id == 4 && !item?.purchase_date && (
          <View style={styles.seperateBuyContainer}>
            <Ionicons
              name={'time-outline'}
              size={14}
              color={Colors.success500}
            />
            <Text style={styles.seperateBuyText}>Gratis untuk saat ini</Text>
          </View>
        )}
        {item.purchase_date &&
          endTime < now &&
          item.no_time_limit_flag === 0 && (
            <View style={styles.expiredContainer}>
              <Ionicons
                name={'time-outline'}
                size={14}
                color={Colors.neutral500}
              />
              <Text style={styles.expiredText}>Lewat batas waktu akses</Text>
            </View>
          )}
        {/* {item.closeDeadline && (
          <View style={styles.deadlineBuyContainer}>
            <Ionicons
              name={'time-outline'}
              size={14}
              color={Colors.warning500}
            />
            <Text style={styles.deadlineText}>Terakhir dipelajari</Text>
          </View>
        )} */}
      </View>
      <View style={styles.materialBuyContainer}>
        {item.purchase_date ? (
          item.used_attempts === 0 ? (
            <View style={styles.scoreContainer}>
              <Entypo name={'dot-single'} size={22} color={Colors.neutral400} />
              <Text style={styles.notesText}>Belum ada!</Text>
            </View>
          ) : (
            <View style={styles.scoreContainer}>
              <Entypo name="dot-single" size={22} color={scoreMeta.color} />

              <Text style={[styles.scoreText, { color: scoreMeta.color }]}>
                {item.best_score}
              </Text>

              <Text style={styles.dividerText}> | </Text>

              <Text style={[styles.notesText]}>{scoreMeta.label}</Text>
            </View>
          )
        ) : (
          <View style={{ flex: 1 }} />
        )}

        {(item?.access_type?.id === 1 || item?.access_type?.id === 3) &&
          !item.purchase_date && (
            <View style={[styles.row, { gap: 6 }]}>
              <FontAwesome name={'money'} size={16} color={Colors.warning500} />
              <Text style={styles.priceToken}>{item.price_token || item.price}</Text>
            </View>
          )}
        {item?.access_type?.id === 4 && !item.purchase_date && (
          <Text style={styles.freeText}>Free</Text>
        )}
        <TouchableOpacity
          onPress={() => {
            handleOnPress(item);
          }}
          style={styles.buyButtonContainer}
        >
          <Text style={styles.buyButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TryOutCardComponents;

const styles = StyleSheet.create({
  materialCardContainer: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.white,
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: 190,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  badgeContainer: {
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
    marginTop: 10,
  },
  materialBuyContainer: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreContainer: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    paddingVertical: 6,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
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
  expiredContainer: {
    marginTop: 8,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
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
  expiredText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
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
  notesText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  scoreText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 16,
    lineHeight: 20,
    color: Colors.success500,
  },
  dividerText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral200,
  },
});
