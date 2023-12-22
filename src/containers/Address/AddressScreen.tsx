import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import commonStyle, {
  fontSize,
  iconSize,
  mediumFont,
  mediumLargeFont,
  smallFont,
  tabIcon,
} from '../../styles';
import {
  Button,
  CheckPreferenceItem,
  FontText,
  Loader,
  NavigationBar,
} from '../../components';
import SvgIcons from '../../assets/SvgIcons';
import {hp, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import {RootScreens} from '../../types/type';
import {useGetAddressQuery} from '../../api/address';

const AddressScreen = ({navigation, route}: any) => {
  const from = route?.params?.data?.from;
  const address = route?.params?.data?.address;
  const {data, isFetching: isProcessing} = useGetAddressQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const [addressData, setAddressData] = useState<any>([]);
  const [checkedData, setCheckedData] = useState(
    address !== undefined ? address : {},
  );

  useEffect(() => {
    setAddressData(data?.result?.data);
  }, [data, isProcessing]);

  const handleCheck = (item: any) => {
    setCheckedData(item);
  };

  const continuePress = () => {
    navigation.navigate(RootScreens.OrderSummary, {
      addressData: checkedData,
      orderData: route?.params?.data?.order,
    });
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <CheckPreferenceItem
        radio={from === 'OrderSummary' ? true : false}
        listStyle={{
          ...commonStyle.shadowContainer,
          backgroundColor: colors.white,
          borderRadius: 10,
          marginVertical: hp(1),
          marginHorizontal: wp(0.5),
        }}
        key={index}
        children={
          <View style={{flex: 1}}>
            <View style={[commonStyle.rowAC, {marginBottom: wp(1)}]}>
              {item?.addressType === 'Office' ? (
                <SvgIcons.Employee
                  width={tabIcon}
                  height={tabIcon}
                  fill={colors.orange}
                />
              ) : (
                <SvgIcons.Employee
                  width={iconSize}
                  height={iconSize}
                  fill={colors.orange}
                />
              )}
              <FontText
                name={'opensans-semibold'}
                size={mediumFont}
                color={'black2'}
                pLeft={wp(2)}>
                {item?.addressType}
              </FontText>
            </View>
            <FontText
              name={'opensans-bold'}
              size={smallFont}
              color={'brown'}
              pLeft={wp(1)}
              pBottom={wp(2)}>
              {item?.fullName}
            </FontText>
            <FontText
              name={'opensans-medium'}
              size={smallFont}
              pLeft={wp(1)}
              pBottom={wp(2)}
              color={'black2'}>
              {item?.address}
            </FontText>
            <FontText
              name={'opensans-medium'}
              size={smallFont}
              pLeft={wp(1)}
              color={'black2'}>
              {item?.phone}
            </FontText>
          </View>
        }
        disabled={from === 'OrderSummary' ? false : true}
        handleCheck={() => handleCheck(item)}
        checked={item === checkedData}
      />
    );
  };

  return (
    <View style={commonStyle.container}>
      <Loader loading={isProcessing} />
      <NavigationBar
        hasCenter
        hasLeft
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
              {'My Address'}
            </FontText>
          </View>
        }
        leftStyle={{width: '100%'}}
        hasRight
        style={{marginHorizontal: wp(2.5)}}
        borderBottomWidth={0}
      />
      <View style={[commonStyle.paddingH4, commonStyle.flex]}>
        <FlatList data={[1, 2]} renderItem={_renderItem} />
        <TouchableOpacity onPress={() => {}} style={styles.floatingButton}>
          <SvgIcons.Plus width={tabIcon} height={tabIcon} fill={colors.white} />
        </TouchableOpacity>
      </View>
      {from === 'OrderSummary' ? (
        <Button
          onPress={continuePress}
          bgColor={'brown'}
          style={[styles.buttonStyle]}>
          <FontText name={'opensans-semibold'} size={fontSize} color={'white'}>
            {'Continue'}
          </FontText>
        </Button>
      ) : null}
    </View>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    width: '100%',
    alignSelf: 'center',
    height: hp(6),
    marginBottom: hp(2),
  },
  itemContainer: {
    backgroundColor: colors.white,
    borderRadius: 10,
    marginTop: hp(2),
    padding: wp(2),
    marginHorizontal: wp(0.5),
    marginBottom: hp(0.5),
  },
  buttonStyle: {
    borderRadius: 12,
    width: '65%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp(4),
  },
  floatingButton: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: wp(7),
    right: wp(5),
  },
});
