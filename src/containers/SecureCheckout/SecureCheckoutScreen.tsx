import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import SvgIcons from '../../assets/SvgIcons';
import {NavigationBar, FontText, Loader} from '../../components';
import commonStyle, {
  fontSize,
  iconSize,
  largeFont,
  mediumFont,
  mediumLarge1Font,
  mediumLargeFont,
  smallFont,
  tabIcon,
} from '../../styles';
import {normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';

const SecureCheckoutScreen = ({navigation}: any) => {
  return (
    <View style={commonStyle.container}>
      <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2)}}
        borderBottomWidth={0}
        leftStyle={{width: '100%'}}
        left={
          <View style={[commonStyle.rowAC]}>
            <TouchableOpacity
              style={[commonStyle.iconView, {marginRight: wp(5)}]}
              onPress={() => navigation.goBack()}>
              <SvgIcons.BackArrow width={tabIcon} height={tabIcon} />
            </TouchableOpacity>
            <FontText
              name={'lexend-semibold'}
              size={mediumLargeFont}
              color={'black'}
              textAlign={'left'}>
              {'Secure Checkout'}
            </FontText>
          </View>
        }
      />
      {/* <Loader loading={isFetching || isLoad || isFetch} /> */}
      <View style={commonStyle.paddingH4}>
        <View style={styles.addressContainer}>
          <View style={[commonStyle.rowJB, {marginBottom: wp(1.5)}]}>
            <View style={commonStyle.rowAC}>
              <SvgIcons.Employee
                width={iconSize}
                height={iconSize}
                fill={colors.orange}
              />
              <FontText
                name={'lexend-regular'}
                size={smallFont}
                color={'orange'}
                pLeft={wp(2)}>
                {'Delivery address'}
              </FontText>
            </View>
            <SvgIcons.Edit
              width={iconSize}
              height={iconSize}
              fill={colors.orange}
            />
          </View>
          <View style={[commonStyle.rowAC, {marginBottom: wp(1.5)}]}>
            <SvgIcons.Employee width={iconSize} height={iconSize} />
            <FontText
              name={'lexend-regular'}
              size={smallFont}
              color={'black2'}
              pLeft={wp(2)}>
              {'Comapny'}
            </FontText>
          </View>
          <FontText
            name={'lexend-regular'}
            size={smallFont}
            color={'brown'}
            pLeft={wp(1)}
            pBottom={wp(2)}>
            {
              'Shop No 1,28/c, Shanti Sadan, Lokhandwala Rd, Nr Sasural Restaurant, Bangalore-560016'
            }
          </FontText>
        </View>
      </View>
    </View>
  );
};

export default SecureCheckoutScreen;

const styles = StyleSheet.create({
  addressContainer: {
    padding: wp(2),
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: normalize(8),
  },
});
