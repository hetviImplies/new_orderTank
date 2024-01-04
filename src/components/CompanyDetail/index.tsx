import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import colors from '../../assets/colors';
import {Button, FontText, Input, Loader, NavigationBar} from '..';
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
// import BottomSheet from '../BottomSheet';
import {
  COUNTRY_LIST,
  NUMBER_TYPE,
  STATES_DATA,
  STATES_LIST,
} from '../../types/data';
import {
  useAddCompanyMutation,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
} from '../../api/company';
import utils from '../../helper/utils';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authReset, setCurrentUser} from '../../redux/slices/authSlice';
import {RootScreens} from '../../types/type';
import {resetNavigateTo} from '../../helper/navigationHelper';
import RadioButton from '../Common/RadioButton';
import {useUpdateProfileMutation} from '../../api/profile';
import BottomSheet from '../BottomSheet';
import {useGetCurrentUserQuery} from '../../api/auth';

const CompanyDetail = (props: any) => {
  const {setOpenPopup, from, navigation} = props;
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const {data, isFetching} = useGetCompanyQuery(userInfo?.companyId?._id, {
    refetchOnMountOrArgChange: true,
  });
  const {data: userData, isFetching: isFetch} = useGetCurrentUserQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const [updateProfile, {isLoading: isProcessing}] = useUpdateProfileMutation();
  const [addCompany, {isLoading}] = useAddCompanyMutation();
  const [updateCompany, {isLoading: isProcess}] = useUpdateCompanyMutation();
  const [editInformation, setEditInformation] = React.useState(false);
  const [btnText, setBtnText] = React.useState('Edit Details');
  const [loading, setLoading] = useState(false);
  const gstNoRegx = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  // const gstNoRegx =
  //   /^[0-9]{2}[A-Z]{3}[ABCFGHLJPTF]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const panNoRegx = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const phoneRegx = /^[6-9]\d{9}$/;

  const validationGstNo = (val: any) => {
    const result = gstNoRegx.test(val.trim());
    return result;
  };

  const validationPanNo = (val: any) => {
    const result = panNoRegx.test(val.trim());
    return result;
  };

  const regRef: any = useRef();
  const nameRef: any = useRef();
  const phoneRef: any = useRef();
  const companyRef: any = useRef();
  const addressRef: any = useRef();
  const localityRef: any = useRef();
  const pinCodeRef: any = useRef();
  const cityRef: any = useRef();
  const stateRef: any = useRef();
  const countryRef: any = useRef();
  const imageRef: any = useRef();

  const [checkValid, setCheckValid] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageRes, setImageRes] = useState<any>({});
  const [gstNo, setGstNo] = useState('');
  const [panNo, setPanNo] = useState('');
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [nameTemp, setNameTemp] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneTemp, setPhoneTemp] = useState('');
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [numberType, setNumberType] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedState, setSelectedState] = useState<number>();

  const validationNumber = (val: any) => {
    const result = phoneRegx.test(val.trim());
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
    (phone?.length === 0 || phone?.length < 10 || !validationNumber(phone));
  const isValidAddress = checkValid && address?.length === 0;
  const isValidPinCode = checkValid && pinCode?.length === 0;
  const isValidLocality = checkValid && locality?.length === 0;
  const isValidCity = checkValid && city?.length === 0;
  const isValidState = checkValid && state?.length === 0;
  // const isValidCountry = checkValid && country.length === 0;

  useEffect(() => {
    console.log('Checking...');
    dispatch(setCurrentUser(userData?.result));
  }, [isProcessing]);

  useEffect(() => {
    setNumberType(data?.result?.isGst ? 1 : data?.result?.isPan ? 2 : 1);
    setImageUrl(data?.result ? data?.result?.logo : '');
    setName(nameTemp !== '' ? nameTemp : userData?.result?.name);
    setGstNo(data?.result?.gstNo ? data?.result?.gstNo : '');
    setPanNo(data?.result?.panNo ? data?.result?.panNo : '');
    setPhone(phoneTemp !==  '' ? phoneTemp : userData?.result?.phone);
    setCompany(data?.result ? data?.result?.companyName : '');
    setAddress(data?.result ? data?.result.address[0]?.addressLine : '');
    setLocality(data?.result ? data?.result.address[0]?.locality : '');
    setPinCode(data?.result ? data?.result.address[0]?.pincode : '');
    setCity(data?.result ? data?.result.address[0]?.city : '');
    setState(data?.result ? data?.result.address[0]?.state : '');
    STATES_DATA.map((state, index) => {
      if (data?.result?.address[0]?.state === state.label) {
        setSelectedState(index);
      }
    });
    // setCountry(data?.result ? data?.result.address[0]?.country : '');
  }, [data, isFetching, userData]);

  // console.log('ddsxkeoqwdk', name, phone);

  const imagePress = () => {
    imageRef.current.open();
  };

  const onPhotoUploadUrlChangeHandler = async (
    res: any,
    url: any,
    file: any,
  ) => {
    const newUrl = isAndroid ? `file://${url}` : url;
    if (file <= 5000000) {
      setImageUrl(newUrl);
      setImageRes(res);
    } else {
      const result = await imageCompress.Image.compress(newUrl, {
        compressionMethod: 'auto',
      });
      setImageUrl(result);
      setImageRes(res);
    }
    imageRef.current.close();
  };

  const openCamera = () => {
    ImageCropPicker.openCamera({
      cropping: true,
      height: 400,
      width: 400,
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
      height: 400,
      width: 400,
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
      company.length !== 0 &&
      (numberType === 1
        ? gstNo.length !== 0 && validationGstNo(gstNo)
        : panNo.length !== 0 && validationPanNo(panNo)) &&
      address.length !== 0 &&
      locality.length !== 0 &&
      city.length !== 0 &&
      pinCode.length !== 0 &&
      state.length !== 0 &&
      phone.length !== 0 &&
      validationNumber(phone) &&
      name.length !== 0
      // && country.length !== 0
    ) {
      const formData = new FormData();
      const addressObj = [
        {
          isPriority: true,
          addressName: 'Home',
          addressLine: address,
          locality: locality,
          pincode: pinCode,
          city: city,
          state: state,
          // country: country,
        },
      ];
      formData.append('companyName', company);
      numberType === 1
        ? formData.append('gstNo', gstNo)
        : formData.append('panNo', panNo);
      formData.append('isGst', numberType === 1 ? true : false);
      formData.append('isPan', numberType === 2 ? true : false);
      // userInfo?.companyId?._id === undefined &&
      // formData.append('registerNo', registerNo);
      imageUrl !== '' &&
        Object.keys(imageRes).length !== 0 &&
        formData.append('logo', {
          uri: imageUrl,
          type: `image/${imageUrl.split('.').pop()}`,
          name: 'image',
        });
      addressObj.forEach((value: any, index: any) => {
        for (var key in value) {
          formData.append(`address[${[index]}][${key}]`, value[key]);
        }
      });

      if (from === 'Profile') {
        let body = {
          params: formData,
          _id: userData?.result?.companyId?._id,
        };
        const {data, error}: any = await updateCompany(body);
        console.log('DATA', data, error);
        if (!error && data?.statusCode === 200) {
          setCheckValid(false);
          if (
            userData?.result?.name !== name ||
            userData?.result?.phone !== phone
          ) {
            let params = {
              name: name,
              phone: phone,
            };
            const {data, error: err}: any = await updateProfile(params);
            if (!err) {
              setOpenPopup && setOpenPopup(false);
            } else {
              utils.showSuccessToast(err.message);
            }
          } else {
            setOpenPopup && setOpenPopup(false);
          }
        } else {
          utils.showErrorToast(data.message || error);
        }
        setBtnText('Edit Details');
        setEditInformation(false);
      } else {
        const {data, error}: any = await addCompany(formData);
        console.log('DATA', data, error);
        if (!error && data?.statusCode === 201) {
          setCheckValid(false);
          if (
            userData?.result?.name !== name ||
            userData?.result?.phone !== phone
          ) {
            let params = {
              name: name,
              phone: phone,
            };
            const {data, error: err}: any = await updateProfile(params);
            if (!err) {
              setOpenPopup && setOpenPopup(false);
            } else {
              utils.showSuccessToast(err.message);
            }
          } else {
            setOpenPopup && setOpenPopup(false);
          }
          // utils.showSuccessToast(data.message);
        } else {
          utils.showErrorToast(data.message || error);
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
    setOpenPopup(false);
    setTimeout(async () => {
      // setLoading(true);
      // await AsyncStorage.clear();
      // await AsyncStorage.removeItem('token');
      // dispatch(authReset());
      // setLoading(false);
      resetNavigateTo(navigation, RootScreens.Login);
    }, 500);
    // dispatch(setIsAuthenticated(false));
  };

  return (
    <View style={commonStyle.container}>
      {from !== 'Profile' ? (
        <NavigationBar
          hasCenter
          hasRight
          hasLeft
          left={
            <View style={[commonStyle.rowAC, {paddingLeft: wp(1)}]}>
              <FontText
                name={'lexend-semibold'}
                size={mediumLargeFont}
                color={'black'}
                textAlign={'left'}>
                {'Enter your company detail'}
              </FontText>
            </View>
          }
          right={
            <TouchableOpacity onPress={logoutPress}>
              <SvgIcons.PowerOff
                width={wp(7)}
                height={wp(7)}
                fill={colors.orange}
              />
            </TouchableOpacity>
          }
          leftStyle={{width: '75%'}}
          style={{marginHorizontal: wp(2.5)}}
          borderBottomWidth={0}
        />
      ) : null}
      <Loader
        loading={
          isFetching ||
          isLoading ||
          loading ||
          isProcessing ||
          isFetch ||
          isProcess
        }
      />
      <View
        style={[commonStyle.paddingH4, commonStyle.flex, commonStyle.marginT2]}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View>
            {imageUrl ? (
              <TouchableOpacity
                style={{
                  marginBottom: hp(2),
                  alignSelf: 'center',
                }}
                disabled={from === 'Profile' ? !editInformation : false}
                onPress={imagePress}>
                <Image source={{uri: imageUrl}} style={styles.avatar} />
                <TouchableOpacity
                  onPress={() => setImageUrl('')}
                  style={[commonStyle.abs, {top: hp(1), right: wp(1)}]}>
                  <SvgIcons.Close width={tabIcon} height={tabIcon} />
                </TouchableOpacity>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                disabled={from === 'Profile' ? !editInformation : false}
                style={styles.uploadImgContainer}
                onPress={imagePress}>
                <SvgIcons.Upload width={wp(8)} height={wp(8)} />
                <FontText
                  name={'lexend-regular'}
                  size={mediumFont}
                  color={'gray3'}
                  pTop={wp(2)}
                  textAlign={'left'}>
                  {'Upload your logo'}
                </FontText>
              </TouchableOpacity>
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
                {numberType === 1 ? 'GST Number:' : 'PAN Number:'}
              </FontText>
            </View>
            <Input
              editable={from === 'Profile' ? false : true}
              ref={regRef}
              value={numberType === 1 ? gstNo : panNo}
              onChangeText={(text: string) => {
                numberType === 1
                  ? setGstNo(text.trim())
                  : setPanNo(text.trim());
              }}
              placeholder={
                numberType === 1 ? 'Enter GST Number' : 'Enter PAN Number'
              }
              autoCapitalize="none"
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              inputStyle={[
                styles.inputText,
                {color: from === 'Profile' ? colors.gray : colors.black2},
              ]}
              style={styles.input}
              returnKeyType={'next'}
              blurOnSubmit
              onSubmit={() => {
                nameRef?.current.focus();
              }}
              children={
                <View style={[commonStyle.abs, {left: wp(4)}]}>
                  <SvgIcons.PinCode width={iconSize} height={iconSize} />
                </View>
              }
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
                    {checkValid && gstNo.length === 0
                      ? `GST Number is required.`
                      : !validationGstNo(gstNo) && 'Invalid GST Number.'}
                  </>
                ) : (
                  <>
                    {checkValid && panNo.length === 0
                      ? `PAN Number is required.`
                      : !validationPanNo(panNo) && 'Invalid PAN Number.'}
                  </>
                )}
              </FontText>
            )}
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
                  {'Full name:'}
                </FontText>
              </View>
              <Input
                ref={nameRef}
                editable={from === 'Profile' ? editInformation : true}
                value={name}
                onChangeText={(text: string) => {setName(text.trimStart()), setNameTemp(text.trimStart())}}
                autoCapitalize="none"
                placeholder={'Enter Full Name'}
                placeholderTextColor={'placeholder'}
                fontSize={fontSize}
                inputStyle={styles.inputText}
                color={'black'}
                returnKeyType={'next'}
                style={[styles.input]}
                onSubmit={() => {
                  phoneRef?.current.focus();
                }}
                children={
                  <View style={[commonStyle.abs, {left: wp(4)}]}>
                    <SvgIcons.User width={iconSize} height={iconSize} />
                  </View>
                }
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
                  {'Mobile Number:'}
                </FontText>
              </View>
              <Input
                ref={phoneRef}
                editable={from === 'Profile' ? editInformation : true}
                value={phone}
                onChangeText={(text: string) => {setPhone(text.trim()), setPhoneTemp(text.trim())}}
                placeholder={'Enter Mobile Number'}
                autoCapitalize="none"
                placeholderTextColor={'placeholder'}
                fontSize={fontSize}
                inputStyle={[styles.inputText, {paddingLeft: wp(20)}]}
                style={styles.input}
                color={'black'}
                returnKeyType={'done'}
                maxLength={10}
                keyboardType={'numeric'}
                onSubmit={() => {
                  companyRef?.current.focus();
                }}
                children={
                  <View
                    style={[commonStyle.abs, commonStyle.rowAC, {left: wp(4)}]}>
                    <SvgIcons.Phone width={iconSize} height={iconSize} />
                    <FontText
                      name={'lexend-regular'}
                      size={mediumFont}
                      color={'black2'}
                      pLeft={wp(4)}
                      textAlign={'left'}>
                      {'+91'}
                    </FontText>
                  </View>
                }
              />
              {isValidPhone && (
                <FontText
                  size={normalize(12)}
                  color={'red'}
                  pTop={wp(1)}
                  textAlign="right"
                  name="regular">
                  {checkValid && phone.length === 0
                    ? `Mobile Number is required.`
                    : 'Invalid Mobile Number.'}
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
                  {'Company name:'}
                </FontText>
              </View>
              <Input
                editable={from === 'Profile' ? editInformation : true}
                ref={companyRef}
                value={company}
                onChangeText={(text: string) => setCompany(text.trimStart())}
                placeholder={'Enter Company Name'}
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
                    <SvgIcons.Company width={iconSize} height={iconSize} />
                  </View>
                }
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
                  {'Address:'}
                </FontText>
              </View>
              <Input
                editable={from === 'Profile' ? editInformation : true}
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
                editable={from === 'Profile' ? editInformation : true}
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
                editable={from === 'Profile' ? editInformation : true}
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
                editable={from === 'Profile' ? editInformation : true}
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
                disabled={from === 'Profile' ? !editInformation : false}
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
                onPress={() => dropdownPress(countryRef)}
                disabled={from === 'Profile' ? !editInformation : false}
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
          </View>
        </KeyboardAwareScrollView>
        {from === 'Profile' ? (
          <Button
            onPress={() => {
              editInformation ? submitPress() : onEditPress();
            }}
            bgColor={'orange'}
            style={styles.buttonContainer}>
            <FontText name={'lexend-semibold'} size={fontSize} color={'white'}>
              {btnText}
            </FontText>
          </Button>
        ) : (
          <Button
            onPress={submitPress}
            bgColor={'orange'}
            style={styles.buttonContainer}>
            <FontText name={'lexend-semibold'} size={fontSize} color={'white'}>
              {'Submit'}
            </FontText>
          </Button>
        )}
        <BottomSheet
          onPressCloseModal={() => stateRef?.current?.close()}
          refName={stateRef}
          modalHeight={hp(50)}
          title={'Select State'}
          searcheble
          data={STATES_DATA}
          selectedIndex={selectedState}
          onPress={(item: any, index: any) => {
            console.log('item selected', item, index);
            setSelectedState(index);
            setState(item?.label);
            stateRef?.current?.close();
          }}
        />
        {/* <BottomSheet
          withReactModal
          onPressCloseModal={() => stateRef?.current?.close()}
          refName={stateRef}
          modalHeight={hp(50)}
          modalStyle={{height: hp(50)}}
          title={'Select State'}
          searcheble
          data={STATES_LIST}
          onOpen={() => {}}
          // searchValue={searchUser}
          // selectedIndex={userId}
          onChangeText={(text:any) => setSearch(text)}
          onPress={(item:any, index:any) => {
            setState(item);
            // setUserIndex(index);
            // setAssinedToValue(item?.label);
            // setuserId(item?.value);
            // userNameRef?.current?.close();
          }}
        /> */}
        {/* <BottomSheet
          height={hp(50)}
          sheetRef={stateRef}
          itemPress={(val: any) => {
            setState(val);
            stateRef.current.close();
          }}
          selectedItem={state}
          data={STATES_LIST}
        />
        <BottomSheet
          height={hp(50)}
          sheetRef={countryRef}
          itemPress={(val: any) => {
            setCountry(val);
            countryRef.current.close();
          }}
          selectedItem={country}
          data={COUNTRY_LIST}
        /> */}
        <RBSheet
          ref={imageRef}
          height={hp(20)}
          closeOnPressMask
          closeOnPressBack
          closeOnDragDown
          dragFromTopOnly>
          <View style={[commonStyle.rowJEC, {marginTop: hp(2)}]}>
            <TouchableOpacity onPress={openCamera}>
              <SvgIcons.Camera width={wp(15)} height={wp(15)} />
              <FontText
                name={'lexend-regular'}
                size={fontSize}
                color={'orange'}>
                {'camera'}
              </FontText>
            </TouchableOpacity>
            <TouchableOpacity
              // style={styles.iconView}
              onPress={openPhotoBrowser}>
              <SvgIcons.Gallery width={wp(15)} height={wp(15)} />
              <FontText
                name={'lexend-regular'}
                size={fontSize}
                color={'orange'}>
                {'Gallery'}
              </FontText>
            </TouchableOpacity>
            {/* <Button
              onPress={openCamera}
              bgColor={'orange'}
              style={[
                styles.buttonContainer,
                {
                  marginTop: hp(1),
                  width: '80%',
                },
              ]}>
              <FontText
                name={'opensans-semibold'}
                size={fontSize}
                color={'white'}>
                {'Take photo with camera'}
              </FontText>
            </Button>
            <Button
              onPress={openPhotoBrowser}
              bgColor={'orange'}
              style={[
                styles.buttonContainer,
                {width: '80%', marginTop: hp(2)},
              ]}>
              <FontText
                name={'opensans-semibold'}
                size={fontSize}
                color={'white'}>
                {'Upload photo from gallery'}
              </FontText>
            </Button> */}
          </View>
        </RBSheet>
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
});
