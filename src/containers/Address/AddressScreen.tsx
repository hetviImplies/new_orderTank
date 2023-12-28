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
import {useSelector} from 'react-redux';
import {useGetCompanyQuery} from '../../api/company';
import AddressComponent from '../../components/AddressComponent';
import {useGetCartsQuery} from '../../api/cart';

const AddressScreen = ({navigation, route}: any) => {
  const from = route?.params?.data?.from;
  const companyId = route?.params?.data?.companyId;
  const cartData = route?.params?.data?.cartData;
  const deliveryAdd = route?.params?.data.deliveryAdd;
  const billingAdd = route?.params?.data.billingAdd;
  const type = route?.params?.data?.type;
  const {
    data: carts,
    isFetching: isLoading,
    refetch,
  } = useGetCartsQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const {data, isFetching} = useGetCompanyQuery(userInfo?.companyId?._id, {
    refetchOnMountOrArgChange: true,
  });

  const [addressData, setAddressData] = useState<any>([]);
  const [checkedData, setCheckedData] = useState({});

  useEffect(() => {
    setCheckedData(type === 'Delivery address' ? deliveryAdd : billingAdd);
  }, [type]);

  useEffect(() => {
    setAddressData(data?.result?.address);
  }, [data, isFetching]);

  const handleCheck = (item: any) => {
    setCheckedData(item);
  };

  const continuePress = () => {
    navigation.navigate(RootScreens.SecureCheckout, {
      deliveryAdd: type === 'Delivery address' ? checkedData : deliveryAdd,
      billingAdd: type === 'Billing address' ? checkedData : billingAdd,
      data: cartData,
      companyId: companyId,
      from: RootScreens.Address
    });
  };

  const _renderItem = ({item, index}: any) => {
    console.log(
      'item === checkedData',
      item === checkedData,
      item,
      checkedData,
    );
    return (
      <CheckPreferenceItem
        radio={from === RootScreens.SecureCheckout ? true : false}
        listStyle={{
          ...commonStyle.shadowContainer,
          backgroundColor: colors.white,
          borderRadius: 10,
          marginVertical: hp(1),
          marginHorizontal: wp(0.5),
        }}
        key={index}
        children={
          <AddressComponent
            item={item}
            from={from}
            onEditPress={() =>
              navigation.navigate(RootScreens.AddAddress, {
                data: item,
                address: data?.result?.address,
              })
            }
          />
        }
        disabled={from === RootScreens.SecureCheckout ? false : true}
        handleCheck={() => handleCheck(item)}
        checked={item === checkedData}
      />
    );
  };

  return (
    <View style={commonStyle.container}>
      <Loader loading={isFetching} />
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
        <FlatList data={addressData} renderItem={_renderItem} />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate(RootScreens.AddAddress, {
              address: data?.result?.address,
            });
          }}
          style={styles.floatingButton}>
          <SvgIcons.Plus width={tabIcon} height={tabIcon} fill={colors.white} />
        </TouchableOpacity>
        {from === RootScreens.SecureCheckout ? (
          <Button
            onPress={continuePress}
            bgColor={'orange'}
            style={[styles.buttonStyle]}>
            <FontText name={'lexend-semibold'} size={fontSize} color={'white'}>
              {'Continue'}
            </FontText>
          </Button>
        ) : null}
      </View>
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
    width: '80%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp(15),
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
  childContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'red',
  },
});
