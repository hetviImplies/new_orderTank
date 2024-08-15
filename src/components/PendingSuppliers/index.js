import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import commonStyle, {iconSize, smallFont, fontSize} from '../../styles';
import { Button, FontText } from '..';
import { hp, normalize, wp } from '../../styles/responsiveScreen';
import { colors, Images } from '../../assets';
import { RootScreens } from '../../types/type';
const PendingSuppliers = ({item,disable,navigation}) => {
  return (
    <TouchableOpacity
    disabled={disable}
    onPress={() =>
          navigation.navigate(RootScreens.ProductListing, {
            id: item?.company?.id,
            company: item?.company?.companyName,
          })
        }
        key={item?.id}>
        <View style={styles.itemContainer}>
        <View style={commonStyle.rowAC}>
          {item?.company?.logo ? (
            <Image source={{uri: item?.company?.logo}} style={styles.logo} />
          ) : (
            <Image source={Images.supplierImg} style={styles.logo} />
          )}
          <View style={{width: wp(45)}}>
            <FontText
              name={'mont-semibold'}
              size={smallFont}
              color={'black2'}
              textAlign={'left'}>
              {item?.company?.companyName}
            </FontText>
            <FontText
              name={'mont-medium'}
              size={smallFont}
              color={'darkGray'}
              pTop={wp(2)}
              textAlign={'left'}>
              {item?.company?.companyCode}
            </FontText>
          </View>
        </View>
        {disable ? <Button disabled bgColor={'yellow1'} style={styles.buttonContainer}>
          <FontText name={'mont-bold'} size={smallFont} color={'yellow2'}>
            {'Pending'}
          </FontText>
        </Button> : null}
        </View>
      </TouchableOpacity>
  )
}

export default PendingSuppliers

const styles = StyleSheet.create({
    itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    backgroundColor: colors.orange2,
    borderRadius: normalize(10),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.orange,
  },
  logo: {
    width: hp(6.5),
    height: hp(6.5),
    resizeMode: 'cover',
    borderRadius: normalize(5),
    marginRight: wp(3),
    borderWidth: 0.2,
    borderColor: colors.black2,
  },
  buttonContainer: {
    borderRadius: 5,
    height: hp(3.5),
    width: wp(20),
  },
})