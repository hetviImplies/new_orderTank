import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import colors from '../../assets/colors';
import {Button, FontText, Input, Loader, NavigationBar} from '../../components';
import SvgIcons from '../../assets/SvgIcons';
import {
  iconSize,
  fontSize,
  mediumLarge1Font,
  mediumFont,
  smallFont,
  tabIcon,
  mediumLargeFont,
} from '../../styles';
import {wp, hp, normalize, isAndroid} from '../../styles/responsiveScreen';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import commonStyle from '../../styles';
import ImageCropPicker from 'react-native-image-crop-picker';
import imageCompress from 'react-native-compressor';
import RBSheet from 'react-native-raw-bottom-sheet';
import {COUNTRY_LIST, STATES_LIST} from '../../types/data';
import {
  useAddCompanyMutation,
  useCreateAddressMutation,
  useGetCompanyQuery,
  useUpdateAddressMutation,
  useUpdateCompanyMutation,
} from '../../api/company';
import utils from '../../helper/utils';
import {useSelector} from 'react-redux';
import BottomSheet from '../../components/BottomSheet';

const AddAddressScreen = (props: any) => {
  const {from, navigation, route} = props;
  const item = route?.params?.data;
  const addressList = route?.params?.address;

  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const {data, isFetching} = useGetCompanyQuery(userInfo?.companyId?._id, {
    refetchOnMountOrArgChange: true,
  });
  const [addAddress, {isLoading}] = useCreateAddressMutation();
  const [updateAddress, {isLoading: isProcess}] = useUpdateAddressMutation();

  const addressNameRef: any = useRef();
  const addressRef: any = useRef();
  const localityRef: any = useRef();
  const pinCodeRef: any = useRef();
  const cityRef: any = useRef();
  const stateRef: any = useRef();
  const countryRef: any = useRef();

  const [checkValid, setCheckValid] = useState(false);
  const [addressName, setAddressName] = useState(item ? item?.addressName : '');
  const [address, setAddress] = useState(item ? item?.addressLine : '');
  const [locality, setLocality] = useState(item ? item?.locality : '');
  const [pinCode, setPinCode] = useState(item ? item?.pincode : '');
  const [city, setCity] = useState(item ? item?.city : '');
  const [state, setState] = useState(item ? item?.state : '');
  const [country, setCountry] = useState(item ? item?.country : '');

  const isValidAddressName = checkValid && addressName.length === 0;
  const isValidAddress = checkValid && address.length === 0;
  const isValidPinCode = checkValid && pinCode.length === 0;
  const isValidLocality = checkValid && locality.length === 0;
  const isValidCity = checkValid && city.length === 0;
  const isValidState = checkValid && state.length === 0;
  const isValidCountry = checkValid && country.length === 0;

  console.log('addressList', addressList, item);

  const submitPress = async () => {
    setCheckValid(true);
    if (
      addressName.length !== 0 &&
      address.length !== 0 &&
      locality.length !== 0 &&
      city.length !== 0 &&
      pinCode.length !== 0 &&
      state.length !== 0 &&
      country.length !== 0
    ) {
      const formData = new FormData();

      const addressObj = {
        addressName: addressName,
        addressLine: address,
        locality: locality,
        pincode: pinCode,
        city: city,
        state: state,
        country: country,
      };
      console.log('address../...........', addressObj);
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
      item === undefined && delete body.addressId;
      console.log('body', body);
      if (item) {
        const {data, error}: any = await updateAddress(body);
        console.log('updateAddress', data);
        if (!error && data?.statusCode === 200) {
          navigation.goBack();
          setCheckValid(false);
          utils.showSuccessToast(data.message);
        } else {
          utils.showErrorToast(data.message || error);
        }
      } else {
        const {data, error}: any = await addAddress(body);
        console.log('addAddress', data, error);
        navigation.goBack();
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
      <Loader loading={isFetching || isProcess} />
      <View style={[commonStyle.paddingH4, commonStyle.flex]}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
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
                {'Address name:'}
              </FontText>
            </View>
            <Input
              ref={addressNameRef}
              value={addressName}
              onChangeText={(text: string) => setAddressName(text.trimStart())}
              placeholder={'Enter Address Name'}
              autoCapitalize="none"
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              inputStyle={styles.inputText}
              style={styles.input}
              color={'black'}
              returnKeyType={'next'}
              onSubmit={() => {
                addressRef?.current.focus();
              }}
              children={
                <View style={[commonStyle.abs, {left: wp(4)}]}>
                  <SvgIcons.Location width={iconSize} height={iconSize} />
                </View>
              }
            />
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
              inputStyle={styles.inputText}
              style={styles.input}
              returnKeyType={'next'}
              multiline
              multilineHeight={null}
              blurOnSubmit
              onSubmit={() => {
                localityRef?.current.focus();
              }}
              children={
                <View style={[commonStyle.abs, {left: wp(4)}]}>
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
                {/* {cmpName?.value ? cmpName?.value : 'Select Company name'} */}
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
          <View style={styles.marginTopView}>
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
                {/* {cmpName?.value ? cmpName?.value : 'Select Company name'} */}
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
          </View>
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
          height={hp(75)}
          sheetRef={stateRef}
          itemPress={(val: any) => {
            setState(val);
            stateRef.current.close();
          }}
          selectedItem={state}
          data={STATES_LIST}
        />
        <BottomSheet
          height={hp(75)}
          sheetRef={countryRef}
          itemPress={(val: any) => {
            setCountry(val);
            countryRef.current.close();
          }}
          selectedItem={country}
          data={COUNTRY_LIST}
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
    fontFamily: 'lexend-regular',
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
  uploadImgContainer: {
    backgroundColor: colors.white2,
    paddingVertical: hp(3),
    paddingHorizontal: wp(8),
    borderRadius: normalize(6),
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: hp(2.5),
  },
  avatar: {
    width: hp(15),
    height: hp(15),
    borderRadius: 6,
    alignSelf: 'center',
    resizeMode: 'cover',
    marginBottom: hp(2),
  },
});
