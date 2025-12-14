import React from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  Image,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import RenderHtml from 'react-native-render-html';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// components
import MainHeader from '../../../Components/MainHeader';

//theme
import { Colors } from '../../../Theme/Colors';
import { Fonts } from '../../../Theme/Fonts';

const DetailStartExercises = props => {
  const { width } = useWindowDimensions();
  const params = props.route.params;
  const selectedItem = params.selectedItem;
  const isSeperateBuy = selectedItem.seperateBuy;

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />
      <MainHeader title={'Detail Latihan Soal'} />
      <ScrollView style={styles.bodyContainer}>
        <View style={styles.selectedItemContainer}>
          <Image
            source={require('../../../Assets/Images/dummyHome.png')}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{selectedItem?.materialTitle}</Text>
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryText}>{selectedItem?.category}</Text>
            </View>
          </View>
          <View style={styles.dateContainer}>
            <View style={styles.dateIconContainer}>
              <MaterialCommunityIcons
                name={'calendar-blank'}
                size={12}
                color={Colors.neutral500}
              />
            </View>
            <Text style={styles.dateText}>{selectedItem?.date}</Text>
          </View>
          {selectedItem.desc !== '' && (
            <View style={styles.descContainer}>
              <View style={styles.dateIconContainer}>
                <MaterialCommunityIcons
                  name="crown-outline"
                  size={12}
                  color={Colors.neutral500}
                />
              </View>
              <RenderHtml
                contentWidth={width}
                source={{ html: selectedItem.desc }}
                tagsStyles={{
                  b: { fontWeight: 'bold' },
                }}
                baseStyle={styles.dateText}
              />
            </View>
          )}
          {isSeperateBuy && (
            <View style={styles.descContainer}>
              <View style={styles.dateIconContainer}>
                <FontAwesome
                  name={'money'}
                  size={10}
                  color={Colors.neutral500}
                />
              </View>
              <RenderHtml
                contentWidth={width}
                source={{ html: 'Dibeli terpisah' }}
                tagsStyles={{
                  b: { fontWeight: 'bold' },
                }}
                baseStyle={styles.dateText}
              />
            </View>
          )}
        </View>
        <View style={styles.countDetailContainer}>
          <View style={[styles.countContainer, { width: width / 3.5 }]}>
            <View style={styles.countIconContainer}>
              <MaterialCommunityIcons
                name={'folder-outline'}
                size={20}
                color={Colors.product900}
              />
            </View>
            <Text style={styles.countTitleText}>
              {selectedItem.categoryCount} Kategori
            </Text>
            <Text style={styles.countText}>Kategori</Text>
          </View>
          <View style={[styles.countContainer, { width: width / 3.5 }]}>
            <View style={styles.countIconContainer}>
              <MaterialCommunityIcons
                name={'progress-question'}
                size={20}
                color={Colors.product900}
              />
            </View>
            <Text style={styles.countTitleText}>
              {selectedItem.question} Soal
            </Text>
            <Text style={styles.countText}>Jumlah Soal</Text>
          </View>
          <View style={[styles.countContainer, { width: width / 3.5 }]}>
            <View style={styles.countIconContainer}>
              <MaterialCommunityIcons
                name={'alarm'}
                size={20}
                color={Colors.product900}
              />
            </View>
            <Text style={styles.countTitleText}>{selectedItem.time} Menit</Text>
            <Text style={styles.countText}>Durasi</Text>
          </View>
        </View>
        <View style={styles.resourceContainer}>
          <Text style={styles.resourceTitleText}>Resource</Text>
          <View style={styles.resourceChildContainer}>
            <View style={styles.resourceTitleContainer}>
              <View style={styles.resourceIconContainer}>
                <MaterialCommunityIcons
                  name={'file-outline'}
                  size={20}
                  color={Colors.neutral500}
                />
              </View>
              <View style={styles.resourceDescContainer}>
                <Text style={styles.resourceTitleText}>Buku Panduan</Text>
                <Text style={styles.resourceDescText}>
                  Pelajari langkah lengkap dan strategi pengerjaan latihan.
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.resourceButtonContainer}>
              <Text style={styles.resourceButtonText}>Baca</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.resourceChildContainer}>
            <View style={styles.resourceTitleContainer}>
              <View style={styles.resourceIconContainer}>
                <MaterialCommunityIcons
                  name={'image-outline'}
                  size={20}
                  color={Colors.neutral500}
                />
              </View>
              <View style={styles.resourceDescContainer}>
                <Text style={styles.resourceTitleText}>Twibbon</Text>
                <Text style={styles.resourceDescText}>
                  Bagikan proses belajarmu dengan twibbon.
                </Text>
              </View>
            </View>
            <View style={styles.multiButtonContainer}>
              <TouchableOpacity
                style={[styles.resourceButtonContainer, { width: 36 }]}
              >
                <MaterialCommunityIcons
                  name={'download'}
                  size={20}
                  color={Colors.neutral500}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.resourceButtonContainer}>
                <Text style={styles.resourceButtonText}>Lihat</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.resourceChildContainer}>
            <View style={styles.resourceTitleContainer}>
              <View style={styles.resourceIconContainer}>
                <MaterialCommunityIcons
                  name={'account-multiple-outline'}
                  size={20}
                  color={Colors.neutral500}
                />
              </View>
              <View style={styles.resourceDescContainer}>
                <Text style={styles.resourceTitleText}>Grup Belajar</Text>
                <Text style={styles.resourceDescText}>
                  Gabung ke grup WhatsApp atau Telegram untuk berdiskusi dan
                  berbagi tips.
                </Text>
              </View>
            </View>
            <View style={styles.multiButtonContainer}>
              <TouchableOpacity style={styles.resourceButtonContainer}>
                <Text style={styles.resourceButtonText}>Telegram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resourceButtonContainer}>
                <Text style={styles.resourceButtonText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomComponent}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.joinMemberContainer}>
            <Text style={styles.joinMemberText}>Mulai</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DetailStartExercises;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  bodyContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    marginBottom: 120,
  },
  selectedItemContainer: {
    padding: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  image: {
    width: '100%',
    borderRadius: 8,
  },
  titleContainer: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.product900,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  dateIconContainer: {
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    borderRadius: 6,
  },
  dateText: {
    fontFamily: Fonts.Regular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral500,
  },
  descContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  countDetailContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  countContainer: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  countIconContainer: {
    padding: 6,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 6,
  },
  countTitleText: {
    marginTop: 10,
    marginBottom: 2,
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  countText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
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
  buyDescText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
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
  seperateBuyContainer: {
    marginTop: 10,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceToken: {
    fontFamily: Fonts.SemiBold,
    fontSize: 20,
    lineHeight: 24,
    color: Colors.neutral900,
  },
  otherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'space-between',
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
  freeText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 20,
    lineHeight: 24,
    color: Colors.success500,
  },
  resourceContainer: {
    marginTop: 10,
    marginHorizontal: 16,
  },
  resourceTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.neutral500,
  },
  resourceChildContainer: {
    borderWidth: 1,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.white,
    marginTop: 10,
    borderRadius: 8,
  },
  resourceTitleContainer: {
    paddingVertical: 8,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
  },
  resourceIconContainer: {
    padding: 6,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    marginLeft: 12,
  },
  resourceTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  resourceDescText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  resourceDescContainer: {
    flex: 1,
    flexShrink: 1,
    marginRight: 12,
  },
  resourceButtonContainer: {
    marginVertical: 8,
    marginRight: 12,
    paddingVertical: 6,
    width: 100,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  resourceButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.neutral900,
  },
  multiButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
