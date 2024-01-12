import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import commonStyle, {fontSize, mediumFont, tabIcon} from '../../styles';
import {
  Button,
  CheckPreferenceItem,
  FontText,
  Loader,
  NavigationBar,
} from '../../components';
import SvgIcons from '../../assets/SvgIcons';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import {RootScreens} from '../../types/type';
import {useDispatch, useSelector} from 'react-redux';
import {useGetCompanyQuery, useRemoveAddressMutation} from '../../api/company';
import AddressComponent from '../../components/AddressComponent';
import utils from '../../helper/utils';
import Popup from '../../components/Popup';
import {setAddressList} from '../../redux/slices/addressSlice';
import {
  getAddressList,
  mergeArrays,
  updateAddressList,
} from '../Cart/Carthelper';
import {useFocusEffect} from '@react-navigation/native';

const AddressScreen = ({navigation, route, props}: any) => {
  const from = route?.params?.data?.from;
  const dispatch = useDispatch();
  // const companyId = route?.params?.data?.companyId;
  const cartData = route?.params?.data?.cartData;
  const deliveryAdd = route?.params?.data.deliveryAdd;
  const billingAdd = route?.params?.data.billingAdd;
  const type = route?.params?.data?.type;
  const notes = route?.params?.data?.notes;
  const date = route?.params?.data?.expectedDate;
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const {data, isFetching} = useGetCompanyQuery(userInfo?.companyId?._id, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteAddress, {isLoading}] = useRemoveAddressMutation();

  const [addressData, setAddressData] = useState<any>([]);
  const [checkedData, setCheckedData] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState({});
  const [updateAdd, setUpdateAdd] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    setCheckedData(type === 'Delivery address' ? deliveryAdd : billingAdd);
  }, [type]);

  useFocusEffect(
    React.useCallback(() => {
      fetchAddressItems();
      // setIsUpdated(false);
    }, []),
  );

  const fetchAddressItems = async () => {
    const items = await getAddressList();
    console.log('Obtain address items', items);
    setAddressData(items);
  };

  const handleCheck = (item: any, checkboxIndex: any) => {
    let updateAddress: any =
      type === 'Delivery address'
        ? addressData.map((address: any) => {
            if (address._id === item._id) {
              let result = {
                ...address,
                deliveryAdd: type === 'Delivery address' ? true : false,
              };
              setCheckedData(result);
              return result;
            }
            return {...address, deliveryAdd: false};
          })
        : addressData.map((address: any) => {
            if (address._id === item._id) {
              let result = {
                ...address,
                billingAdd: type !== 'Delivery address' ? true : false,
              };
              setCheckedData(result);
              return result;
            }
            return {...address, billingAdd: false};
          });
    setUpdateAdd(updateAddress);
  };

  const continuePress = async () => {
    console.log('continuePress', checkedData, deliveryAdd, billingAdd);
    if (
      JSON.stringify(checkedData) === JSON.stringify(deliveryAdd) ||
      JSON.stringify(checkedData) === JSON.stringify(billingAdd)
    ) {
      console.log('IF......');
      navigation.goBack();
    } else {
      await updateAddressList(updateAdd);
      // dispatch(setAddressList(updateAdd));
      let params = {
        deliveryAdd: type === 'Delivery address' ? checkedData : deliveryAdd,
        billingAdd: type === 'Billing address' ? checkedData : billingAdd,
        data: cartData,
        // companyId: companyId,
        from: RootScreens.Address,
        name: 'Place Order',
        notes: notes,
        expectedDate: date,
      };
      console.log('Params', params);
      // navigation.navigate(RootScreens.SecureCheckout);
      navigation.goBack();
      route.params.onGoBack(params);
    }
  };

  const onAddressDelete = async (item: any) => {
    setIsOpen(false);
    let params = {
      companyId: userInfo?.companyId?._id,
      addressId: item._id,
    };
    const {data, error}: any = await deleteAddress(params);
    console.log('DELETED', data, error);
    if (!error && data?.statusCode === 200) {
      // const mergedArray = mergeArrays(data?.result?.address, addressData);
      const mergedArray = await mergeArrays(data?.result?.address);
      console.log('DELETED', mergedArray);
      await updateAddressList(mergedArray);
      utils.showSuccessToast(data.message);
      const items = await getAddressList();
      console.log('Obtain address items', items);
      setAddressData(mergedArray);
    } else {
      utils.showErrorToast(data?.message ? data?.message : error?.message);
    }
  };

  const _renderItem = ({item, index}: any) => {
    let delivery = addressData?.find((d: any) => d?.deliveryAdd);
    console.log('DELEVERY', delivery);
    let billing = addressData?.find((d: any) => d?.billingAdd);
    console.log('BILL', billing);
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
        handleCheck={() => handleCheck(item, index)}
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
              name: 'Add Address',
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
        leftBtnStyle={{width: '48%', borderColor: colors.blue}}
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
