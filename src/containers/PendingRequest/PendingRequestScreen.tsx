import {
  FlatList,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../assets/colors';
import {NavigationBar, FontText, Button, Loader} from '../../components';
import commonStyle, {
  fontSize,
  smallFont,
  mediumFont,
} from '../../styles';
import {wp, hp, normalize} from '../../styles/responsiveScreen';
import {useGetSupplierQuery} from '../../api/company';
import Images from '../../assets/images';

const PendingRequestScreen = ({navigation}: any) => {
  const {data: supplierList, isFetching: isProcessing} = useGetSupplierQuery(
    {status: 'pending'},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const _renderItem = ({item, index}: any) => {
    return (
      <View style={[styles.itemContainer, commonStyle.shadowContainer]}>
        <View style={commonStyle.rowAC}>
          {item?.logo ? (
            <Image source={{uri: item?.logo}} style={styles.logo} />
          ) : (
            <Image source={Images.supplierImg} style={styles.logo} />
          )}
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
          <FontText name={'lexend-regular'} size={smallFont} color={'white'}>
            {'Pending'}
          </FontText>
        </Button>
      </View>
    );
  };

  return (
    <View style={commonStyle.container}>
      {/* <NavigationBar
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
      /> */}
      <Loader loading={isProcessing} />
      {supplierList &&
      supplierList?.result &&
      supplierList?.result?.length === 0 ? (
        <View style={commonStyle.flexJC}>
          <FontText
            name={'lexend-regular'}
            size={mediumFont}
            color={'gray'}
            textAlign={'center'}>
            {'No Pending request available.'}
          </FontText>
        </View>
      ) : (
        <FlatList
          data={supplierList?.result}
          renderItem={_renderItem}
          contentContainerStyle={styles.containerContent}
        />
      )}
    </View>
  );
};

export default PendingRequestScreen;

const styles = StyleSheet.create({
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
    borderRadius: normalize(10),
    height: hp(3.5),
    width: '25%',
  },
  containerContent: {
    paddingTop: hp(0.5),
    paddingHorizontal: wp(5),
    marginTop: hp(2),
  },
});
