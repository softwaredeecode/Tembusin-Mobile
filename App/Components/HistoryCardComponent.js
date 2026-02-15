import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors } from '../Theme/Colors';
import { formatDate } from '../Utils/Helper';
import { rupiahFormat } from '../Utils/Helper';
import { Fonts } from '../Theme/Fonts';

const HistoryCardComponent = ({ item, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.child}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name="crown-outline"
            size={20}
            color={Colors.product900}
          />
        </View>
        <View>
          <Text style={styles.titleText}>{item.product.product_name}</Text>
          <Text style={styles.productCateText}>
            {item.product.product_category}
          </Text>
        </View>
      </View>
      <View style={styles.childSecond}>
        <Text style={styles.productCateText}>{formatDate(item.date)}</Text>
        <Text style={styles.amountText}>{rupiahFormat(item.amount)}</Text>
      </View>
    </View>
  );
};

export default HistoryCardComponent;

const styles = StyleSheet.create({
  container: {
    // padding: 12,
    borderWidth: 1,
    borderColor: Colors.neutral200,
    marginTop: 12,
    borderRadius: 8,
  },
  iconContainer: {
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.product200,
    backgroundColor: Colors.product50,
    borderRadius: 6,
  },
  child: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral200,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center'
  },
  childSecond: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  productCateText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
  amountText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
});
