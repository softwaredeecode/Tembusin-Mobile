import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

//redux
import { useSelector } from 'react-redux';

//theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';

// components
import AuthenticatedHeader from '../../Components/AuthenticatedHeader';

//helper
import { getInitial } from '../../Utils/Helper';

const AccountPage = () => {
  const { loginResponse } = useSelector(state => state.login);

  const MenuItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.menuItem}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons
          name={icon}
          size={20}
          color={Colors.neutral900}
        />
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={Colors.neutral500}
      />
    </TouchableOpacity>
  );

  const Separator = () => <View style={styles.separatorMenu} />;

  return (
    <View style={styles.container}>
      <View style={styles.backgroundHeader}></View>
      <ScrollView style={styles.bodyContainer}>
        <View style={styles.profileInfoContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.profileInitialContainer}>
              <Text style={styles.initialText}>
                {getInitial(loginResponse.data.user.username)}
              </Text>
            </View>
            <View>
              <View style={styles.row}>
                <Text style={styles.profileNameText}>
                  {loginResponse.data.user.username}
                </Text>
                <View style={styles.iconNameContainer}>
                  <MaterialCommunityIcons
                    name="crown-outline"
                    size={16}
                    color={Colors.product700}
                  />
                </View>
              </View>
              <Text style={styles.emailText}>
                {loginResponse.data.user.email}
              </Text>
            </View>
          </View>
          <View style={styles.detailProfileContainer}>
            <View style={styles.detailProfileChildContainer}>
              <Text>4</Text>
              <Text>Postingan</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailProfileChildContainer}>
              <Text>234</Text>
              <Text>Likes</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.detailProfileChildContainer}>
              <Text>12</Text>
              <Text>Pengikut</Text>
            </View>
          </View>
          <View style={styles.badgeContainer}>
            <View style={[styles.badgeChildContainer, styles.row]}>
              <MaterialCommunityIcons
                name="crown-outline"
                size={14}
                color={Colors.product700}
              />
              <Text style={[styles.badgeText, { marginLeft: 4 }]}>Juara</Text>
            </View>
            <View style={styles.badgeChildContainer}>
              <Text style={styles.badgeText}>Student</Text>
            </View>
            <View style={styles.badgeChildContainer}>
              <Text style={styles.badgeText}>SNBT</Text>
            </View>
          </View>
        </View>
        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Akun</Text>

          <MenuItem icon="person-outline" label="Ubah profil" />
          <Separator />
          <MenuItem icon="chatbubble-ellipses-outline" label="Postingan saya" />
          <Separator />
          <MenuItem icon="download-outline" label="Unduhan saya" />
          <Separator />
          <MenuItem icon="time-outline" label="Riwayat transaksi" />
          <Separator />
          <MenuItem icon="people-outline" label="Kode referral" />
          <Separator />
          <MenuItem
            icon="checkmark-done-circle-outline"
            label="Evaluasi hasil try out"
          />
          <Separator />

          <Text style={[styles.sectionTitle]}>Privasi</Text>

          <MenuItem icon="key-outline" label="Ganti password" />
          <Separator />
          <MenuItem icon="shield-checkmark-outline" label="Kebijakan privasi" />
          <Separator />
          <MenuItem
            icon="information-circle-outline"
            label="Syarat dan ketentuan"
          />
        </View>

        <TouchableOpacity style={styles.logoutContainer}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger500} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default AccountPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  backgroundHeader: {
    backgroundColor: Colors.product900,
    height: 150,
  },
  bodyContainer: {
    marginTop: -134,
    paddingHorizontal: 16,
    marginBottom: 75,
  },
  infoContainer: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    gap: 8,
  },
  profileInitialContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.yellow,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfoContainer: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    borderRadius: 6,
  },
  initialText: {
    fontFamily: Fonts.Bold,
    fontSize: 24,
    lineHeight: 32,
    color: Colors.white,
  },
  profileNameText: {
    fontFamily: Fonts.Medium,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.neutral900,
  },
  emailText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconNameContainer: {
    padding: 1,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    marginLeft: 4,
  },
  detailProfileContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
    gap: 8,
    justifyContent: 'space-evenly',
  },
  detailProfileChildContainer: {
    alignItems: 'center',
  },
  separator: {
    width: 1,
    height: 42,
    backgroundColor: Colors.neutral200,
  },
  badgeContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    alignItems: 'center',
  },
  badgeChildContainer: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 4,
  },
  badgeText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.product900,
  },
  menuContainer: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral200,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.neutral200,
  },

  sectionTitle: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
    paddingTop: 12,
    paddingHorizontal: 12,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
  },

  menuLabel: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 8,
    color: Colors.neutral900,
  },

  separatorMenu: {
    height: 1,
    backgroundColor: Colors.neutral200,
    marginHorizontal: 12,
  },

  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 12,
    paddingBottom: 30,
  },

  logoutText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 6,
    color: Colors.danger500,
  },
});
