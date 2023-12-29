import {Dimensions, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
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
import BottomSheet from '../BottomSheet';
import {COUNTRY_LIST, STATES_LIST} from '../../types/data';
import {
  useAddCompanyMutation,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
} from '../../api/company';
import utils from '../../helper/utils';
import {useSelector} from 'react-redux';

const CompanyDetail = (props: any) => {
  const {setOpenPopup, from, navigation} = props;
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const {data, isFetching} = useGetCompanyQuery(userInfo?.companyId?._id, {
    refetchOnMountOrArgChange: true,
  });
  const [addCompany, {isLoading}] = useAddCompanyMutation();
  const [updateCompany, {isLoading: isProcess}] = useUpdateCompanyMutation();
  const [editInformation, setEditInformation] = React.useState(false);
  const [btnText, setBtnText] = React.useState('Edit Details');

  console.log('data', data)

  const regRef: any = useRef();
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
  const [registerNo, setRegisterNo] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [locality, setLocality] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');

  const isValidRegNo = checkValid && registerNo.length === 0;
  const isValidCompanyName = checkValid && company.length === 0;
  const isValidAddress = checkValid && address.length === 0;
  const isValidPinCode = checkValid && pinCode.length === 0;
  const isValidLocality = checkValid && locality.length === 0;
  const isValidCity = checkValid && city.length === 0;
  const isValidState = checkValid && state.length === 0;
  const isValidCountry = checkValid && country.length === 0;

  useEffect(() => {
    setImageUrl(data?.result ? data?.result?.logo : '');
    setCompany(data?.result ? data?.result?.companyName : '');
    setAddress(data?.result ? data?.result.address[0]?.addressLine : '');
    setLocality(data?.result ? data?.result.address[0]?.locality : '');
    setPinCode(data?.result ? data?.result.address[0]?.pincode : '');
    setCity(data?.result ? data?.result.address[0]?.city : '');
    setState(data?.result ? data?.result.address[0]?.state : '');
    setCountry(data?.result ? data?.result.address[0]?.country : '');
  }, [data, isFetching]);

  const imagePress = () => {
    imageRef.current.open();
  };

  const onPhotoUploadUrlChangeHandler = async (
    res: any,
    url: any,
    file: any,
  ) => {
    const newUrl = isAndroid ? `file://${url}` : url;
    if (file <= 4000000) {
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
      address.length !== 0 &&
      locality.length !== 0 &&
      city.length !== 0 &&
      pinCode.length !== 0 &&
      state.length !== 0 &&
      country.length !== 0
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
          country: country,
        },
      ];
      formData.append('companyName', company);
      userInfo?.companyId?._id === undefined &&
        formData.append('registerNo', registerNo);
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
          _id: userInfo?.companyId?._id,
        };
        const {data, error}: any = await updateCompany(body);
        console.log('DATA', data, error);
        if (!error && data?.statusCode === 200) {
          setCheckValid(false);
          setOpenPopup && setOpenPopup(false);
          utils.showSuccessToast(data.message);
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
          setOpenPopup && setOpenPopup(false);
          utils.showSuccessToast(data.message);
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

  return (
    <View style={commonStyle.container}>
      <NavigationBar
        hasCenter
        hasLeft
        left={
          <View style={[commonStyle.rowAC, {paddingLeft: wp(1)}]}>
            {from === 'Profile' ? (
              <TouchableOpacity
                style={[commonStyle.iconView, {marginRight: wp(5)}]}
                onPress={() => navigation.goBack()}>
                <SvgIcons.BackArrow width={tabIcon} height={tabIcon} />
              </TouchableOpacity>
            ) : null}
            <FontText
              name={'lexend-semibold'}
              size={mediumLargeFont}
              color={'black'}
              textAlign={'left'}>
              {from === 'Profile'
                ? 'Company Detail'
                : 'Enter your company detail'}
            </FontText>
          </View>
        }
        leftStyle={{width: '100%'}}
        hasRight
        style={{marginHorizontal: wp(2.5)}}
        borderBottomWidth={0}
      />
      <Loader loading={isFetching || isLoading} />
      <View style={[commonStyle.paddingH4, commonStyle.flex]}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View>
            {imageUrl ? (
              <TouchableOpacity
                style={{marginBottom: hp(2)}}
                disabled={from === 'Profile' ? !editInformation : false}
                onPress={imagePress}>
                <Image source={{uri: imageUrl}} style={styles.avatar} />
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
              <>
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
                    {'Register Number:'}
                  </FontText>
                </View>
                <Input
                  editable={from === 'Profile' ? editInformation : true}
                  ref={regRef}
                  value={registerNo}
                  onChangeText={(text: string) => setRegisterNo(text.trim())}
                  placeholder={'Enter Register Number'}
                  autoCapitalize="none"
                  placeholderTextColor={'placeholder'}
                  fontSize={fontSize}
                  inputStyle={styles.inputText}
                  style={styles.input}
                  color={'black'}
                  returnKeyType={'next'}
                  blurOnSubmit
                  onSubmit={() => {
                    companyRef?.current.focus();
                  }}
                  children={
                    <View style={[commonStyle.abs, {left: wp(4)}]}>
                      <SvgIcons.PinCode width={iconSize} height={iconSize} />
                    </View>
                  }
                />
                {isValidRegNo && (
                  <FontText
                    size={normalize(12)}
                    color={'red'}
                    pTop={wp(1)}
                    textAlign="right"
                    name="regular">
                    {'Register Number is required.'}
                  </FontText>
                )}
              </>
            ) : null}
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
                inputStyle={[styles.inputText,{ paddingTop:hp(2)}]}
                style={[styles.input,{marginVertical:hp(2)}]}
                returnKeyType={'next'}
                multiline
                blurOnSubmit
                onSubmit={() => {
                  localityRef?.current.focus();
                }}
                children={
                  <View style={[commonStyle.abs, {left: wp(4), top:0}]}>
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
                onPress={() => dropdownPress(stateRef)}
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
        />
        <RBSheet
          ref={imageRef}
          height={hp(20)}
          closeOnPressMask
          closeOnPressBack
          closeOnDragDown
          dragFromTopOnly>
          <View style={[commonStyle.rowJEC,{marginTop:hp(2)}]}>
            <TouchableOpacity onPress={openCamera}>
              <SvgIcons.Camera width={wp(15)} height={wp(15)}/>
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
              <SvgIcons.Gallery width={wp(15)} height={wp(15)}/>
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
    width: hp(15),
    height: hp(15),
    borderRadius: 6,
    alignSelf: 'center',
    resizeMode: 'cover',
    marginBottom: hp(2),
  },
  iconView: {
    // padding: wp(2),
    // borderRadius: normalize(25),
    // borderColor: colors.orange,
    // borderWidth: 2,
  },
});
