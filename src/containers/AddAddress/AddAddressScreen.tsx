import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useRef, useState} from 'react';
import commonStyle, {fontSize, mediumLargeFont, smallFont} from '../../styles';
import {Button, FontText, Input, Loader, NavigationBar} from '../../components';
import SvgIcons from '../../assets/SvgIcons';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Pressable} from 'react-native';
import BottomSheet from '../../components/BottomSheet';
import {ADDRESS_TYPE, STATES} from '../../types/data';
import utils from '../../helper/utils';
import {
  useCreateAddressMutation,
  useUpdateAddressMutation,
} from '../../api/address';
import { RootScreens } from '../../types/type';

const AddAddressScreen = ({navigation, route}: any) => {
  const [createAdd, {isLoading}] = useCreateAddressMutation();
  const [updateAdd, {isLoading: isProcessing}] = useUpdateAddressMutation();

  const item: any = route?.params?.data;

  const [fullName, setFullName] = useState(
    item ? item?.fullName : item ? item?.fullName : '',
  );
  const [phoneNumber, setPhoneNumber] = useState(item ? item?.phone : '');
  const [addressType, setAddressType] = useState(item ? item?.addressType : '');
  const [address, setAddress] = useState(item ? item?.address : '');
  const [pincode, setPincode] = useState(item ? item?.pincode : '');
  const [city, setCity] = useState(item ? item?.city : '');
  const [state, setState] = useState(item ? item?.state : '');
  const [checkValid, setCheckValid] = useState(false);

  const nameRef: any = useRef();
  const phnNoRef: any = useRef();
  const addressRef: any = useRef();
  const addressTypeRef: any = useRef();
  const pincodeRef: any = useRef();
  const cityRef: any = useRef();
  const stateRef: any = useRef();

  const isValidName = checkValid && fullName.length === 0;
  const isValidPhoneNo =
    checkValid && (phoneNumber.length === 0 || phoneNumber.length < 10);
  const isValidAddress = checkValid && address.length === 0;
  const isValidPincode = checkValid && pincode.length === 0;
  const isValidCity = checkValid && city.length === 0;
  const isValidState = checkValid && state.length === 0;
  const isValidAddressType = checkValid && addressType.length === 0;

  const savePress = async () => {
    setCheckValid(true);
    if (
      fullName.length !== 0 &&
      phoneNumber.length !== 0 &&
      addressType.length !== 0 &&
      address.length !== 0 &&
      pincode.length !== 0 &&
      city.length !== 0 &&
      state.length !== 0
    ) {
      let params = {
        fullName: fullName,
        phone: phoneNumber,
        addressType: addressType,
        address: address,
        pincode: pincode,
        city: city,
        state: state,
      };

      if (item) {
        const param = {
          id: item._id,
          params: params,
        };
        const {data,error}: any = await updateAdd(param);

        if (!error && data?.statusCode === 200) {
          setCheckValid(false);
          navigation.goBack();
          utils.showSuccessToast(data.message);
        } else {
          utils.showErrorToast(data.message || error);
        }
      } else {
        const {data, error}: any = await createAdd(params);
        if (!error) {
          setCheckValid(false);
          // navigation.navigate(RootScreens.OrderSummary);
          navigation.goBack();
          utils.showSuccessToast(data.message);
        } else {
          utils.showErrorToast(data.message || error);
        }
      }
    }
  };

  return (
    <View style={commonStyle.container}>
      <Loader loading={isLoading} />
      <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2)}}
        borderBottomWidth={0}
        center={
          <FontText
            color="black2"
            name="opensans-semibold"
            size={mediumLargeFont}
            textAlign={'center'}>
            {item ? 'Edit Address' : 'Add Address'}
          </FontText>
        }
        left={
          <TouchableOpacity
            style={commonStyle.iconView}
            onPress={() => navigation.goBack()}>
            <SvgIcons.BackIcon />
          </TouchableOpacity>
        }
      />
      <KeyboardAwareScrollView
        style={[commonStyle.paddingH4, commonStyle.marginT2]}>
        <FontText
          name={'opensans-semibold'}
          size={smallFont}
          color={'black2'}
          pLeft={wp(1)}
          pBottom={wp(2)}
          textAlign={'left'}>
          {'Full Name'}
        </FontText>
        <Input
          ref={nameRef}
          value={fullName}
          onChangeText={(text: string) => setFullName(text.trimStart())}
          autoCapitalize="none"
          placeholder={'Enter Full name'}
          placeholderTextColor={'placeholder'}
          fontSize={fontSize}
          inputStyle={styles.inputText}
          color={'black'}
          returnKeyType={'next'}
          style={[styles.input]}
          onSubmit={() => {
            phnNoRef?.current.focus();
          }}
        />
        {isValidName && (
          <FontText
            size={normalize(12)}
            color={'red'}
            pTop={wp(1)}
            textAlign="right"
            name="regular">{`Full Name is Required.`}</FontText>
        )}

        <View style={styles.marginTopView}>
          <FontText
            name={'opensans-semibold'}
            size={smallFont}
            color={'black2'}
            pLeft={wp(1)}
            pBottom={wp(2)}
            textAlign={'left'}>
            {'Phone number'}
          </FontText>
          <Input
            ref={phnNoRef}
            value={phoneNumber}
            onChangeText={(text: string) => setPhoneNumber(text.trimStart())}
            autoCapitalize="none"
            placeholder={'Enter Phone number'}
            placeholderTextColor={'placeholder'}
            fontSize={fontSize}
            inputStyle={styles.inputText}
            color={'black'}
            returnKeyType={'next'}
            maxLength={10}
            keyboardType="numeric"
            style={[styles.input]}
            onSubmit={() => {
              addressRef?.current.focus();
            }}
          />
          {isValidPhoneNo && (
            <FontText
              size={normalize(12)}
              color={'red'}
              pTop={wp(1)}
              textAlign="right"
              name="regular">{`Phone Number is Required.`}</FontText>
          )}
        </View>
        <View style={styles.marginTopView}>
          <FontText
            name={'opensans-semibold'}
            size={smallFont}
            color={'black2'}
            pLeft={wp(1)}
            pBottom={wp(2)}
            textAlign={'left'}>
            {'Address Type'}
          </FontText>
          <Pressable
            onPress={() => addressTypeRef.current.open()}
            style={styles.dropdownView}>
            <FontText
              name={'opensans-medium'}
              size={smallFont}
              color={addressType ? 'black2' : 'gray'}
              pLeft={wp(1)}
              textAlign={'left'}>
              {addressType ? addressType : 'Select Address Type'}
              {/* {cmpName?.value ? cmpName?.value : 'Select Company name'} */}
            </FontText>
            <SvgIcons.DownArrow height={wp(7)} width={wp(7)} fill={colors.black2}/>
          </Pressable>
          {isValidAddressType && (
            <FontText
              size={normalize(12)}
              color={'red'}
              pTop={wp(1)}
              textAlign="right"
              name="regular">{`Address Type is Required.`}</FontText>
          )}
        </View>
        <View style={styles.marginTopView}>
          <FontText
            name={'opensans-semibold'}
            size={smallFont}
            color={'black2'}
            pLeft={wp(1)}
            pBottom={wp(2)}
            textAlign={'left'}>
            {'Address'}
          </FontText>
          <Input
            ref={addressRef}
            value={address}
            onChangeText={(text: string) => setAddress(text.trimStart())}
            autoCapitalize="none"
            placeholder={'Enter Address'}
            placeholderTextColor={'placeholder'}
            fontSize={fontSize}
            inputStyle={[styles.inputText]}
            color={'black'}
            returnKeyType={'next'}
            multiline={true}
            multilineHeight={null}
            style={[styles.input]}
            onSubmit={() => {
              pincodeRef?.current.focus();
            }}
          />
          {isValidAddress && (
            <FontText
              size={normalize(12)}
              color={'red'}
              pTop={wp(1)}
              textAlign="right"
              name="regular">{`Address is Required.`}</FontText>
          )}
        </View>
        <View style={styles.marginTopView}>
          <FontText
            name={'opensans-semibold'}
            size={smallFont}
            color={'black2'}
            pLeft={wp(1)}
            pBottom={wp(2)}
            textAlign={'left'}>
            {'Pincode'}
          </FontText>
          <Input
            ref={pincodeRef}
            value={pincode}
            onChangeText={(text: string) => setPincode(text.trimStart())}
            autoCapitalize="none"
            placeholder={'Enter Pincode'}
            placeholderTextColor={'placeholder'}
            fontSize={fontSize}
            inputStyle={styles.inputText}
            color={'black'}
            returnKeyType={'next'}
            keyboardType="numeric"
            maxLength={6}
            style={[styles.input]}
            onSubmit={() => {
              cityRef?.current.focus();
            }}
          />
          {isValidPincode && (
            <FontText
              size={normalize(12)}
              color={'red'}
              pTop={wp(1)}
              textAlign="right"
              name="regular">{`Pincode is Required.`}</FontText>
          )}
        </View>
        <View style={styles.marginTopView}>
          <FontText
            name={'opensans-semibold'}
            size={smallFont}
            color={'black2'}
            pLeft={wp(1)}
            pBottom={wp(2)}
            textAlign={'left'}>
            {'City'}
          </FontText>
          <Input
            ref={cityRef}
            value={city}
            onChangeText={(text: string) => setCity(text.trimStart())}
            autoCapitalize="none"
            placeholder={'Enter City'}
            placeholderTextColor={'placeholder'}
            fontSize={fontSize}
            inputStyle={styles.inputText}
            color={'black'}
            returnKeyType={'done'}
            style={[styles.input]}
            blurOnSubmit
          />
          {isValidCity && (
            <FontText
              size={normalize(12)}
              color={'red'}
              pTop={wp(1)}
              textAlign="right"
              name="regular">{`City is Required.`}</FontText>
          )}
        </View>
        {/* <View style={styles.marginTopView}>
          <FontText
            name={'opensans-semibold'}
            size={smallFont}               
            color={'black2'}
            pLeft={wp(1)}
            pBottom={wp(2)}
            textAlign={'left'}>
            {'City'}
          </FontText>
          <TouchableOpacity
            // onPress={() => companyListRef?.current?.open()}
            style={styles.dropdownView}>
            <FontText
              name={'opensans-semibold'}
              size={smallFont}
              color={city ? 'black2' : 'gray'}
              pLeft={wp(1)}
              textAlign={'left'}>
              {'Select City'}
            </FontText>
            <SvgIcons.DownArrow height={wp(7)} width={wp(7)} />
          </TouchableOpacity>
        </View> */}
        <View style={styles.marginTopView}>
          <FontText
            name={'opensans-semibold'}
            size={smallFont}
            color={'black2'}
            pLeft={wp(1)}
            pBottom={wp(2)}
            textAlign={'left'}>
            {'State'}
          </FontText>
          <TouchableOpacity
            onPress={() => stateRef?.current?.open()}
            style={styles.dropdownView}>
            <FontText
              name={'opensans-medium'}
              size={smallFont}
              color={state ? 'black2' : 'gray'}
              pLeft={wp(1)}
              textAlign={'left'}>
              {state ? state : 'Select State'}
              {/* {cmpName?.value ? cmpName?.value : 'Select Company name'} */}
            </FontText>
            <SvgIcons.DownArrow height={wp(7)} width={wp(7)} fill={colors.black2}/>
          </TouchableOpacity>
          {isValidState && (
            <FontText
              size={normalize(12)}
              color={'red'}
              pTop={wp(1)}
              textAlign="right"
              name="regular">{`State is Required.`}</FontText>
          )}
        </View>
      </KeyboardAwareScrollView>
      <BottomSheet
        height={hp(20)}
        sheetRef={addressTypeRef}
        itemPress={(val: any) => {
          setAddressType(val);
          addressTypeRef.current.close();
        }}
        selectedItem={addressType}
        data={ADDRESS_TYPE}
        isIcon
      />
      <BottomSheet
        height={hp(75)}
        sheetRef={stateRef}
        itemPress={(val: any) => {
          setState(val);
          stateRef.current.close();
        }}
        selectedItem={state}
        data={STATES}
      />
      <Button
        onPress={savePress}
        bgColor={'brown'}
        style={[styles.buttonContainer]}>
        <FontText name={'opensans-semibold'} size={fontSize} color={'white'}>
          {'Save'}
        </FontText>
      </Button>
    </View>
  );
};

export default AddAddressScreen;

const styles = StyleSheet.create({
  inputText: {
    paddingLeft: wp(3),
    color: 'black',
    fontSize: normalize(12),
    fontFamily: 'opensans-medium',
    height: hp(5),
  },
  input: {
    borderRadius: 10,
    justifyContent: 'center',
    height: hp(6),
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: wp(1),
    // marginBottom: hp(2),
  },
  buttonContainer: {
    borderRadius: 12,
    width: '65%',
    alignSelf: 'center',
    marginVertical: hp(2.5),
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
    borderWidth: 1,
    borderColor: colors.gray,
    paddingHorizontal: wp(3),
  },
  btSheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
