import { StyleSheet, Text, View, StatusBar, Dimensions } from 'react-native';
import React from 'react';
import Pdf from 'react-native-pdf';

// components
import MainHeader from '../../../Components/MainHeader';

//theme
import { Colors } from '../../../Theme/Colors';

const ExerciseGuidelinePage = ({ route }) => {
  const { pdfUrl } = route.params;
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor={Colors.white}
        barStyle="dark-content"
      />
      <MainHeader title="Buku Panduan" />
      <Pdf
        source={{ uri: pdfUrl, cache: true }}
        style={styles.pdf}
        trustAllCerts={false}
      />
    </View>
  );
};

export default ExerciseGuidelinePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
});
