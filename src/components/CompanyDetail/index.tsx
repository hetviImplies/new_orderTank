import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImageCropPicker from 'react-native-image-crop-picker';
import imageCompress, { backgroundUpload, getImageMetaData } from 'react-native-compressor';
import RBSheet from 'react-native-raw-bottom-sheet';
import { colors, fonts, Images, SvgIcons } from '../../assets';
import {
  Button,
  FontText,
  Input,
  Loader,
  RadioButton,
  BottomSheet,
  OutLine_Input,
  Modal,
} from '..';
import commonStyle, {
  iconSize,
  fontSize,
  mediumFont,
  tabIcon,
  mediumLargeFont,
  smallFont,
  largeFont,
  smallest,
} from '../../styles';
import { wp, hp, normalize, isAndroid } from '../../styles/responsiveScreen';
import { NUMBER_TYPE, STATES_DATA } from '../../helper/data';
import {
  useAddCompanyMutation,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
} from '../../api/company';
import utils from '../../helper/utils';
import { useGetCurrentUserQuery, useLogoutMutation } from '../../api/auth';
import { RootScreens } from '../../types/type';
import { gstNoRegx, numRegx, panNoRegx, phoneRegx } from '../../helper/regex';
import { authReset, setCurrentUser } from '../../redux/slices/authSlice';
import { resetNavigateTo } from '../../helper/navigationHelper';
import { removeToken } from '../../helper/PushNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { positionStyle } from 'react-native-flash-message';
const CompanyDetail = (props: any) => {
  const { navigation, from, loginData } = props;
  const [loading, setLoading] = useState(false);
  const [isOpenLogout, setIsOpenLogout] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [logout, { isgLoading }] = useLogoutMutation();
  console.log('isLoading: ', isgLoading);
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const {
    data: userData,
    isFetching: isFetch,
    refetch,
  } = useGetCurrentUserQuery(null, {
    refetchOnMountOrArgChange: true,
  });

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
            { marginLeft: wp(4), flexDirection: 'row' },
          ]}>
          {from === "Profile" ? <TouchableOpacity
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
          </TouchableOpacity> : null}
          <FontText
            name={'mont-semibold'}
            size={mediumLargeFont}
            color={'white'}>
            Company Detail
          </FontText>
        </View>
      ),
      headerRight: () => (
        from === "Profile" ? <></> : <TouchableOpacity
          onPress={() => setIsOpenLogout(true)}
          style={{
            borderWidth: 1,
            borderRadius: 50,
            padding: 8,
            borderColor: colors.yellow3, marginRight: wp(4)
          }}>
          <SvgIcons._Logout
            width={wp(4)}
            height={wp(4)}
            fill={colors.orange}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const { data, isFetching } = useGetCompanyQuery(
    loginData ? loginData?.company?.id : userData?.result?.company?.id,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const [addCompany, { isLoading }] = useAddCompanyMutation();
  const [updateCompany, { isLoading: isProcess }] = useUpdateCompanyMutation();
  const [editInformation, setEditInformation] = React.useState(false);
  const [btnText, setBtnText] = React.useState('Edit Details');

  const validationGstNo = (val: any) => {
    const result = gstNoRegx.test(val?.trim());
    return result;
  };

  const validationPanNo = (val: any) => {
    const result = panNoRegx.test(val?.trim());
    return result;
  };

  let regRef = useRef(null);
  let nameRef = useRef(null);
  let phoneRef = useRef(null);
  let companyRef = useRef(null);
  let addressNameRef = useRef(null);
  let addressRef: any = useRef();
  let localityRef: any = useRef();
  let pinCodeRef: any = useRef();
  let cityRef: any = useRef();
  let stateRef: any = useRef();
  let countryRef: any = useRef();
  let imageRef: any = useRef();

  const [checkValid, setCheckValid] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const [imageRes, setImageRes] = useState<any>({});
  const [gstNo, setGstNo] = useState('');
  const [panNo, setPanNo] = useState('');
  const [company, setCompany] = useState('');
  const [addressName, setAddressName] = useState('');
  const [name, setName] = useState('');
  const [nameTemp, setNameTemp] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneTemp, setPhoneTemp] = useState('');
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  // const [country, setCountry] = useState('');
  const [numberType, setNumberType] = useState(1);
  // const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const validationPhnNumber = (val: any) => {
    const result = phoneRegx.test(val?.trim());
    return result;
  };
  const validationNumber = (val: any) => {
    const result = numRegx.test(val?.trim());
    return result;
  };

  const isValidGstNo =
    checkValid && (gstNo?.length === 0 || !validationGstNo(gstNo));
  const isValidPanNo =
    checkValid && (panNo?.length === 0 || !validationPanNo(panNo));
  const isValidCompanyName = checkValid && company?.length === 0;
  const isValidName = checkValid && name?.length === 0;
  const isValidPhone =
    checkValid &&
    (phone?.length === 0 || phone?.length < 10 || !validationPhnNumber(phone));
  const isValidAddress = checkValid && address?.length === 0;
  // const isValidAddressName = checkValid && addressName?.length === 0;
  const isValidPinCode = checkValid && (pinCode?.length === 0 || pinCode?.length < 6 || pinCode?.length > 6 || !validationNumber(pinCode));
  const isValidLocality = checkValid && locality?.length === 0;
  const isValidCity = checkValid && city?.length === 0;
  const isValidState = checkValid && state?.length === 0;
  // const isValidCountry = checkValid && country.length === 0;

  useEffect(() => {
    setNumberType(data?.result?.gstNo ? 1 : data?.result?.panNo ? 2 : 1);
    setImageUrl(
      data?.result
        ? data?.result?.logo !== null
          ? data?.result?.logo
          : ''
        : '',
    );
    setName(
      data?.result?.name
        ? data?.result?.name
        : loginData?.name
          ? loginData?.name
          : userData?.result?.name,
    );
    setGstNo(data?.result?.gstNo ? data?.result?.gstNo : '');
    setPanNo(data?.result?.panNo ? data?.result?.panNo : '');
    setPhone(
      data?.result?.phone
        ? data?.result?.phone
        : loginData?.phone
          ? loginData?.phone
          : userData?.result?.phone,
    );
    setCompany(data?.result ? data?.result?.companyName : '');
    setAddress(data?.result ? data?.result?.addressLine : '');
    // setAddressName(data?.result ? data?.result?.addressName : '');
    setLocality(data?.result ? data?.result?.locality : '');
    setPinCode(data?.result ? data?.result?.pincode : '');
    setCity(data?.result ? data?.result?.city : '');
    setState(data?.result ? data?.result?.state : '');
    STATES_DATA.map((state, index) => {
      if (data?.result?.state === state.label) {
        setSelectedState(state.value);
      }
    });
    // setCountry(data?.result ? data?.result?.country : '');
  }, [data, userInfo, loginData, userData]);

  const imagePress = async() => {
    await imageRef.current.open();
  };

  const onPhotoUploadUrlChangeHandler = async (
    res: any,
    url: any,
    file: any,
  ) => {
    console.log('res: ', res);
    console.log('url: ', url);
    console.log('file: ', file);

    const newUrl = isAndroid ? `file://${url}` : url;
    if (file >= 5000000) {
      utils.showWarningToast('Image size must be less than 5MB.');
      // setImageUrl(newUrl);
      // setImageRes(res);
    } else {
      const result: any = await imageCompress.Image.compress(url).catch(
        error => {
          console.log('error', error);
        },
      );
      const metadata = await getImageMetaData(result);
      setImageUrl(result);
      setImageRes(res);
    }
    imageRef.current.close();
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      cropping: true,
    })
      .then(res => {
        onPhotoUploadUrlChangeHandler(res, res.path, res.size);
      })
      .catch(error => {
        console.log('ERROR:', error);
        imageRef.current.close();
      });
  };

  const openPhotoBrowser = () => {
    ImageCropPicker.openPicker({
      cropping: true,
    })
      .then(res => {
        onPhotoUploadUrlChangeHandler(res, res.path, res.size);
      })
      .catch(error => {
        console.log('ERROR:', error);
        imageRef.current.close();
      });
  };

  const submitPress = async () => {
    setCheckValid(true);
    if (
      company?.length !== 0 &&
      (numberType === 1
        ? gstNo?.length !== 0 && validationGstNo(gstNo)
        : panNo?.length !== 0 && validationPanNo(panNo)) &&
      // addressName?.length !== 0 &&
      address?.length !== 0 &&
      locality?.length !== 0 &&
      city?.length !== 0 &&
      pinCode?.length !== 0 &&
      pinCode?.length === 6 &&
      validationNumber(pinCode) &&
      state?.length !== 0 &&
      phone?.length !== 0 &&
      validationPhnNumber(phone) &&
      name?.length !== 0
      // && country?.length !== 0
    ) {
      const formData = new FormData();
      formData.append('companyName', company);
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('addressName', 'Company Address');
      formData.append('addressLine', address);
      formData.append('locality', locality);
      formData.append('pincode', pinCode);
      formData.append('city', city);
      formData.append('state', state);
      numberType === 1
        ? formData.append('gstNo', gstNo)
        : formData.append('panNo', panNo);
      if (imageUrl !== '') {
        if (Object.keys(imageRes).length !== 0) {
          formData.append('logo', {
            uri: imageUrl,
            type: `image/${imageUrl.split('.').pop()}`,
            name: 'image',
          });
        } else {
          formData.append('logo', imageUrl);
        }
      }
      // addressObj.forEach((value: any, index: any) => {
      //   for (var key in value) {
      //     formData.append(`address[${[index]}][${key}]`, value[key]);
      //   }
      // });

      if (from === 'Profile') {
        let body = {
          params: formData,
          id: userInfo?.company?.id,
        };
        // console.log('body =================' ,formData.getParts());
        const { data, error }: any = await updateCompany(body);
        if (!error && data?.statusCode === 200) {
          setCheckValid(false);
          utils.showSuccessToast(data.message);
          setImageRes({});
        } else {
          utils.showErrorToast(
            data?.message ? data?.message : error?.data?.message,
          );
          setImageRes({});
        }
        setBtnText('Edit Details');
        setEditInformation(false);
      } else {
        const { data, error }: any = await addCompany(formData);
        if (!error && data?.statusCode === 201) {
          setCheckValid(false);
          navigation.reset({
            index: 0,
            routes: [
              {
                name: RootScreens.DashBoard,
                state: {
                  index: 0,
                  routes: [
                    {
                      name: RootScreens.Home,
                      params: { data: data?.result },
                    },
                  ],
                },
              },
            ],
          });
        } else {
          utils.showErrorToast(
            data?.message ? data?.message : error?.data?.message,
          );
        }
      }
    }
  };

  const onEditPress = () => {
    setBtnText('Save & update');
    setEditInformation(true);
  };

  const dropdownPress = (ref: any) => {
    if (from !== 'Profile') {
      ref?.current?.open();
    } else {
      editInformation && ref?.current?.open();
    }
  };

  const logoutPress = async () => {
    setIsOpenLogout(false);
    setLoading(true)
    const { data, error }: any = await logout({});
    if (!error && data.statusCode === 200) {
      setLoading(true);
      await dispatch(authReset());
      await AsyncStorage.clear();
      const keysToRemove = ['token', 'MyCart', 'MyAddressList', 'NotiToken'];
      await AsyncStorage.multiRemove(keysToRemove);
      await removeToken();
      setLoading(false);
      resetNavigateTo(navigation, RootScreens.Login);
    } else {
      setLoading(false)
      utils.showErrorToast(error.data.message);
    }
  };

  const renderLabel = () => {
    if (selectedState || isFocus) {
      return (
        <FontText
          style={styles.label}
          name={'mont-medium'}
          size={smallest}
          color={'black2'}>
          State
        </FontText>
      );
    }
    return null;
  };


  return (
    <View style={commonStyle.container}>
      <Loader loading={isFetching || isLoading || loading || isProcess} />
      <View
        style={[commonStyle.paddingH4, commonStyle.flex, commonStyle.marginT2]}>
        <KeyboardAwareScrollView  showsVerticalScrollIndicator={false}>
          <View>
            {imageUrl ? (
              <View
                style={{
                  marginBottom: hp(2), //2
                  alignSelf: 'center',
                }}>
                <Image source={{ uri: imageUrl }} style={styles.avatar} />
                <TouchableOpacity
                  onPress={()=>setIsOpen(true)}
                  disabled={from === 'Profile' ? !editInformation : false}
                  style={[
                    commonStyle.abs,
                    {
                      top: hp(10),
                      right: wp(0),
                      borderRadius: normalize(100),
                      backgroundColor: colors.orange3,
                      padding: wp(2),
                    },
                  ]}>
                  <SvgIcons._Camera_Profile width={tabIcon} height={tabIcon} />
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {from !== 'Profile' ? (
                  <TouchableOpacity
                    disabled={from === 'Profile' ? !editInformation : false}
                    style={styles.uploadImgContainer}
                    onPress={()=>setIsOpen(true)}>
                    <SvgIcons.Upload width={wp(8)} height={wp(8)} />
                    <FontText
                      name={'mont-medium'}
                      size={mediumFont}
                      color={'gray3'}
                      pTop={wp(2)}
                      textAlign={'left'}>
                      {'Upload your logo'}
                    </FontText>
                  </TouchableOpacity>
                ) : (
                  <View
                    style={{
                      marginBottom: hp(2),
                      alignSelf: 'center',
                    }}>
                    <Image source={Images.companyImg} style={styles.avatar} />
                    <TouchableOpacity
                      onPress={()=>setIsOpen(true)}
                      disabled={from === 'Profile' ? !editInformation : false}
                      style={[
                        commonStyle.abs,
                        {
                          top: hp(10),
                          right: wp(0),
                          borderRadius: normalize(100),
                          backgroundColor: colors.orange3,
                          padding: wp(2),
                        },
                      ]}>
                      <SvgIcons._Camera_Profile
                        width={tabIcon}
                        height={tabIcon}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
            {from !== 'Profile' ? (
              <RadioButton
                data={NUMBER_TYPE}
                onSelect={(num: any) => {
                  setNumberType(num);
                  setGstNo('');
                  setPanNo('');
                }}
                userOption={numberType}
              />
            ) : null}
            <View
              style={{
                height: checkValid ? numberType === 1 ? !validationGstNo(gstNo) ? wp(16) : wp(12) : !validationGstNo(panNo) ? wp(16) : wp(12) : wp(12)
              }}>
              <OutLine_Input
                setValue={(text: string) => {
                  numberType === 1
                    ? setGstNo(text.trim())
                    : setPanNo(text.trim());
                }}
                fontSize={smallFont}
                color={'darkGray'}
                func={i => (regRef = i)}
                onSubmitEditing={() => nameRef.focus()}
                returnKeyType={'next'}
                returnKeyLabel="next"
                placeholder={
                  numberType === 1
                    ? 'Enter your GST Number'
                    : 'Enter your PAN Number'
                }
                editable={from === 'Profile' ? false : true}
                value={numberType === 1 ? gstNo : panNo}
                label={numberType === 1 ? 'GST Number' : 'PAN Number'}
                fontName={'mont-medium'}
                multiline={undefined}
                height={undefined}
                multilineHeight={undefined}
              />
              {(isValidGstNo || isValidPanNo) && (
                <FontText
                  size={normalize(12)}
                  color={'red'}
                  pTop={wp(1)}
                  textAlign="right"
                  name="regular">
                  {numberType === 1 ? (
                    <>
                      {checkValid && gstNo?.length === 0
                        ? `GST Number is required.`
                        : !validationGstNo(gstNo) && 'Invalid GST Number.'}
                    </>
                  ) : (
                    <>
                      {checkValid && panNo?.length === 0
                        ? `PAN Number is required.`
                        : !validationPanNo(panNo) && 'Invalid PAN Number.'}
                    </>
                  )}
                </FontText>
              )}
            </View>
            <View style={styles.marginTopView}>

              <OutLine_Input
                setValue={(text: string) => {
                  setName(text.trimStart()), setNameTemp(text.trimStart());
                }}
                fontSize={smallFont}
                color={'darkGray'}
                func={i => (nameRef = i)}
                onSubmitEditing={() => phoneRef.focus()}
                returnKeyType={'next'}
                returnKeyLabel="next"
                placeholder={'Enter Your Name'}
                editable={from === 'Profile' ? editInformation : true}
                value={name}
                label={'Full Name'}
                fontName={'mont-medium'}
                multiline={undefined}
                height={undefined}
                multilineHeight={undefined}
              />
              {isValidName && (
                <FontText
                  size={normalize(12)}
                  color={'red'}
                  pTop={wp(1)}
                  textAlign="right"
                  name="regular">{`Name is Required.`}</FontText>
              )}
            </View>
            <View style={styles.marginTopView}>
              <OutLine_Input
                setValue={(text: string) => {
                  if (text.length <= 10) {
                    return setPhone(text.trim()), setPhoneTemp(text.trim());
                  }
                }}
                fontSize={smallFont}
                color={'darkGray'}
                func={i => (phoneRef = i)}
                onSubmitEditing={() => companyRef.focus()}
                returnKeyType={'next'}
                returnKeyLabel="next"
                placeholder={'Enter Your Mobile Number'}
                editable={from === 'Profile' ? editInformation : true}
                value={phone}
                keyboardType={"phone-pad"}
                label={'Mobile Number'}
                fontName={'mont-medium'}
                multiline={undefined}
                height={undefined}
                multilineHeight={undefined}
              />
              {isValidPhone && (
                <FontText
                  size={normalize(12)}
                  color={'red'}
                  pTop={wp(1)}
                  textAlign="right"
                  name="regular">
                  {checkValid && phone?.length === 0
                    ? `Mobile Number is required.`
                    : 'Invalid Mobile Number.'}
                </FontText>
              )}
            </View>
            <View style={styles.marginTopView}>

              <OutLine_Input
                setValue={(text: string) => setCompany(text.trimStart())}
                fontSize={smallFont}
                color={'darkGray'}
                func={i => (companyRef = i)}
                onSubmitEditing={() => addressRef.focus()}
                returnKeyType={'next'}
                returnKeyLabel="next"
                placeholder={'Enter Your Company name'}
                editable={from === 'Profile' ? editInformation : true}
                value={company}
                label={'Company name'}
                fontName={'mont-medium'}
                multiline={undefined}
                height={undefined}
                multilineHeight={undefined}
              />
              {isValidCompanyName && (
                <FontText
                  size={normalize(12)}
                  color={'red'}
                  pTop={wp(1)}
                  textAlign="right"
                  name="regular">
                  {'Company Name is required.'}
                </FontText>
              )}
            </View>

            <View style={styles.marginTopView}>

              <OutLine_Input
                style={{ borderRadius: normalize(20) }}
                setValue={(text: string) => setAddress(text.trimStart())}
                fontSize={smallFont}
                color={'darkGray'}
                func={i => (addressRef = i)}
                onSubmitEditing={() => localityRef.focus()}
                returnKeyType={'next'}
                returnKeyLabel="next"
                placeholder={'Enter Your Address'}
                editable={from === 'Profile' ? editInformation : true}
                value={address}
                label={'Address'}
                fontName={'mont-medium'}
                multiline={true}
                height={undefined}
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

              <OutLine_Input
                setValue={(text: string) => setLocality(text.trimStart())}
                fontSize={smallFont}
                color={'darkGray'}
                func={i => (localityRef = i)}
                onSubmitEditing={() => pinCodeRef.focus()}
                returnKeyType={'next'}
                returnKeyLabel="next"
                placeholder={'Enter Your Locality'}
                editable={from === 'Profile' ? editInformation : true}
                value={locality}
                label={'Locality'}
                fontName={'mont-medium'}
                multiline={undefined}
                height={undefined}
                multilineHeight={undefined}
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

              <OutLine_Input
                setValue={(text: string) => { if (text.length <= 6) { return setPinCode(text.trim()) } }}
                fontSize={smallFont}
                color={'darkGray'}
                func={i => (pinCodeRef = i)}
                onSubmitEditing={() => cityRef.focus()}
                returnKeyType={'next'}
                returnKeyLabel="next"
                keyboardType={"number-pad"}
                placeholder={'Enter Your Pin Code'}
                editable={from === 'Profile' ? editInformation : true}
                value={pinCode}
                label={'Pin Code'}
                fontName={'mont-medium'}
                multiline={undefined}
                height={undefined}
                multilineHeight={undefined}
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

              <OutLine_Input
                setValue={(text: string) => setCity(text.trimStart())}
                fontSize={smallFont}
                color={'darkGray'}
                func={i => (cityRef = i)}
                onSubmitEditing={() => console.log('done...')}
                returnKeyType={'done'}
                returnKeyLabel="done"
                placeholder={'Enter Your City'}
                editable={from === 'Profile' ? editInformation : true}
                value={city}
                label={'City'}
                fontName={'mont-medium'}
                multiline={undefined}
                height={undefined}
                multilineHeight={undefined}
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

            <View style={{ marginVertical: hp(1.5) }}>
              {renderLabel()}
              <Dropdown
                disable={from === 'Profile' ? !editInformation : false}
                dropdownPosition='top'
                style={[styles.dropdown, isFocus && { borderColor: colors.lightGray }]}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                data={STATES_DATA}
                showsVerticalScrollIndicator={false}
                // search
                inverted={false}
                containerStyle={{ borderRadius: normalize(20), marginBottom: hp(1.5) ,borderWidth:1,borderColor:colors.lightGray}}
                itemContainerStyle={{ borderRadius: normalize(20), backgroundColor: colors.transparent }}
                maxHeight={hp(30)}
                labelField="label"
                valueField="value"
                placeholder={!isFocus ? 'State' : '...'}
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

          </View>
        </KeyboardAwareScrollView>
        {from === 'Profile' ? (
          <Button
            onPress={() => {
              editInformation ? submitPress() : onEditPress();
            }}
            bgColor={'orange'}
            style={styles.buttonContainer}>
            <FontText name={'mont-bold'} size={fontSize} color={'white'}>
              {btnText}
            </FontText>
          </Button>
        ) : (
          <Button
            onPress={submitPress}
            bgColor={'orange'}
            style={styles.buttonContainer}>
            <FontText name={'mont-bold'} size={fontSize} color={'white'}>
              {'Submit'}
            </FontText>
          </Button>
        )}

        <RBSheet
          ref={imageRef}
          height={hp(20)}
          closeOnPressMask
          closeOnPressBack
          closeOnDragDown
          dragFromTopOnly>
          <View style={[commonStyle.rowJEC, { marginTop: hp(2) }]}>
            <View style={{ borderWidth: 1, borderStyle: "dashed", borderColor: colors.orange, borderRadius: normalize(15) }}>
              <TouchableOpacity style={{ backgroundColor: colors.orange2, justifyContent: "center", alignItems: "center", height: hp(12), width: wp(27), borderRadius: normalize(15) }} onPress={openCamera}>
                <SvgIcons.Camera width={wp(15)} height={wp(15)} />
                <FontText
                  name={'mont-medium'}
                  size={fontSize}
                  color={'orange'}>
                  {'camera'}
                </FontText>
              </TouchableOpacity>
            </View>
            <View style={{ borderWidth: 1, borderStyle: "dashed", borderColor: colors.orange, borderRadius: normalize(15) }}>
              <TouchableOpacity
                style={{ backgroundColor: colors.orange2, justifyContent: "center", alignItems: "center", height: hp(12), width: wp(27), borderRadius: normalize(15) }}
                onPress={openPhotoBrowser}>
                <SvgIcons.Gallery width={wp(15)} height={wp(15)} />
                <FontText
                  name={'mont-medium'}
                  size={fontSize}
                  color={'orange'}>
                  {'Gallery'}
                </FontText>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>
        <Modal
        visible={isOpen}
        onBackPress={() => setIsOpen(false)}
        description={`You want to Remove or Edit\n Profile picture?`}
        title={' '}
        titleStyle={{ fontSize: normalize(14) }}
        rightBtnText={'Edit'}
        leftBtnText={'Remove'}
        rightBtnPress={() => {
          setIsOpen(false)
           imageRef.current.open();
        }}
        leftBtnPress={() => {
          setImageUrl('')
          setIsOpen(false)
        }}
        onTouchPress={() => setIsOpen(false)}
        leftBtnStyle={{
          width: '48%',
          backgroundColor: colors.orange4,
          borderWidth: 0,
          marginTop: wp(6),
          borderRadius: normalize(100),
        }}
        rightBtnStyle={{
          backgroundColor: colors.orange,
          width: '48%',
          marginTop: wp(6),
        }}
        leftBtnTextStyle={{
          color: colors.orange,
          fontSize: mediumFont,
          fontFamily: fonts['mont-bold'],
        }}
        rightBtnTextStyle={{
          fontSize: mediumFont,
          fontFamily: fonts['mont-bold'],
        }}
        style={{ paddingHorizontal: wp(4), paddingVertical: wp(5) }}
      />
        <Modal
          visible={isOpenLogout}
          onBackPress={() => {
            setIsOpenLogout(false);
          }}
          title={' '}
          children={
            <View style={{ alignItems: "center", flexDirection: "column" }}>
              <View style={{ backgroundColor: colors.orange4, borderRadius: normalize(10), padding: normalize(20), alignItems: "center", justifyContent: "center" }}>
                <SvgIcons.Logout_Profile />
              </View>
              <FontText
                style={{ marginVertical: hp(2) }}
                name={'mont-bold'}
                size={largeFont}
                color={'black'}>
                {'Logout?'}
              </FontText>
              <FontText
                name={'mont-semibold'}
                size={mediumFont}
                color={'black2'}>
                {'Are you Sure, do you want to logout?'}
              </FontText>
            </View>
          }
          rightBtnText={'Yes'}
          leftBtnText={'No'}
          rightBtnColor={'orange'}
          leftBtnColor={'orange4'}
          rightBtnPress={logoutPress}
          leftBtnPress={() => setIsOpenLogout(false)}
          onTouchPress={() => setIsOpenLogout(false)}
          leftBtnStyle={{
            width: '48%',
            backgroundColor: colors.orange4,
            borderWidth: 0,
            marginTop: wp(6),
            borderRadius: normalize(100),
          }}
          rightBtnStyle={{
            backgroundColor: colors.orange,
            width: '48%',
            marginTop: wp(6),
          }}
          leftBtnTextStyle={{
            color: colors.orange,
            fontSize: mediumFont,
            fontFamily: fonts['mont-bold'],
          }}
          rightBtnTextStyle={{
            fontSize: mediumFont,
            fontFamily: fonts['mont-bold'],
          }}
        />



      </View>
    </View>
  );
};

export default CompanyDetail;

const styles = StyleSheet.create({
  inputText: {
    borderRadius: 10,
    paddingLeft: wp(12),
    color: colors.black,
    fontSize: normalize(14),
    fontFamily: fonts['mont-medium'],
    backgroundColor: colors.gray2,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    height: hp(6),
  },
  buttonContainer: {
    borderRadius: normalize(100),
    marginBottom: hp(2),
    marginTop:hp(1)
  },
  marginTopView: {
    marginTop: hp(0.8),
  },
  dropdownView: {
    // borderRadius: 10,
    // flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
    // height: hp(6),
    // backgroundColor: colors.gray2,
    // paddingHorizontal: wp(3),
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
    width: hp(16),
    height: hp(16),
    borderRadius: hp(8),
    alignSelf: 'center',
    resizeMode: 'cover',
    marginBottom: hp(2),
  },
  iconView: {
    padding: wp(3),
    borderRadius: normalize(5),
    backgroundColor: colors.white,
  },
  dropdown: {
    height: hp(5),
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: normalize(100),
    paddingHorizontal: wp(2),
    // width:wp(90)
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    left: wp(3.5),
    bottom: hp(4),
    zIndex: 999,
    backgroundColor:"white",
    width:wp(10),
    textAlign:"center"
  },
  placeholderStyle: {
    fontSize: mediumFont,
    color: colors.darkGray,
    fontStyle: fonts["mont-medium"],
    left: wp(2)
  },
  selectedTextStyle: {
    fontSize: smallFont,
    color: colors.darkGray,
    fontStyle: fonts["mont-medium"],
    paddingLeft: wp(1.5)
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
