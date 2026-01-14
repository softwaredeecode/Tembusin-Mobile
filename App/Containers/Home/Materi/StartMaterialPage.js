import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { useNavigation } from '@react-navigation/native';

// components
import MainHeader from '../../../Components/MainHeader';
import BottomModal from '../../../Components/BottomModal';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

const StartMaterialPage = props => {
  const navigation = useNavigation();
  const materialCollectionDetailData =
    props?.route?.params?.materialCollectionDetailData;
  const [expanded, setExpanded] = useState({});
  const [showConfirmationGoBack, setShowConfirmationGoBack] = useState(false);

  const toggleExpand = key => {
    setExpanded(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  useEffect(() => {
    if (!materialCollectionDetailData?.data?.categories) return;

    const initialExpanded = {};

    materialCollectionDetailData.data.categories.forEach(category => {
      const categoryKey = `cat-${category.id}`;
      initialExpanded[categoryKey] = true;

      category.chapters?.forEach(chapter => {
        const chapterKey = `chap-${chapter.id}`;
        initialExpanded[chapterKey] = true;

        chapter.subchapters?.forEach(subchapter => {
          const subKey = `sub-${subchapter.id}`;
          initialExpanded[subKey] = true;
        });
      });
    });

    setExpanded(initialExpanded);
  }, []);

  const ExpandableHeader = ({ title, isExpanded, hasChildren, onPress }) => {
    return (
      <TouchableOpacity
        onPress={hasChildren ? onPress : undefined}
        activeOpacity={hasChildren ? 0.7 : 1}
        style={styles.categoryDetailButtonContainer}
      >
        <View style={styles.categoryDetailButtonChild}>
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
                                      // { marginRight: 13 },
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
                                      <TouchableOpacity
                                        style={styles.nextButtonContainer}
                                        onPress={() => {
                                          navigation.navigate(
                                            'StartMaterialDetailPage',
                                            {
                                              materialId: material.id,
                                              materialCollectionDetailData:
                                                materialCollectionDetailData,
                                            },
                                          );
                                        }}
                                      >
                                        <Ionicons
                                          name={'chevron-forward'}
                                          size={14}
                                          color={Colors.neutral500}
                                        />
                                      </TouchableOpacity>
                                    </View>
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
        title={materialCollectionDetailData.data.material_collection_name}
        showBack={false}
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
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <CategoriesDetail />
      </ScrollView>
      <View style={styles.bottomComponent}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => {
              setShowConfirmationGoBack(true);
            }}
            style={styles.exitButtonContainer}
          >
            <Text style={styles.exitButtonText}>Keluar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            disabled={
              materialCollectionDetailData.data.statistics.progress_percentage <
              100
            }
            style={
              materialCollectionDetailData.data.statistics.progress_percentage <
              100
                ? styles.disableDoneButtonContainer
                : styles.doneButtonContainer
            }
          >
            <Text style={styles.doneButtonText}>Selesai</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomModal
        visible={showConfirmationGoBack}
        onClose={() => setShowConfirmationGoBack(false)}
        enableScroll={false}
        withHeader={false}
      >
        <View style={bottomModalStyles.container}>
          <View style={bottomModalStyles.iconContainer}>
            <SimpleLineIcons
              name={'question'}
              size={40}
              color={Colors.warning500}
            />
          </View>
          <Text style={bottomModalStyles.titleText}>
            Keluar dari sesi belajar ?
          </Text>
          <Text style={bottomModalStyles.descText}>
            Progress belajarmu akan tersimpan otomatis dan bisa dilanjutkan
            kapan saja.
          </Text>
          <View style={bottomModalStyles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setShowConfirmationGoBack(false);
              }}
              style={styles.exitButtonContainer}
            >
              <Text style={styles.exitButtonText}>Batal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setShowConfirmationGoBack(false);
                navigation.goBack();
              }}
              style={styles.doneButtonContainer}
            >
              <Text style={styles.doneButtonText}>Keluar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomModal>
    </View>
  );
};

export default StartMaterialPage;

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
  categoryDetailButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: Colors.neutral200,
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  categoryDetailButtonChild: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
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
    width: '70%',
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
    width: 35,
    textAlign: 'center',
  },
  negativePercentageMaterialText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 16,
    width: 35,
    color: Colors.danger500,
    textAlign: 'center',
  },
  scrollViewContainer: {
    paddingTop: 16,
    flexGrow: 1,
    paddingBottom: 120,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
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
    alignItems: 'center',
    gap: 12,
  },
  exitButtonContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  exitButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  doneButtonContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.product900,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  disableDoneButtonContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: Colors.product300,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  doneButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
  },
  nextButtonContainer: {
    padding: 6,
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: Colors.neutral50,
    borderColor: Colors.neutral200,
  },
});

const bottomModalStyles = StyleSheet.create({
  container: {
    paddingTop: 32,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  iconContainer: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors.warning200,
    backgroundColor: Colors.warning50,
  },
  titleText: {
    fontFamily: Fonts.Medium,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.neutral900,
    marginTop: 20,
  },
  descText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
    marginTop: 6,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
  },
});
