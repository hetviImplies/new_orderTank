import {
  Alert,
  BackHandler,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {
  Button,
  CheckPreferenceItem,
  FontText,
  Loader,
  Popup,
  AddressComponent,
  NavigationBar,
} from '../../components';
import commonStyle, {fontSize, iconSize, mediumFont, mediumLargeFont} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {SvgIcons, colors} from '../../assets';
import {RootScreens} from '../../types/type';
import {useGetCompanyQuery, useRemoveAddressMutation} from '../../api/company';
import utils from '../../helper/utils';
import {
  getAddressList,
  mergeArrays,
  updateAddressList,
} from '../Cart/Carthelper';

const AddressScreen = ({navigation, route, props}: any) => {
  const from = route?.params?.data?.from;
  const cartData = route?.params?.data?.cartData;
  const deliveryAdd = route?.params?.data.deliveryAdd;
  const billingAdd = route?.params?.data.billingAdd;
  const type = route?.params?.data?.type;
  const notes = route?.params?.data?.notes;
  const date = route?.params?.data?.expectedDate;
  const orderDetails = route?.params?.data?.orderDetails;
  const addressType = route?.params?.data?.addressType;
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const {data, isFetching} = useGetCompanyQuery(userInfo?.company?.id, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteAddress, {isLoading}] = useRemoveAddressMutation();

  const [addressData, setAddressData] = useState<any>([]);
  const [checkedData, setCheckedData] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [updateAdd, setUpdateAdd] = useState([]);


  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [addressData, checkedData]);

  const backAction = () => {
    const findData = addressData.find(
      (address: any) => address?.id === checkedData?.id,
    );

    if (!findData && type === 'Delivery address') {
      utils.showWarningToast('Please select address');
    } else if (type === 'Delivery address' && !findData?.deliveryAdd) {
      utils.showWarningToast('Please Continue to perform futher process.');
    } else if (findData) {
      navigation.goBack();
    } else {
      navigation.goBack();
    }
    return true;
  };

  useEffect(() => {
    setCheckedData(type === 'Delivery address' ? deliveryAdd : billingAdd);
  }, [type]);

  useFocusEffect(
    React.useCallback(() => {
      fetchAddressItems();
    }, []),
  );

  React.useLayoutEffect(() => {
    // *******************************  Hetvi ********************************
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.orange,
      },
      headerLeft: () => (
        <View
          style={[
            commonStyle.rowAC,
            {marginLeft: wp(4), flexDirection: 'row'},
          ]}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 50,
              padding: 7,
              marginRight: wp(4),
              borderColor: colors.yellow3,
            }}
            // style={commonStyle.iconView}
            onPress={() => backAction()}>
            <SvgIcons.Back_Arrow width={iconSize} height={iconSize} />
          </TouchableOpacity>
          <FontText
            name={'mont-semibold'}
            size={mediumLargeFont}
            color={'white'}>
            Address
          </FontText>
        </View>
      ),
    });
  }, [navigation, addressData, checkedData]);
  const fetchAddressItems = async () => {
    const items = await getAddressList(addressType);
    setAddressData(items);
  };

  const handleCheck = (item: any) => {
    let updateAddress: any =
      type === 'Delivery address'
        ? addressData.map((address: any) => {
            if (address.id === item.id) {
              let result = {
                ...address,
                deliveryAdd: true,
              };
              setCheckedData(result);
              return result;
            }
            return {...address, deliveryAdd: false};
          })
        : addressData.map((address: any) => {
            if (address.id === item.id) {
              let result = {
                ...address,
                billingAdd: true,
              };
              setCheckedData(result);
              return result;
            }
            return {...address, billingAdd: false};
          });
    setUpdateAdd(updateAddress);
  };

  const continuePress = async () => {
    const findData = addressData.some(
      (address: any) => address?.id === checkedData?.id,
    );
    if (findData) {
      if (
        checkedData?.id ===
        (type === 'Delivery address' ? deliveryAdd?.id : billingAdd?.id)
      ) {
        navigation.goBack();
      } else {
        await updateAddressList(updateAdd, addressType);
        let params = {
          // deliveryAdd: type === 'Delivery address' ? checkedData : deliveryAdd,
          // billingAdd: type === 'Billing address' ? checkedData : billingAdd,
          data: cartData,
          from: RootScreens.Address,
          name: 'Place Order',
          notes: notes,
          expectedDate: date,
          orderDetails: orderDetails,
          addressType: addressType,
        };
        navigation.goBack();
        route.params.onGoBack(params);
      }
    } else {
      type === 'Delivery address'
        ? utils.showWarningToast('Please select address')
        : navigation.goBack();
    }
  };

  const onAddressDelete = async (item: any) => {
    setIsOpen(false);
    let params = {
      companyId: userInfo?.company?.id,
      addressId: item.id,
    };
    const {data, error}: any = await deleteAddress(params);
    if (!error && data?.statusCode === 200) {
      const updateAddress = data?.result?.addresses?.filter(
        (item: any) => item?.isDeleted === false,
      );
      const mergedArray = await mergeArrays(updateAddress, addressType);
      await updateAddressList(mergedArray, addressType);
      utils.showSuccessToast(data.message);
      const items = await getAddressList(addressType);
      setAddressData(mergedArray);
    } else {
      utils.showErrorToast(
        data?.message ? data?.message : error?.data?.message,
      );
    }
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <CheckPreferenceItem
        radio={from === RootScreens.SecureCheckout ? true : false}
        listStyle={{
          // ...commonStyle.shadowContainer,
          backgroundColor: colors.white,
          borderRadius: 10,
          // marginVertical: hp(1),
          // marginHorizontal: wp(0.5),
        }}
        key={index}
        children={
          <AddressComponent
          type={type}
            item={item}
            from={from}
            onEditPress={() =>
              navigation.navigate(RootScreens.AddAddress, {
                data: item,
                address: data?.result?.address,
                name: 'Edit Address',
                onGoBack: () => fetchAddressItems(),
              })
            }
            onDeletePress={() => {
              setIsOpen(true);
              setSelectedItem(item);
            }}
            isEditDelete={true}
          />
        }
        disabled={from === RootScreens.SecureCheckout ? false : true}
        handleCheck={() => handleCheck(item)}
        checked={item?.id === checkedData?.id}
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
        <FlatList
          data={addressData}
          renderItem={_renderItem}
          showsVerticalScrollIndicator={false}
        />
        {/* <TouchableOpacity
          onPress={() => {
            navigation.navigate(RootScreens.AddAddress, {
              address: data?.result?.address,
              name: 'Add Address',
            });
          }}
          style={styles.floatingButton}>
          <SvgIcons.Plus width={tabIcon} height={tabIcon} fill={colors.white} />
        </TouchableOpacity> */}
      </View>
      {from === RootScreens.SecureCheckout ? (
        <>
        <Button
        onPress={() => {
          navigation.navigate(RootScreens.AddAddress, {
            address: data?.result?.address,
            name: 'Add Address',
            addressType: addressType
          });
        }}
        bgColor={'orange'}
        flex={null}
        style={[styles.buttonStyle]}>
        <FontText
          name={'mont-bold'}
          size={fontSize}
          color={'white'}>
          {'Add New Address'}
        </FontText>
      </Button>
        <Button
          onPress={continuePress}
          bgColor={'orange'}
          style={[styles.buttonStyle]}>
          <FontText name={'lexend-semibold'} size={fontSize} color={'white'}>
            {'Continue'}
          </FontText>
        </Button>
        </>
      ) : null}
      <Popup
        visible={isOpen}
        // onBackPress={() => setIsOpen(false)}
        title={`Are you sure you want to Remove\n this Address?`}
        titleStyle={{fontSize: normalize(14)}}
        leftBtnText={'No'}
        rightBtnText={'Yes'}
        leftBtnPress={() => setIsOpen(false)}
        rightBtnPress={() => onAddressDelete(selectedItem)}
        onTouchPress={() => setIsOpen(false)}
        leftBtnStyle={{
          width: '48%',
          backgroundColor: colors.white2,
          borderWidth: 0,
        }}
        rightBtnStyle={{backgroundColor: colors.red2, width: '48%'}}
        leftBtnTextStyle={{
          color: colors.blue,
          fontSize: mediumFont,
        }}
        rightBtnTextStyle={{fontSize: mediumFont}}
        style={{paddingHorizontal: wp(4), paddingVertical: wp(5)}}
      />
    </View>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 100,
    width: '90%',
    alignSelf: 'center',
    marginBottom: hp(3),
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
  },
});
