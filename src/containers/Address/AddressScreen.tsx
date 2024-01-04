import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import commonStyle, {fontSize, mediumLargeFont, tabIcon} from '../../styles';
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
import {useGetCompanyQuery, useRemoveAddressMutation} from '../../api/company';
import AddressComponent from '../../components/AddressComponent';
import utils from '../../helper/utils';

const AddressScreen = ({navigation, route}: any) => {
  const from = route?.params?.data?.from;
  // const companyId = route?.params?.data?.companyId;
  const cartData = route?.params?.data?.cartData;
  const deliveryAdd = route?.params?.data.deliveryAdd;
  const billingAdd = route?.params?.data.billingAdd;
  const type = route?.params?.data?.type;
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const {data, isFetching} = useGetCompanyQuery(userInfo?.companyId?._id, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteAddress, {isLoading}] = useRemoveAddressMutation();

  const [addressData, setAddressData] = useState<any>([]);
  const [checkedData, setCheckedData] = useState<any>({});

  useEffect(() => {
    setCheckedData(type === 'Delivery address' ? deliveryAdd : billingAdd);
  }, [type]);

  console.log('type: ', addressData, checkedData);

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
      // companyId: companyId,
      from: RootScreens.Address,
      name: 'Place Order'
    });
  };

  const onAddressDelete = async (item: any) => {
    let params = {
      companyId: userInfo?.companyId?._id,
      addressId: item._id,
    };
    const {data, error}: any = await deleteAddress(params);
    if (!error && data?.statusCode === 200) {
      utils.showSuccessToast(data.message);
    } else {
      utils.showErrorToast(error.message);
    }
  };

  const _renderItem = ({item, index}: any) => {
    console.log('item?._id === checkedData?._id',item?._id , checkedData?._id)
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
            onDeletePress={() => onAddressDelete(item)}
          />
        }
        disabled={from === RootScreens.SecureCheckout ? false : true}
        handleCheck={() => handleCheck(item)}
        checked={item?._id === checkedData?._id}
      />
    );
  };

  return (
    <View style={commonStyle.container}>
      <Loader loading={isFetching || isLoading} />
      {/* <NavigationBar
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
      /> */}
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
  buttonStyle: {
    borderRadius: 12,
    width: '100%',
    alignSelf: 'center',
    marginBottom: hp(3),
    // position: 'absolute',
    // bottom: hp(15),
  },
  floatingButton: {
    width: hp(6),
    height: hp(6),
    borderRadius: hp(3),
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginBottom: hp(3),
    // marginTop:hp(3),
    // position: 'absolute',
    // bottom: wp(25),
    // right: wp(5),
  },
});
