import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import SvgIcons from '../../assets/SvgIcons';
import colors from '../../assets/colors';
import {NavigationBar, FontText, Input, Button, Loader} from '../../components';
import commonStyle, {
  mediumLargeFont,
  tabIcon,
  fontSize,
  iconSize,
  smallFont,
  mediumFont,
} from '../../styles';
import {wp, hp, normalize} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import {useGetSupplierQuery} from '../../api/company';

const PendingRequestScreen = ({navigation}: any) => {
  const {data: supplierList, isFetching: isProcessing} = useGetSupplierQuery(
    {status: 'pending'},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const _renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        style={[styles.itemContainer, commonStyle.shadowContainer]}>
        <View style={commonStyle.rowAC}>
          <Image source={{uri: item?.logo}} style={styles.logo} />
          <View>
            <FontText
              name={'lexend-regular'}
              size={fontSize}
              color={'black'}
              textAlign={'left'}>
              {item?.companyName}
            </FontText>
            <FontText
              name={'lexend-regular'}
              size={smallFont}
              color={'gray'}
              pTop={wp(2)}
              textAlign={'left'}>
              {item?.companyCode}
            </FontText>
          </View>
        </View>
        <Button disabled bgColor={'green'} style={styles.buttonContainer}>
          <FontText name={'lexend-regular'} size={normalize(9)} color={'white'}>
            {'Pending'}
          </FontText>
        </Button>
      </TouchableOpacity>
    );
  };

  return (
    <View style={commonStyle.container}>
      <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2.5)}}
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
              {'Pending request'}
            </FontText>
          </View>
        }
      />
      <Loader loading={isProcessing}/>
      {supplierList &&
        supplierList?.result &&
        supplierList?.result?.length > 0 ? (
          <FlatList
            data={supplierList?.result}
            renderItem={_renderItem}
            contentContainerStyle={styles.containerContent}
          />
        ) : (
          <View style={commonStyle.flexJC}>
            <FontText
              name={'lexend-regular'}
              size={mediumFont}
              color={'gray3'}
              textAlign={'center'}>
              {'No Result Found.'}
            </FontText>
          </View>
        )}
    </View>
  );
};

export default PendingRequestScreen;

const styles = StyleSheet.create({
  inputText: {
    borderRadius: normalize(10),
    paddingLeft: wp(10),
    color: colors.black2,
    fontSize: normalize(12),
    fontFamily: 'lexend-regular',
    backgroundColor: colors.white2,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    height: hp(6),
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: colors.white,
    borderRadius: normalize(6),
    marginBottom: hp(2),
  },
  logo: {
    width: hp(6.5),
    height: hp(6.5),
    resizeMode: 'cover',
    borderRadius: normalize(5),
    marginRight: wp(3),
  },
  buttonContainer: {
    borderRadius: normalize(8),
    height: hp(3),
  },
  containerContent: {
    paddingTop: hp(0.5),
    paddingHorizontal: wp(5),
    marginTop: hp(2),
  },
});
