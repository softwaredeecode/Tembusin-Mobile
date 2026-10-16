import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  FlatList,
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Components
import MainHeader from '../../Components/MainHeader';
import ForumCardComponent from '../../Components/ForumCardComponent';
import ListEmptyComponent from '../../Components/ListEmptyComponents';

// Theme
import { Colors } from '../../Theme/Colors';
import { Fonts } from '../../Theme/Fonts';
import { BASE_URL } from '../../Api/GlobalUrl';

const MyPost = () => {
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigation = useNavigation();

  const fetchInitialData = async (userId, reset = false) => {
    if (loading) return;

    const currentOffset = reset ? 0 : offset;

    const url = `${BASE_URL}/users/${userId}/posts?limit=${limit}&offset=${currentOffset}`;

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('auth_token');

      console.log('📡 [FETCH POSTS] Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        const newPosts = json?.data || [];

        if (reset) {
          setPosts(newPosts);
        } else {
          setPosts(prev => [...prev, ...newPosts]);
        }

        setOffset(currentOffset + limit);

        if (newPosts.length < limit) {
          setHasMore(false);
        }
      } else {
        throw json;
      }
    } catch (error) {
      console.log('❌ [FETCH POSTS] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const storedData = await AsyncStorage.getItem('user_data');

      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);

        fetchInitialData(parsedData.id, true);
      }
    };

    init();
  }, []);

  console.log('userData: ', userData);

  const renderForumItem = useCallback(
    ({ item }) => <ForumCardComponent item={item} navigation={navigation} />,
    [],
  );

  return (
    <View>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />

      <MainHeader title={'Postingan Saya'} />
      <View style={styles.body}>
        <FlatList
          data={posts}
          keyExtractor={item => item.id.toString()}
          renderItem={renderForumItem}
          contentContainerStyle={{ paddingBottom: 120 }}
          onEndReached={() => {
            if (hasMore && !loading && userData) {
              fetchInitialData(userData.id);
            }
          }}
          ListEmptyComponent={
            !loading ? (
              <ListEmptyComponent
                title={'Belum ada postingan yang tersedia'}
                desc={
                  'Postingan belum tersedia untuk saat ini. Silakan cek kembali di lain waktu'
                }
                iconName={'message'}
              />
            ) : null
          }
          onEndReachedThreshold={0.5}
        />
      </View>
    </View>
  );
};

export default MyPost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral50,
  },
  body: {
    // paddingTop: 16,
    paddingHorizontal: 16,
  },
});
