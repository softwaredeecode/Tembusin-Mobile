import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AccountPage = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>THIS IS ACCOUNT PAGE</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',   // vertical center
    alignItems: 'center',       // horizontal center
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AccountPage;
