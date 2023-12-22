import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import SvgIcons from '../../assets/SvgIcons';
import colors from '../../assets/colors';
import {NavigationBar, FontText, Input, Button, Loader} from '../../components';
import commonStyle, {
  fontSize,
  iconSize,
  mediumFont,
  mediumLargeFont,
  smallFont,
} from '../../styles';
import {hp, isAndroid, normalize, wp} from '../../styles/responsiveScreen';
import RBSheet from 'react-native-raw-bottom-sheet';
import ImageCropPicker from 'react-native-image-crop-picker';
import imageCompress from 'react-native-compressor';
import {useRegisterMutation, useUpdateProfileMutation} from '../../api/auth';
import utils from '../../helper/utils';
import {BASE_URL} from '../../types/data';

const EditProfileScreen = ({navigation, route}: any) => {
  const [update, {isLoading}] = useUpdateProfileMutation();
  const profile = route?.params?.data;

  const [userName, setUserName] = useState(profile?.userName);
  const [email, setEmail] = useState(profile?.email);
  const [phoneNumber, setPhoneNumber] = useState(
    profile?.phone === undefined ? '' : profile?.phone,
  );
  const [imageUrl, setImageUrl] = useState(
    profile?.profilePic === undefined ? '' : `${BASE_URL}/${profile?.profilePic}`,
  );
  const [imageRes, setImageRes] = useState<any>({});
  const [checkValid, setCheckValid] = useState(false);

  const imageRef: any = useRef();
  const nameRef: any = useRef();
  const emailRef: any = useRef();
  const phnNoRef: any = useRef();

  const emailRegx =
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  const validationEmail = (val: any) => {
    const result = emailRegx.test(val);
    return result;
  };

  const isValidName = checkValid && userName.length === 0;
  const isValidPhoneNo =
    checkValid && (phoneNumber.length === 0 || phoneNumber.length < 10);
  const isValidEmail =
    checkValid && (email.length === 0 || !validationEmail(email));

  const savePress = async () => {
    setCheckValid(true);
    if (
      userName.length !== 0 &&
      email.length !== 0 &&
      validationEmail(email)
      // phoneNumber.length !== 0
    ) {
      const formData = new FormData();
      formData.append('userName', userName);
      phoneNumber !== '' && formData.append('phone', phoneNumber);
      Object.keys(imageRes).length !== 0 &&
        formData.append('image', {
          uri: imageUrl,
          type: `image/${imageUrl.split('.').pop()}`,
          name: 'image',
        });
      const {data, error}: any = await update(formData);
      if (!error && data?.statusCode === 200) {
        setCheckValid(false);
        navigation.goBack();
        utils.showSuccessToast(data.message);
      } else {
        utils.showErrorToast(data.message || error);
      }
    }
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
    }).then(res => {
      onPhotoUploadUrlChangeHandler(res, res.path, res.size);
    });
  };

  const openPhotoBrowser = () => {
    ImageCropPicker.openPicker({
      cropping: true,
      height: 400,
      width: 400,
    }).then(res => {
      onPhotoUploadUrlChangeHandler(res, res.path, res.size);
    });
  };

  const imagePress = () => {
    imageRef.current.open();
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
            {'Edit Profile'}
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
        {imageUrl ? (
          <TouchableOpacity style={{marginBottom: hp(2)}} onPress={imagePress}>
            <Image source={{uri: imageUrl}} style={styles.avatar} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{marginBottom: hp(2)}} onPress={imagePress}>
            <View style={styles.staticImg}>
              <SvgIcons.BigAdd width={wp(15)} height={wp(15)} />
            </View>
            <FontText
              name={'opensans-semibold'}
              size={smallFont}
              color={'black2'}
              pLeft={wp(1)}
              pTop={wp(2)}
              textAlign={'center'}>
              {'Image'}
            </FontText>
          </TouchableOpacity>
        )}
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
          value={userName}
          onChangeText={(text: string) => setUserName(text.trimStart())}
          autoCapitalize="none"
          placeholder={'Enter User Name'}
          placeholderTextColor={'placeholder'}
          fontSize={fontSize}
          inputStyle={styles.inputText}
          color={'black'}
          returnKeyType={'next'}
          style={[styles.input]}
          onSubmit={() => {
            emailRef?.current.focus();
          }}
        />
        {isValidName && (
          <FontText
            size={normalize(12)}
            color={'red'}
            pTop={wp(1)}
            textAlign="right"
            name="regular">{`User name is Required.`}</FontText>
        )}
        <View style={styles.marginTopView}>
          <FontText
            name={'opensans-semibold'}
            size={smallFont}
            color={'black2'}
            pLeft={wp(1)}
            pBottom={wp(2)}
            textAlign={'left'}>
            {'Email'}
          </FontText>
          <Input
            ref={emailRef}
            value={email}
            editable={false}
            onChangeText={(text: string) => setEmail(text.trimStart())}
            autoCapitalize="none"
            placeholder={'Enter Email'}
            placeholderTextColor={'placeholder'}
            fontSize={fontSize}
            inputStyle={[styles.inputText, {color: colors.gray}]}
            color={'black'}
            returnKeyType={'next'}
            style={[styles.input]}
            onSubmit={() => {
              phnNoRef?.current.focus();
            }}
          />
          {isValidEmail && (
            <FontText
              size={normalize(12)}
              color={'red'}
              pTop={wp(1)}
              textAlign="right"
              name="regular">
              {checkValid && email.length === 0
                ? `Email is required.`
                : 'Invalid Email.'}
            </FontText>
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
            maxLength={10}
            returnKeyType={'done'}
            style={[styles.input]}
            blurOnSubmit
          />
          {/* {isValidPhoneNo && (
            <FontText
              size={normalize(12)}
              color={'red'}
              pTop={wp(1)}
              textAlign="right"
              name="regular">{`Phone number is Required.`}</FontText>
          )} */}
        </View>
      </KeyboardAwareScrollView>
      <RBSheet
        ref={imageRef}
        height={hp(25)}
        closeOnPressMask
        closeOnPressBack
        closeOnDragDown
        dragFromTopOnly>
        <View>
          <Button
            onPress={openCamera}
            bgColor={'brown'}
            style={[
              styles.buttonContainer,
              {marginVertical: 0, marginTop: hp(1), width: '80%'},
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
            bgColor={'brown'}
            style={[styles.buttonContainer, {width: '80%'}]}>
            <FontText
              name={'opensans-semibold'}
              size={fontSize}
              color={'white'}>
              {'Upload photo from gallery'}
            </FontText>
          </Button>
        </View>
      </RBSheet>
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

export default EditProfileScreen;

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
    marginVertical: hp(3),
  },
  staticImg: {
    borderWidth: 1,
    borderRadius: 6,
    borderColor: colors.gray,
    alignSelf: 'center',
    padding: hp(1.2),
  },
  marginTopView: {
    marginTop: hp(1.5),
  },
  avatar: {
    width: hp(10),
    height: hp(10),
    borderRadius: 6,
    alignSelf: 'center',
    resizeMode: 'cover',
    marginBottom: hp(2),
  },
});
