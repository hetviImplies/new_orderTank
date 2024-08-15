import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { colors, SvgIcons } from '../../assets'
import commonStyle, {
    fontSize,
    iconSize,
    largeFont,
    mediumFont,
    mediumLarge2Font,
    mediumLargeFont,
    smallFont,
    tabIcon,
  } from '../../styles';
import { hp, normalize, wp } from '../../styles/responsiveScreen';
import { FontText } from '..';
const _IncrementDecrementModule = ({cartItems,handleDecrement,handleIncrement,productDetail,from}) => {
  return (
    <View style={[commonStyle.rowAC, styles.countContainer]}>
    <TouchableOpacity
      style={{flex: 0.3}}
      onPress={() => handleDecrement(productDetail?.id)}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.white,
            borderColor: colors.tabGray,
          },
        ]}>
        <SvgIcons.Remove
          width={wp(2)}
          height={wp(2)}
          fill={colors.black}
        />
      </View>
    </TouchableOpacity>
    <FontText
      color="black2"
      name="mont-semibold"
      size={smallFont}
      style={{flex: 0.45}}
      textAlign={'center'}>
      {
        from==='cart'? cartItems.quantity :
        cartItems?.find(
          (itm: any) =>
            itm?.product?.id.toString() ===
            productDetail?.id.toString(),
        )?.quantity
      }
    </FontText>
    <TouchableOpacity
      style={{flex: 0.3, alignItems: 'flex-end'}}
      onPress={() => handleIncrement(productDetail?.id)}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: colors.black,
          },
        ]}>
        <SvgIcons.Plus
          width={wp(2)}
          height={wp(2)}
          fill={colors.white}
        />
      </View>
    </TouchableOpacity>
  </View>
  )
}

export default _IncrementDecrementModule

const styles = StyleSheet.create({
    countContainer: {
    justifyContent: 'space-between',
    width: wp(21),
    // padding: wp(1.2)
    marginBottom:wp(1.2)
  }, iconContainer: {
    width: hp(2.8),
    height: hp(2.8),
    borderRadius: normalize(50),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
})