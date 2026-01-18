import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// components
import MainHeader from '../../../Components/MainHeader';
import BottomModal from '../../../Components/BottomModal';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

// redux
import { useDispatch, useSelector } from 'react-redux';
import { ActionStudent } from '../../../Redux/Actions';

//helper
import { formatDateMaterial } from '../../../Utils/Helper';

const MaterialDetailPage = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const materialCollectionId = props?.route?.params?.materialCollectionId;

  const { materialCollectionDetailData } = useSelector(state => state.material);
  const [expanded, setExpanded] = useState({});

  const isAfterDeadline = deadline => {
    const now = new Date();
    const deadlineDate = new Date(deadline);

    return now > deadlineDate;
  };

  const toggleExpand = key => {
    setExpanded(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useFocusEffect(
    useCallback(() => {
      const initializeData = async () => {
        const token = await AsyncStorage.getItem('auth_token');

        dispatch(
          ActionStudent.GetMaterialCollectionDetailData(
            token,
            materialCollectionId,
          ),
        );
      };
      initializeData();

      return () => {};
    }, [dispatch]),
  );

  if (!materialCollectionDetailData?.data) {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor={Colors.white} />
        <MainHeader title="Detail Materi" />
      </View>
    );
  }

  const ExpandableHeader = ({ title, isExpanded, hasChildren, onPress }) => {
    return (
      <TouchableOpacity
        onPress={hasChildren ? onPress : undefined}
        activeOpacity={hasChildren ? 0.7 : 1}
        style={styles.categoryDetailButtonContainer}
      >
        <View
          style={{
            flexDirection: 'row',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <View style={styles.folderContainer}>
            <Ionicons
              name={'folder-outline'}
              size={14}
              color={Colors.neutral500}
            />
          </View>
          <Text style={styles.categoryTitleText}>{title}</Text>
        </View>

        {hasChildren && (
          <Ionicons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={18}
            color="#666"
          />
        )}
      </TouchableOpacity>
    );
  };

  const CategoriesDetail = () => {
    return (
      <View>
        {materialCollectionDetailData.data.categories.map(category => {
          const categoryKey = `cat-${category.id}`;
          const hasChapters = category.chapters?.length > 0;

          return (
            <View key={categoryKey} style={styles.categoryDetailContainer}>
              {/* CATEGORY */}
              <ExpandableHeader
                title={category.material_category_name}
                isExpanded={expanded[categoryKey]}
                hasChildren={hasChapters}
                onPress={() => toggleExpand(categoryKey)}
              />

              {expanded[categoryKey] &&
                category.chapters.map(chapter => {
                  const chapterKey = `chap-${chapter.id}`;
                  const hasSubchapters = chapter.subchapters?.length > 0;

                  return (
                    <View key={chapterKey} style={styles.chapterContainer}>
                      {/* CHAPTER */}
                      <ExpandableHeader
                        title={chapter.material_category_chapter_name}
                        isExpanded={expanded[chapterKey]}
                        hasChildren={hasSubchapters}
                        onPress={() => toggleExpand(chapterKey)}
                      />

                      {expanded[chapterKey] &&
                        chapter.subchapters.map(subchapter => {
                          const subKey = `sub-${subchapter.id}`;
                          const hasMaterials = subchapter.materials?.length > 0;

                          return (
                            <View key={subKey} style={styles.chapterContainer}>
                              {/* SUBCHAPTER */}
                              <ExpandableHeader
                                title={
                                  subchapter.material_category_subchapter_name
                                }
                                isExpanded={expanded[subKey]}
                                hasChildren={hasMaterials}
                                onPress={() => toggleExpand(subKey)}
                              />

                              {expanded[subKey] &&
                                subchapter.materials.map(material => (
                                  <View
                                    key={material.id}
                                    style={[
                                      styles.categoryDetailButtonContainer,
                                      styles.chapterContainer,
                                      { marginRight: 13 },
                                    ]}
                                  >
                                    <View
                                      style={
                                        styles.materialChaterDetailContainer
                                      }
                                    >
                                      <View style={styles.folderContainer}>
                                        <Ionicons
                                          name={'menu-outline'}
                                          size={14}
                                          color={Colors.neutral500}
                                        />
                                      </View>
                                      <Text style={styles.categoryTitleText}>
                                        {material.material_name}
                                      </Text>
                                    </View>
                                    <Text
                                      style={
                                        material.is_read === true
                                          ? styles.percentageMaterialText
                                          : styles.negativePercentageMaterialText
                                      }
                                    >
                                      {material.is_read === true
                                        ? '100%'
                                        : '0%'}
                                    </Text>
                                  </View>
                                ))}
                            </View>
                          );
                        })}
                    </View>
                  );
                })}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />

      <MainHeader
        title={'Detail Materi'}
        rightComponent={
          <View style={[styles.row, { gap: 6, marginTop: 0 }]}>
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
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: materialCollectionDetailData.data.banner_url }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.materialDetailContainer}>
            <View style={[styles.row]}>
              <Text style={styles.titleText}>
                {materialCollectionDetailData.data.material_collection_name}
              </Text>
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryText}>
                  {materialCollectionDetailData.data.category.category_name}
                </Text>
              </View>
            </View>
            {materialCollectionDetailData.data.start_time && (
              <View style={[styles.row]}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons
                    name={'calendar-blank'}
                    size={14}
                    color={Colors.neutral500}
                  />
                </View>
                <Text style={styles.detailText}>
                  Akses{' '}
                  {formatDateMaterial(materialCollectionDetailData.data.start_time)}{' '}
                  {materialCollectionDetailData.data.end_time
                    ? `- ${formatDateMaterial(
                        materialCollectionDetailData.data.end_time,
                      )}`
                    : ''}
                </Text>
              </View>
            )}
            <View style={[styles.row]}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={'crown-outline'}
                  size={14}
                  color={Colors.neutral500}
                />
              </View>
              <Text style={styles.detailText}>
                {materialCollectionDetailData.data.description}
              </Text>
            </View>
            <View style={[styles.row]}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons
                  name={'download'}
                  size={14}
                  color={Colors.neutral500}
                />
              </View>
              <Text style={styles.detailText}>
                {materialCollectionDetailData.data.download_flag
                  ? 'Materi dapat diunduh'
                  : 'Materi tidak dapat diunduh'}
              </Text>
            </View>
            {isAfterDeadline(materialCollectionDetailData.data.end_time) && (
              <View style={[styles.row, styles.expiredContainer]}>
                <MaterialCommunityIcons
                  name={'information-outline'}
                  size={14}
                  color={Colors.neutral500}
                />
                <Text style={styles.detailText}>Lewat batas waktu akses</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.badgeContainer}>
          {materialCollectionDetailData.data.statistics?.total_categories >
            0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {materialCollectionDetailData.data.statistics?.total_categories}{' '}
                Jenjang
              </Text>
            </View>
          )}
          {materialCollectionDetailData.data.statistics?.total_chapters > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {materialCollectionDetailData.data.statistics?.total_chapters}{' '}
                Bab
              </Text>
            </View>
          )}
          {materialCollectionDetailData.data.statistics?.total_subchapters >
            0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {
                  materialCollectionDetailData.data.statistics
                    ?.total_subchapters
                }{' '}
                Sub-bab
              </Text>
            </View>
          )}
          {materialCollectionDetailData.data.statistics?.total_materials >
            0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {materialCollectionDetailData.data.statistics?.total_materials}{' '}
                Materi
              </Text>
            </View>
          )}
        </View>
        <CategoriesDetail />
      </ScrollView>
      {!isAfterDeadline(materialCollectionDetailData.data.end_time) && (
        <View style={styles.bottomComponent}>
          {/* {materialCollectionDetailData.data.access_type.id != 4 &&
          !materialCollectionDetailData.data.is_purchased && (
            <Text style={styles.buttonDesc}>
              Beli paket asdasd dan akses sebagai member
            </Text>
          )} */}
          <View style={styles.buttonContainer}>
            {materialCollectionDetailData.data.download_flag &&
              materialCollectionDetailData.data.statistics
                .progress_percentage === 100 && (
                <TouchableOpacity
                  onPress={() => {}}
                  style={styles.downloadButtonContainer}
                >
                  <MaterialCommunityIcons
                    name={'download'}
                    size={20}
                    color={Colors.neutral500}
                  />
                </TouchableOpacity>
              )}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('StartMaterialPage', {
                  materialCollectionDetailDataPrev:
                    materialCollectionDetailData,
                });
              }}
              style={styles.joinMemberContainer}
            >
              <Text style={styles.joinMemberText}>
                {materialCollectionDetailData.data.statistics
                  .progress_percentage === 100
                  ? 'Pelajari ulang'
                  : 'Mulai'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default MaterialDetailPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  headerContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  image: {
    width: '100%',
    height: 190,
    borderRadius: 8,
  },
  materialDetailContainer: {
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  progressText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
  },
  titleText: {
    fontFamily: Fonts.Medium,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.neutral900,
    flex: 1,
  },
  categoryContainer: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Fonts.Regular,
    color: Colors.product900,
  },
  iconContainer: {
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    borderRadius: 6,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: Fonts.Regular,
    color: Colors.neutral500,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginVertical: 16,
    marginLeft: 16,
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
  categoryDetailContainer: {
    marginHorizontal: 16,
    paddingHorizontal: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    backgroundColor: Colors.white,
  },
  chapterContainer: {
    marginLeft: 16,
    paddingLeft: 10,
  },
  folderContainer: {
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    borderRadius: 6,
  },
  categoryTitleText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
    flexShrink: 1,
    width: '80%',
  },
  categoryDetailButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.neutral200,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  materialChaterDetailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  percentageMaterialText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.success500,
  },
  negativePercentageMaterialText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.danger500,
  },
  bottomComponent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingBottom: 46,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
  buttonDesc: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: Fonts.Regular,
    color: Colors.neutral500,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  joinMemberContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.product900,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  joinMemberText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
  downloadButtonContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    alignItems: 'center',
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
    fontSize: 14,
    lineHeight: 20,
    color: Colors.success500,
  },
  showTokenPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  expiredContainer: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    gap: 6,
    borderWidth: 1,
    backgroundColor: Colors.neutral50,
    borderColor: Colors.neutral200,
    borderRadius: 6,
    width: 220,
  },
});
