import {BackHandler, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  BottomSheet,
  Button,
  FontText,
  Input,
  Loader,
  NavigationBar,
} from '../../components';
import commonStyle, {iconSize, fontSize, mediumFont, mediumLargeFont, smallFont} from '../../styles';
import {wp, hp, normalize} from '../../styles/responsiveScreen';
import {colors, fonts, SvgIcons} from '../../assets';
import {STATES_DATA} from '../../helper/data';
import {
  useCreateAddressMutation,
  useGetCompanyQuery,
  useUpdateAddressMutation,
} from '../../api/company';
import utils from '../../helper/utils';
import {
  getAddressList,
  mergeArrays,
  updateAddressList,
} from '../Cart/Carthelper';
import {numRegx} from '../../helper/regex';
import { RootScreens } from '../../types/type';
import { Dropdown } from 'react-native-element-dropdown';

const AddAddressScreen = (props: any) => {
  const {navigation, route} = props;
  const item = route?.params?.data;
  const addressType = route?.params?.addressType;
  console.log('route?.params: ', route?.params);
  const from = route?.params.name
  console.log('from: ', from);  

  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const {data, isFetching} = useGetCompanyQuery(userInfo?.company?.id, {
    refetchOnMountOrArgChange: true,
    skip: item ? false : true,
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
  const [isFocus, setIsFocus] = useState(false);
  // const [country, setCountry] = useState(item ? item?.country : '');
  const validationNumber = (val: any) => {
    const result = numRegx.test(val?.trim());
    return result;
  };

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
            onPress={() => navigation.goBack()}>
            <SvgIcons.Back_Arrow width={iconSize} height={iconSize} />
          </TouchableOpacity>
          <FontText
            name={'mont-semibold'}
            size={mediumLargeFont}
            color={'white'}>
            {from}
          </FontText>
        </View>
      ),
    });
  }, [navigation]);


  const isValidAddressName = checkValid && addressName.length === 0;
  const isValidAddress = checkValid && address.length === 0;
  const isValidPinCode =
    checkValid &&
    (pinCode?.length === 0 ||
      pinCode?.length < 6 ||
      !validationNumber(pinCode));
  const isValidLocality = checkValid && locality.length === 0;
  const isValidCity = checkValid && city.length === 0;
  const isValidState = checkValid && state.length === 0;
  // const isValidCountry = checkValid && country.length === 0;

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  const backAction = () => {
    navigation.goBack();
    return true;
  };

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
        const items = await getAddressList(addressType);
        setAddressData(items);
      };
      fetchAddressItems();
    }, []),
  );

  const submitPress = async () => {
    setCheckValid(true);
    if (
      addressName.length !== 0 &&
      address.length !== 0 &&
      locality.length !== 0 &&
      city.length !== 0 &&
      pinCode?.length !== 0 &&
      pinCode?.length === 6 &&
      validationNumber(pinCode) &&
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
        companyId: userInfo?.company?.id,
        addressId: item?.id,
      };
      item === undefined && delete body.addressId;
      if (item) {
        const {data, error}: any = await updateAddress(body);
        if (!error && data?.statusCode === 200) {
          setCheckValid(false);
          const updateAddress = data?.result?.addresses?.filter(
            (item: any) => item?.isDeleted === false,
          );
          const mergedArray = await mergeArrays(updateAddress, addressType);
          await updateAddressList(mergedArray, addressType);
          navigation.goBack();
          route?.params?.onGoBack();
          utils.showSuccessToast(data.message);
        } else {
          utils.showErrorToast(
            data?.message ? data?.message : error?.data?.message,
          );
        }
      } else {
        const {data, error}: any = await addAddress(body);
        if (!error && data?.statusCode === 200) {
          setCheckValid(false);
          utils.showSuccessToast(data.message);
          const updateAddress = data?.result?.addresses?.filter(
            (item: any) => item?.isDeleted === false,
          );
          const mergedArray = await mergeArrays(updateAddress, addressType);
          await updateAddressList(mergedArray, addressType);
          navigation.goBack();
          route?.params?.onGoBack();
        } else {
          utils.showErrorToast(
            data?.message ? data?.message : error?.data?.message,
          );
        }
      }
    }
  };

  return (
    <View style={commonStyle.container}>
      <Loader loading={isFetching || isProcess || isLoading} />
      <View style={[commonStyle.paddingH4, commonStyle.flex]}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.marginTopView}>
            <Input
            height={hp(6)}
              ref={addressNameRef}
              value={addressName}
              onChangeText={(text: string) => setAddressName(text.trimStart())}
              placeholder={'Enter Address Name'}
              placeholderTextColor={'placeholder'}
              fontSize={smallFont}
              color={'darkGray'}
              fontName={"mont-medium"}
              inputStyle={styles.inputText}
              style={styles.input}
              returnKeyType={'next'}
              onSubmit={() => {
                addressRef?.current.focus();
              }}
            />
            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
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
            <Input
            multilineHeight={hp(6)}
            fontName={"mont-medium"}
              ref={addressRef}
              value={address}
              onChangeText={(text: string) => setAddress(text.trimStart())}
              placeholder={'Enter Address'}
              placeholderTextColor={'placeholder'}
              fontSize={smallFont}
              // multilineHeight={hp(6)}
              color={'darkGray'}
              inputStyle={[styles.inputText,{ borderRadius: normalize(25)}]}
              style={{width: '100%',
                borderRadius: 10,
                justifyContent: 'center'}}
              returnKeyType={'next'}
              multiline={true}
              
              blurOnSubmit
              onSubmit={() => {
                localityRef?.current.focus();
              }}
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
            <Input
              ref={localityRef}
              height={hp(6)}
              value={locality}
              onChangeText={(text: string) => setLocality(text.trimStart())}
              placeholder={'Enter Locality'}
              placeholderTextColor={'placeholder'}
              inputStyle={styles.inputText}
              style={styles.input}
              fontSize={smallFont}
              color={'darkGray'}
              fontName={"mont-medium"}
              returnKeyType={'next'}
              onSubmit={() => {
                pinCodeRef?.current.focus();
              }}
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
            <Input
              ref={pinCodeRef}
              value={pinCode}
              height={hp(6)}
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
            />
            {isValidPinCode && (
              <FontText
                size={normalize(12)}
                color={'red'}
                pTop={wp(1)}
                textAlign="right"
                name="regular">
                {checkValid && pinCode?.length === 0
                  ? `Pin Code is required.`
                  : 'Invalid Pin Code.'}
              </FontText>
            )}
          </View>
          <View style={styles.marginTopView}>
            <Input
              ref={cityRef}
              value={city}
              onChangeText={(text: string) => setCity(text.trimStart())}
              placeholder={'Enter City'}
              height={hp(6)}
              placeholderTextColor={'placeholder'}
              fontSize={smallFont}
              color={'darkGray'}
              fontName={"mont-medium"}
              inputStyle={styles.inputText}
              style={styles.input}

              returnKeyType={'done'}
              blurOnSubmit
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
          <View style={{marginTop:hp(1)}}>
              <Dropdown
              dropdownPosition='bottom'
                style={[styles.dropdown, isFocus && { borderColor: colors.lightGray }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={STATES_DATA}
                showsVerticalScrollIndicator={false}
                // search
                containerStyle={{ borderRadius: normalize(20), marginTop: hp(1),borderWidth:1,borderColor:colors.lightGray}}
                itemContainerStyle={{ borderRadius: normalize(20), backgroundColor: colors.transparent }}
                maxHeight={hp(30)}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'Select State' : '...'}
                searchPlaceholder="Search..."
                value={selectedState}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={item => {
                  setSelectedState(item?.value);
                  setState(item?.label);
                  setIsFocus(false);
                }}
                renderRightIcon={() => (
                  <SvgIcons._DownArrow height={wp(3.5)} width={wp(3.5)} />
                )}
              />
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
          <FontText name={'mont-bold'} size={fontSize} color={'white'}>
            {item ? 'Update' : 'Add Address'}
          </FontText>
        </Button>
        {/* <BottomSheet
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
        /> */}
        {/* <BottomSheet
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
        /> */}
      </View>
    </View>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  inputText: {
    borderRadius: normalize(100),
    paddingLeft: wp(6),
    color: colors.darkGray,
    fontSize: smallFont,
    fontFamily: fonts['mont-medium'],
    backgroundColor: colors.gray2,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    // height: hp(6),
  },
  buttonContainer: {
    borderRadius: normalize(100),
    marginVertical: hp(2),
  },
  marginTopView: {
    marginTop: hp(1),
  },
  dropdownView: {
    borderRadius: normalize(100),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: hp(6),
    backgroundColor: colors.white,
    paddingHorizontal: wp(3),
    borderWidth:1,
    borderColor:colors.lightGray
  },dropdown: {
    height: hp(6),
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: normalize(100),
    paddingHorizontal: wp(4),
    // width:wp(90)
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: wp(3.5),
    bottom: hp(4),
    zIndex: 999,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: mediumFont,
    color:colors.placeholder,
    fontStyle: fonts["mont-medium"],
    left:wp(2)
  },
  selectedTextStyle: {
    color: colors.darkGray,
    fontSize: mediumFont,
    fontFamily: fonts['mont-medium'],
    paddingLeft: wp(2)
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
});
