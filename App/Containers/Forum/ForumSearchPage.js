import { StyleSheet, Text, View, StatusBar } from 'react-native';
import React from 'react';

import SearchHeader from '../../Components/SearchHeader';

import { Colors } from '../../Theme/Colors';

const ForumSearchPage = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />
      <SearchHeader  />
    </View>
  );
};

export default ForumSearchPage;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.neutral50 },
});
