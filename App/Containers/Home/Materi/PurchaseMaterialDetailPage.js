import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useNavigation } from '@react-navigation/native';

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

//API
import { BASE_URL, MATERIAL } from '../../../Api/GlobalUrl';

const PurchaseMaterialDetailPage = props => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const materialCollectionId = props?.route?.params?.materialCollectionId;

  const { materialCollectionDetailData, materialSpinner } = useSelector(
    state => state.material,
  );
  const [expanded, setExpanded] = useState({});
  const [showBuyWithTokenModal, setShowBuyWithTokenModal] = useState(false);
  const [loadingBuyMaterial, setLoadingBuyMaterial] = useState(false);
  const myToken = 50;
  const accessId = materialCollectionDetailData?.data?.access_type?.id ?? null;
  const canBuyWithToken = accessId === 1 || accessId === 3;
  const canJoinMember = accessId === 1 || accessId === 2;
  const canTakeFree = accessId === 4;

  const toggleExpand = key => {
    setExpanded(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePurchaseMaterialCollection = async () => {
    setLoadingBuyMaterial(true);
    const token = await AsyncStorage.getItem('auth_token');
    const response = await dispatch(
      ActionStudent.PurchaseMaterialCollection(
        token,
        materialCollectionId,
        materialCollectionDetailData.data.price_token,
      ),
    );
    setLoadingBuyMaterial(false);
    setShowBuyWithTokenModal(false);
  };

  useEffect(() => {
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
  }, []);

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
                                      styles.materialChaterDetailContainer,
                                      styles.chapterContainer,
                                    ]}
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

      <MainHeader title={'Detail Materi'} />
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
                {formatDateMaterial(
                  materialCollectionDetailData.data.start_time,
                )}{' '}
                -{' '}
                {formatDateMaterial(materialCollectionDetailData.data.end_time)}
              </Text>
            </View>
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
          </View>
          <View></View>
          {(materialCollectionDetailData.data.access_type.id == 1 ||
            materialCollectionDetailData.data.access_type.id == 3) && (
            <View style={styles.showTokenPriceContainer}>
              <View style={styles.seperateBuyContainer}>
                <Ionicons
                  name={'checkmark'}
                  size={14}
                  color={Colors.success500}
                />
                <Text style={styles.seperateBuyText}>
                  Dapat dibeli terpisah
                </Text>
              </View>
              <View style={[styles.row, { gap: 6 }]}>
                <FontAwesome name="money" size={16} color={Colors.warning500} />
                <Text style={bottomSheetModalStyles.priceToken}>
                  {materialCollectionDetailData.data.price_token}
                </Text>
              </View>
            </View>
          )}
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
      <View style={styles.bottomComponent}>
        {/* {materialCollectionDetailData.data.access_type.id != 4 &&
          !materialCollectionDetailData.data.is_purchased && (
            <Text style={styles.buttonDesc}>
              Beli paket asdasd dan akses sebagai member
            </Text>
          )} */}
        <View style={styles.buttonContainer}>
          {canBuyWithToken && (
            <TouchableOpacity
              onPress={() => setShowBuyWithTokenModal(true)}
              style={styles.buyWithTokenContainer}
            >
              <Text style={styles.buyWithTokenText}>Beli Dengan Token</Text>
            </TouchableOpacity>
          )}

          {canJoinMember && (
            <TouchableOpacity
              onPress={() => {}}
              style={styles.joinMemberContainer}
            >
              <Text style={styles.joinMemberText}>Gabung Member</Text>
            </TouchableOpacity>
          )}

          {canTakeFree && (
            <TouchableOpacity
              onPress={() => {}}
              style={styles.joinMemberContainer}
            >
              <Text style={styles.joinMemberText}>Ambil</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <BottomModal
        visible={showBuyWithTokenModal}
        onClose={() => setShowBuyWithTokenModal(false)}
        title="Beli materi"
        enableScroll={false}
      >
        <View style={bottomSheetModalStyles.rowContainer}>
          <View style={bottomSheetModalStyles.fileIconContainer}>
            <MaterialCommunityIcons
              name="book-open-blank-variant"
              size={24}
              color={Colors.product900}
            />
          </View>
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>
              {materialCollectionDetailData.data.category.category_name}
            </Text>
          </View>
        </View>
        <View style={bottomSheetModalStyles.titleContainer}>
          <Text style={styles.titleText}>
            {materialCollectionDetailData.data.material_collection_name}
          </Text>
        </View>
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
            {formatDateMaterial(materialCollectionDetailData.data.start_time)} -{' '}
            {formatDateMaterial(materialCollectionDetailData.data.end_time)}
          </Text>
        </View>
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
        <View style={bottomSheetModalStyles.badgeContainerBottomModal}>
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
        <View style={bottomSheetModalStyles.tokenTotalContainer}>
          <View style={bottomSheetModalStyles.tokenTotalChildContainer}>
            <Text style={bottomSheetModalStyles.tokenTotalTitleText}>
              Harga Materi
            </Text>
            <View style={[styles.row, { gap: 6 }]}>
              <FontAwesome name="money" size={16} color={Colors.warning500} />
              <Text style={bottomSheetModalStyles.priceToken}>
                {materialCollectionDetailData.data.price_token}
              </Text>
            </View>
          </View>
          <View style={bottomSheetModalStyles.tokenTotalChildContainer}>
            <Text style={bottomSheetModalStyles.tokenTotalTitleText}>
              Token saya
            </Text>
            <View style={[styles.row, { gap: 6 }]}>
              <FontAwesome
                name="money"
                size={13}
                color={
                  myToken >= materialCollectionDetailData.data.price_token
                    ? Colors.neutral400
                    : Colors.danger500
                }
              />
              <Text
                style={
                  myToken >= materialCollectionDetailData.data.price_token
                    ? bottomSheetModalStyles.myTokenText
                    : bottomSheetModalStyles.dangerMyTokenText
                }
              >
                {myToken}
              </Text>
            </View>
          </View>
        </View>
        <View style={bottomSheetModalStyles.buttonContainer}>
          {myToken >= materialCollectionDetailData.data.price_token ? (
            <TouchableOpacity
              onPress={() => {
                handlePurchaseMaterialCollection();
              }}
              style={bottomSheetModalStyles.buyButtonContainer}
            >
              <Text style={bottomSheetModalStyles.buyButtonText}>Beli</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={bottomSheetModalStyles.topUpButtonContainer}
            >
              <Text style={bottomSheetModalStyles.topUpButtonText}>
                Isi Token
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </BottomModal>
    </View>
  );
};

export default PurchaseMaterialDetailPage;

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
    borderBottomColor: Colors.neutral200,
    borderBottomWidth: 1,
    paddingVertical: 10,
    gap: 8,
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
  buyWithTokenContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  buyWithTokenText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
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
});

const bottomSheetModalStyles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  fileIconContainer: {
    padding: 8,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
  },
  titleContainer: {
    marginTop: 12,
  },
  countContainer: {
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  countChildContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.neutral200,
  },
  countText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  tokenTotalContainer: {
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
    gap: 10,
  },
  tokenTotalChildContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tokenTotalTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  myTokenText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral400,
  },
  dangerMyTokenText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.danger500,
  },
  buttonContainer: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  buyButtonContainer: {
    paddingVertical: 10,
    backgroundColor: Colors.product900,
    alignItems: 'center',
    borderRadius: 8,
  },
  buyButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
  topUpButtonContainer: {
    paddingVertical: 10,
    backgroundColor: Colors.white,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  topUpButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  badgeContainerBottomModal: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  rowBottomModal: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  priceToken: {
    fontFamily: Fonts.SemiBold,
    fontSize: 20,
    lineHeight: 24,
    color: Colors.neutral900,
  },
});
