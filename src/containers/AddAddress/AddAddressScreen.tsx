import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import colors from '../../assets/colors';
import {Button, FontText, Input, Loader, NavigationBar} from '../../components';
import SvgIcons from '../../assets/SvgIcons';
import {iconSize, fontSize, mediumFont} from '../../styles';
import {wp, hp, normalize} from '../../styles/responsiveScreen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import commonStyle from '../../styles';
import {ADDRESS_TYPE, COUNTRY_LIST, STATES_DATA} from '../../types/data';
import {
  useCreateAddressMutation,
  useGetCompanyQuery,
  useUpdateAddressMutation,
} from '../../api/company';
import utils from '../../helper/utils';
import {useSelector} from 'react-redux';
import BottomSheet from '../../components/BottomSheet';
import {getAddressList, updateAddressList} from '../Cart/Carthelper';
import {useFocusEffect} from '@react-navigation/native';

const AddAddressScreen = (props: any) => {
  const {navigation, route} = props;
  const item = route?.params?.data;

  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const {data, isFetching} = useGetCompanyQuery(userInfo?.companyId?._id, {
    refetchOnMountOrArgChange: true,
    skip : item ? false : true
  });
  const [addAddress, {isLoading}] = useCreateAddressMutation();
  const [updateAddress, {isLoading: isProcess}] = useUpdateAddressMutation();

  const addressNameRef: any = useRef();
  const addressRef: any = useRef();
  const localityRef: any = useRef();
  const pinCodeRef: any = useRef();
  const cityRef: any = useRef();
  const stateRef: any = useRef();
  // const countryRef: any = useRef();

  const [checkValid, setCheckValid] = useState(false);
  const [addressName, setAddressName] = useState(item ? item?.addressName : '');
  const [address, setAddress] = useState(item ? item?.addressLine : '');
  const [locality, setLocality] = useState(item ? item?.locality : '');
  const [pinCode, setPinCode] = useState(item ? item?.pincode : '');
  const [city, setCity] = useState(item ? item?.city : '');
  const [state, setState] = useState(item ? item?.state : '');
  const [selectedState, setSelectedState] = useState('');
  const [addressData, setAddressData] = useState([]);
  // const [country, setCountry] = useState(item ? item?.country : '');

  const isValidAddressName = checkValid && addressName.length === 0;
  const isValidAddress = checkValid && address.length === 0;
  const isValidPinCode = checkValid && pinCode.length === 0;
  const isValidLocality = checkValid && locality.length === 0;
  const isValidCity = checkValid && city.length === 0;
  const isValidState = checkValid && state.length === 0;
  // const isValidCountry = checkValid && country.length === 0;

  useEffect(() => {
    STATES_DATA.map((state, index) => {
      if (item?.state === state.label) {
        setSelectedState(state.value);
      }
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchAddressItems = async () => {
        const items = await getAddressList();
        setAddressData(items);
      };
      fetchAddressItems();
    }, []),
  );

  function mergeArrays(array1: any, array2: any) {
    const resultArray: any = [];

    array1.forEach((obj1: any) => {
      const matchingObj2 = array2.find((obj2: any) => obj2._id === obj1._id);

      if (matchingObj2) {
        const mergedObject = {
          ...obj1,
          billingAdd: matchingObj2.billingAdd,
          deliveryAdd: matchingObj2.deliveryAdd,
        };
        resultArray.push(mergedObject);
      } else {
        resultArray.push({
          ...obj1,
          billingAdd: false,
          deliveryAdd: false,
        });
      }
    });

    return resultArray;
  }

  const submitPress = async () => {
    setCheckValid(true);
    if (
      addressName.length !== 0 &&
      address.length !== 0 &&
      locality.length !== 0 &&
      city.length !== 0 &&
      pinCode.length !== 0 &&
      state.length !== 0
      // && country.length !== 0
    ) {
      const addressObj = {
        addressName: addressName,
        addressLine: address,
        locality: locality,
        pincode: pinCode,
        city: city,
        state: state,
        // country: country,
      };
      // addressObj.forEach((value: any, index: any) => {
      //   for (var key in value) {
      //     formData.append(`address[${[index]}][${key}]`, value[key]);
      //   }
      // });

      let body = {
        params: addressObj,
        companyId: userInfo?.companyId?._id,
        addressId: item?._id,
      };
      console.log('body', body);
      item === undefined && delete body.addressId;
      if (item) {
        const {data, error}: any = await updateAddress(body);
        console.log('data?.result?.address', data?.result?.address);
        if (!error && data?.statusCode === 200) {
          setCheckValid(false);
          const mergedArray = mergeArrays(data?.result?.address, addressData);
          console.log(mergedArray);
          await updateAddressList(mergedArray);
          navigation.goBack();
          route?.params?.onGoBack();
          utils.showSuccessToast(data.message);
        } else {
          utils.showErrorToast(data?.message ? data?.message : error?.message);
        }
      } else {
        const {data, error}: any = await addAddress(body);
        console.log('addAddress DATA: ' + JSON.stringify(data));
        if (!error && data?.statusCode === 200) {
          setCheckValid(false);
          utils.showSuccessToast(data.message);
          let updateData = data?.result?.address.map((address: any) => {
            console.log('address', address);
            let find = addressData.find(
              (item: any) => item._id === address._id,
            );
            console.log('FOUND', find);
            if (!find) {
              console.log('Hello....');
              return {
                ...address,
                deliveryAdd: false,
                billingAdd: false,
              };
            }
            return find;
          });
          console.log('updateData......//////////', updateData);
          await updateAddressList(updateData);
          navigation.goBack();
          route?.params?.onGoBack();
        } else {
          utils.showErrorToast(data?.message ? data?.message : error?.message);
        }
      }
    }
  };

  return (
    <View style={commonStyle.container}>
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
              {item ? 'Edit Address' : 'Add Address'}
            </FontText>
          </View>
        }
        leftStyle={{width: '100%'}}
        hasRight
        style={{marginHorizontal: wp(2.5)}}
        borderBottomWidth={0}
      /> */}
      <Loader loading={isFetching || isProcess || isLoading} />
      <View style={[commonStyle.paddingH4, commonStyle.flex]}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.marginTopView}>
            <View style={[commonStyle.rowACMB1]}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'gray3'}
                pLeft={wp(1)}
                textAlign={'left'}>
                {'Address name:'}
              </FontText>
            </View>
            <TouchableOpacity
              onPress={() => addressNameRef?.current?.open()}
              style={styles.dropdownView}>
              <View style={[commonStyle.abs, {left: wp(4)}]}>
                <SvgIcons.Location width={iconSize} height={iconSize} />
              </View>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={addressName ? 'black' : 'gray'}
                pLeft={wp(9)}
                textAlign={'left'}>
                {addressName ? addressName : 'Select Address Name'}
              </FontText>
              <SvgIcons.DownArrow height={wp(3.5)} width={wp(3.5)} />
            </TouchableOpacity>
            {isValidAddressName && (
              <FontText
                size={normalize(12)}
                color={'red'}
                pTop={wp(1)}
                textAlign="right"
                name="regular">
                {'Address Name is required.'}
              </FontText>
            )}
          </View>
          <View style={styles.marginTopView}>
            <View
              style={[
                commonStyle.rowAC,
                {
                  marginBottom: hp(1),
                },
              ]}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'gray3'}
                pLeft={wp(1)}
                textAlign={'left'}>
                {'Address Line:'}
              </FontText>
            </View>
            <Input
              ref={addressRef}
              value={address}
              onChangeText={(text: string) => setAddress(text.trimStart())}
              placeholder={'Enter Address'}
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              color={'black'}
              inputStyle={[styles.inputText, {paddingTop: hp(2)}]}
              style={[styles.input, {marginVertical: hp(2)}]}
              returnKeyType={'next'}
              multiline
              blurOnSubmit
              onSubmit={() => {
                localityRef?.current.focus();
              }}
              children={
                <View style={[commonStyle.abs, {left: wp(4), top: 0}]}>
                  <SvgIcons.Location width={iconSize} height={iconSize} />
                </View>
              }
            />
            {isValidAddress && (
              <FontText
                size={normalize(12)}
                color={'red'}
                pTop={wp(1)}
                textAlign="right"
                name="regular">
                {'Address is required.'}
              </FontText>
            )}
          </View>
          <View style={styles.marginTopView}>
            <View style={commonStyle.rowACMB1}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'gray3'}
                pLeft={wp(1)}
                textAlign={'left'}>
                {'Locality:'}
              </FontText>
            </View>
            <Input
              ref={localityRef}
              value={locality}
              onChangeText={(text: string) => setLocality(text.trimStart())}
              placeholder={'Enter Locality'}
              autoCapitalize="none"
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              inputStyle={styles.inputText}
              style={styles.input}
              color={'black'}
              returnKeyType={'next'}
              onSubmit={() => {
                pinCodeRef?.current.focus();
              }}
              children={
                <View style={[commonStyle.abs, {left: wp(4)}]}>
                  <SvgIcons.Location width={iconSize} height={iconSize} />
                </View>
              }
            />
            {isValidLocality && (
              <FontText
                size={normalize(12)}
                color={'red'}
                pTop={wp(1)}
                textAlign="right"
                name="regular">
                {'Locality is required.'}
              </FontText>
            )}
          </View>
          <View style={styles.marginTopView}>
            <View style={commonStyle.rowACMB1}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'gray3'}
                pLeft={wp(1)}
                textAlign={'left'}>
                {'Pin Code:'}
              </FontText>
            </View>
            <Input
              ref={pinCodeRef}
              value={pinCode}
              onChangeText={(text: string) => setPinCode(text.trim())}
              placeholder={'Enter Pin Code'}
              autoCapitalize="none"
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              inputStyle={styles.inputText}
              style={styles.input}
              color={'black'}
              returnKeyType={'next'}
              keyboardType={'numeric'}
              maxLength={6}
              onSubmit={() => {
                cityRef?.current.focus();
              }}
              children={
                <View style={[commonStyle.abs, {left: wp(4)}]}>
                  <SvgIcons.PinCode width={iconSize} height={iconSize} />
                </View>
              }
            />
            {isValidPinCode && (
              <FontText
                size={normalize(12)}
                color={'red'}
                pTop={wp(1)}
                textAlign="right"
                name="regular">
                {checkValid && pinCode.length === 0
                  ? `Pin Code is required.`
                  : 'Invalid Pin Code.'}
              </FontText>
            )}
          </View>
          <View style={styles.marginTopView}>
            <View style={commonStyle.rowACMB1}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'gray3'}
                pLeft={wp(1)}
                textAlign={'left'}>
                {'City:'}
              </FontText>
            </View>
            <Input
              ref={cityRef}
              value={city}
              onChangeText={(text: string) => setCity(text.trimStart())}
              placeholder={'Enter City'}
              autoCapitalize="none"
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              inputStyle={styles.inputText}
              style={styles.input}
              color={'black'}
              returnKeyType={'done'}
              blurOnSubmit
              children={
                <View style={[commonStyle.abs, {left: wp(4)}]}>
                  <SvgIcons.City width={iconSize} height={iconSize} />
                </View>
              }
            />
            {isValidCity && (
              <FontText
                size={normalize(12)}
                color={'red'}
                pTop={wp(1)}
                textAlign="right"
                name="regular">
                {'City is required.'}
              </FontText>
            )}
          </View>
          <View style={styles.marginTopView}>
            <View style={[commonStyle.rowACMB1]}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'gray3'}
                pLeft={wp(1)}
                textAlign={'left'}>
                {'State:'}
              </FontText>
            </View>
            <TouchableOpacity
              onPress={() => stateRef?.current?.open()}
              style={styles.dropdownView}>
              <View style={[commonStyle.abs, {left: wp(4)}]}>
                <SvgIcons.State width={iconSize} height={iconSize} />
              </View>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={state ? 'black' : 'gray'}
                pLeft={wp(9)}
                textAlign={'left'}>
                {state ? state : 'Select State'}
              </FontText>
              <SvgIcons.DownArrow height={wp(3.5)} width={wp(3.5)} />
            </TouchableOpacity>
            {isValidState && (
              <FontText
                size={normalize(12)}
                color={'red'}
                pTop={wp(1)}
                textAlign="right"
                name="regular">
                {'State is required.'}
              </FontText>
            )}
          </View>
          {/* <View style={styles.marginTopView}>
            <View style={commonStyle.rowACMB1}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'gray3'}
                pLeft={wp(1)}
                textAlign={'left'}>
                {'Country:'}
              </FontText>
            </View>
            <TouchableOpacity
              onPress={() => countryRef?.current?.open()}
              style={styles.dropdownView}>
              <View style={[commonStyle.abs, {left: wp(4)}]}>
                <SvgIcons.Country width={iconSize} height={iconSize} />
              </View>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={country ? 'black' : 'gray'}
                pLeft={wp(9)}
                textAlign={'left'}>
                {country ? country : 'Select Country'}
              </FontText>
              <SvgIcons.DownArrow height={wp(3.5)} width={wp(3.5)} />
            </TouchableOpacity>
            {isValidCountry && (
              <FontText
                size={normalize(12)}
                color={'red'}
                pTop={wp(1)}
                textAlign="right"
                name="regular">
                {'Country is required.'}
              </FontText>
            )}
          </View> */}
        </KeyboardAwareScrollView>
        <Button
          onPress={submitPress}
          bgColor={'orange'}
          style={styles.buttonContainer}>
          <FontText name={'lexend-semibold'} size={fontSize} color={'white'}>
            {item ? 'Update' : 'Add address'}
          </FontText>
        </Button>
        <BottomSheet
          onPressCloseModal={() => addressNameRef?.current?.close()}
          refName={addressNameRef}
          modalHeight={hp(20)}
          title={'Select Address Name'}
          data={ADDRESS_TYPE}
          selectedIndex={addressName}
          onPress={(item: any, index: any) => {
            setAddressName(item?.value);
            addressNameRef?.current?.close();
          }}
        />
        <BottomSheet
          onPressCloseModal={() => stateRef?.current?.close()}
          refName={stateRef}
          modalHeight={hp(50)}
          title={'Select State'}
          searcheble
          data={STATES_DATA}
          selectedIndex={selectedState}
          onPress={(item: any, index: any) => {
            setSelectedState(item?.value);
            setState(item?.label);
            stateRef?.current?.close();
          }}
        />
      </View>
    </View>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  inputText: {
    borderRadius: 10,
    paddingLeft: wp(12),
    color: colors.black,
    fontSize: normalize(14),
    fontFamily: 'Lexend-Regular',
    backgroundColor: colors.gray2,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    height: hp(6),
  },
  buttonContainer: {
    borderRadius: normalize(6),
    marginVertical: hp(2),
  },
  marginTopView: {
    marginTop: hp(1.5),
  },
  dropdownView: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: hp(6),
    backgroundColor: colors.gray2,
    paddingHorizontal: wp(3),
  },
});
