import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

//theme
import { Colors } from '../Theme/Colors';
import { Fonts } from '../Theme/Fonts';

//helper
import { rupiahFormat } from '../Utils/Helper';

const ProductTokenCardComponent = ({ item, navigation }) => {
  return (
    <View style={styles.packageProductContainer}>
      <View style={styles.packageProductInfoContainer}>
        <View style={styles.row}>
          <Text style={styles.productPackageTitleText}>
            {item.product_name}
          </Text>
          <View style={styles.packageCategoryContainer}>
            <Text style={styles.packageCategoryText}>
              {item.product_category.category_name}
            </Text>
          </View>
        </View>
        <View style={styles.descContainer}>
          <View style={[styles.row, { marginTop: 8 }]}>
            <View style={styles.checkIconContainer}>
              <FontAwesome name={'money'} size={14} color={Colors.neutral500} />
            </View>
            <Text style={styles.amountText}>{item?.token_amount} Token</Text>
          </View>
        </View>
      </View>
      <View style={styles.packageProductPriceContainer}>
        <View style={[styles.row, { gap: 6, alignItems: 'center' }]}>
          {item.discount_percentage > 0 ? (
            <>
              {/* Harga setelah diskon */}
              <Text style={styles.priceAfterDisc}>
                {rupiahFormat(item.final_price)}
              </Text>

              {/* Harga normal tercoret */}
              <Text style={styles.normalPrice}>{rupiahFormat(item.price)}</Text>

              {/* Persentase diskon */}
              <View style={styles.discountContainer}>
                <Text style={styles.discountText}>
                  {item.discount_percentage}%
                </Text>
              </View>
            </>
          ) : (
            <>
              {/* Hanya harga normal */}
              <Text style={styles.normalPriceWithoutDisc}>
                {rupiahFormat(item.price)}
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default ProductTokenCardComponent;

const styles = StyleSheet.create({
  packageProductContainer: {
    marginTop: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.neutral200,
  },
  packageProductInfoContainer: {
    padding: 12,
    borderBottomColor: Colors.neutral200,
    borderBottomWidth: 1,
  },
  productPackageTitleText: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
    flex: 1,
  },
  packageCategoryContainer: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: Colors.warning200,
    backgroundColor: Colors.warning50,
    borderRadius: 4,
  },
  packageCategoryText: {
    fontFamily: Fonts.Medium,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.warning500,
  },
  descContainer: {
    marginTop: 4,
  },
  checkIconContainer: {
    padding: 2,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: Colors.neutral200,
    backgroundColor: Colors.neutral50,
    marginRight: 6,
  },
  packageProductPriceContainer: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 12,
  },
  priceToken: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  priceAfterDisc: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  normalPrice: {
    fontFamily: Fonts.Medium,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral500,
    textDecorationLine: 'line-through',
  },
  discountContainer: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: Colors.danger200,
    backgroundColor: Colors.danger50,
    borderRadius: 4,
  },
  discountText: {
    fontFamily: Fonts.SemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.danger500,
  },
  normalPriceWithoutDisc: {
    fontFamily: Fonts.SemiBold,
    fontSize: 14,
    lineHeight: 18,
    color: Colors.neutral900,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountText: {
    fontFamily: Fonts.Regular,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.neutral500,
  },
});
