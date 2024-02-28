import {
  ImageBackground,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useRegisterMutation} from '../../api/auth';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {Button, FontText, Input, Loader, Popup} from '../../components';
import commonStyle, {
  fontSize,
  iconSize,
  mediumFont,
  mediumLarge2Font,
} from '../../styles';
import {colors, SvgIcons, Images} from '../../assets';
import {RootScreens} from '../../types/type';
import utils from '../../helper/utils';
import {resetNavigateTo} from '../../helper/navigationHelper';
import {emailRegx, phoneRegx} from '../../helper/regex';

const SignUpScreen = ({navigation}: any) => {
  const [register, {isLoading}] = useRegisterMutation();
  const emailRef: any = useRef();
  const phonNoRef: any = useRef();
  const passwordRef: any = useRef();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [password, setPassword] = useState('');
  const [eyeIcon, setEyeIcon] = useState(false);
  const [checkValid, setCheckValid] = useState(false);
  // const [isCheck, setIsCheck] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const validationEmail = (val: any) => {
    const result = emailRegx.test(val.trim());
    return result;
  };

  const validationNumber = (val: any) => {
    const result = phoneRegx.test(val.trim());
    return result;
  };

  const isValidUserName = checkValid && userName.length === 0;
  const isValidEmail =
    checkValid && (email.length === 0 || !validationEmail(email));
  const isValidPhoneNo =
    checkValid &&
    (phoneNo.length === 0 || phoneNo.length < 10 || !validationNumber(phoneNo));
  const isValidPassword =
    checkValid && (password.length === 0 || password.length < 6);

  const signInPress = () => {
    resetNavigateTo(navigation, RootScreens.Login);
  };

  const onSignUpPress = async () => {
    setCheckValid(true);
    if (
      userName.length !== 0 &&
      email.length !== 0 &&
      validationEmail(email) &&
      phoneNo.length !== 0 &&
      validationNumber(phoneNo) &&
      password.length !== 0 &&
      password.length >= 6
      // && isCheck === true
    ) {
      const params: any = {
        name: userName,
        email: email,
        phone: phoneNo,
        password: password,
      };
      const {data, error}: any = await register(params);
      if (!error && data?.statusCode === 200) {
        setCheckValid(false);
        setIsOpen(true);
        // utils.showSuccessToast(data.message);
      } else {
        utils.showErrorToast(error?.data?.message);
        // Alert.alert('Error', data?.message || error);
      }
    }
  };

  const handleEyePress = () => {
    setEyeIcon(!eyeIcon);
  };

  return (
    <View style={commonStyle.container}>
      <Loader loading={isLoading} />
      <ImageBackground
        source={Images.bgImg}
        style={styles.headerImg}
        resizeMode="cover">
        <SvgIcons.Logo
          style={{
            alignSelf: 'center',
            marginVertical: hp(11.5),
          }}
        />
        <FontText
          name={'lexend-bold'}
          size={mediumLarge2Font}
          color={'orange'}
          textAlign={'center'}>
          {'Sign up'}
        </FontText>
      </ImageBackground>
      <View style={styles.middleContainer}>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginTop: wp(6)}}>
            <View style={commonStyle.rowACMB1}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'gray3'}
                pLeft={wp(1)}
                textAlign={'left'}>
                {'User name:'}
              </FontText>
            </View>
            <Input
              value={userName}
              onChangeText={(text: string) => setUserName(text.trimStart())}
              autoCapitalize="none"
              placeholder={'Enter User Name'}
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              inputStyle={styles.inputText}
              style={styles.input}
              color={'black'}
              returnKeyType={'next'}
              onSubmit={() => {
                phonNoRef?.current.focus();
              }}
              children={
                <View style={[commonStyle.abs, {left: wp(4)}]}>
                  <SvgIcons.User width={iconSize} height={iconSize} />
                </View>
              }
            />
            {isValidUserName && (
              <FontText
                size={normalize(12)}
                color={'red'}
                pTop={wp(1)}
                textAlign="right"
                name="regular">{`User Name is Required.`}</FontText>
            )}
            <View style={styles.marginTopView}>
              <View style={commonStyle.rowACMB1}>
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
                ref={phonNoRef}
                value={phoneNo}
                onChangeText={(text: string) => setPhoneNo(text.trim())}
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
                  emailRef?.current.focus();
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
              {isValidPhoneNo && (
                <FontText
                  size={normalize(12)}
                  color={'red'}
                  pTop={wp(1)}
                  textAlign="right"
                  name="regular">
                  {checkValid && phoneNo.length === 0
                    ? `Mobile Number is required.`
                    : 'Invalid Mobile Number.'}
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
                  {'Email:'}
                </FontText>
              </View>
              <Input
                ref={emailRef}
                value={email}
                onChangeText={(text: string) => setEmail(text.trim())}
                placeholder={'Enter Email'}
                autoCapitalize="none"
                placeholderTextColor={'placeholder'}
                fontSize={fontSize}
                inputStyle={styles.inputText}
                style={styles.input}
                color={'black'}
                returnKeyType={'next'}
                onSubmit={() => {
                  passwordRef?.current.focus();
                }}
                children={
                  <View style={[commonStyle.abs, {left: wp(4)}]}>
                    <SvgIcons.Email width={iconSize} height={iconSize} />
                  </View>
                }
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
              <View style={commonStyle.rowACMB1}>
                <FontText
                  name={'lexend-regular'}
                  size={mediumFont}
                  color={'gray3'}
                  pLeft={wp(1)}
                  textAlign={'left'}>
                  {'Password:'}
                </FontText>
              </View>
              <View style={commonStyle.rowAC}>
                <Input
                  ref={passwordRef}
                  value={password}
                  onChangeText={(text: string) => setPassword(text.trim())}
                  placeholder={'Enter Password'}
                  placeholderTextColor={'placeholder'}
                  fontSize={fontSize}
                  color={'black'}
                  inputStyle={[styles.inputText, {paddingRight: wp(12)}]}
                  style={[styles.input]}
                  secureTextEntry={!eyeIcon}
                  returnKeyType={'done'}
                  blurOnSubmit
                  children={
                    <View
                      style={[
                        commonStyle.abs,
                        commonStyle.rowJB,
                        {left: wp(4)},
                      ]}>
                      <SvgIcons.Lock width={iconSize} height={iconSize} />
                    </View>
                  }
                  onSubmit={() => Keyboard.dismiss()}
                />
                <TouchableOpacity
                  onPress={handleEyePress}
                  style={[
                    commonStyle.abs,
                    {
                      right: wp(3),
                      padding: wp(2),
                    },
                  ]}>
                  {eyeIcon ? (
                    <SvgIcons.EyeOpen width={iconSize} height={iconSize} />
                  ) : (
                    <SvgIcons.EyeClose width={iconSize} height={iconSize} />
                  )}
                </TouchableOpacity>
              </View>
              {isValidPassword && (
                <FontText
                  size={normalize(12)}
                  color={'red'}
                  pTop={wp(1)}
                  textAlign="right"
                  name="regular">
                  {checkValid && password.length === 0
                    ? `Password is required.`
                    : 'Password must be at least 6 characters long.'}
                </FontText>
              )}
            </View>
          </View>
          {/* <View style={[commonStyle.rowJC, styles.agreeContainer]}>
            <TouchableOpacity
              onPress={() => setIsCheck(!isCheck)}
              style={{marginRight: wp(2)}}>
              {isCheck ? (
                <SvgIcons.FillBox width={iconSize} height={iconSize} />
              ) : (
                <SvgIcons.EmptyBox width={iconSize} height={iconSize} />
              )}
            </TouchableOpacity>
            <FontText
              name={'lexend-medium'}
              size={mediumFont}
              color={'black'}
              textAlign={'center'}>
              {'Agree our'}{' '}
            </FontText>
            <FontText
              name={'lexend-medium'}
              size={mediumFont}
              color={'orange'}
              style={{textDecorationLine: 'underline'}}
              textAlign={'center'}>
              {'privacy policy'}{' '}
            </FontText>
            <FontText
              name={'lexend-medium'}
              size={mediumFont}
              color={'black'}
              textAlign={'center'}>
              {'an'}{' '}
            </FontText>
            <FontText
              name={'lexend-medium'}
              size={mediumFont}
              color={'orange'}
              style={{textDecorationLine: 'underline'}}
              textAlign={'center'}>
              {'terms condition'}
            </FontText>
          </View> */}
          <Button
            onPress={onSignUpPress}
            // bgColor={isCheck ? 'orange' : 'gray'}
            bgColor={'orange'}
            // disabled={!isCheck}
            style={styles.buttonContainer}>
            <FontText name={'lexend-semibold'} size={fontSize} color={'white'}>
              {'Sign up'}
            </FontText>
          </Button>
          <View
            style={[
              commonStyle.rowC,
              commonStyle.marginT2,
              {marginBottom: hp(2)},
            ]}>
            <FontText
              name={'lexend-medium'}
              size={mediumFont}
              color={'black'}
              textAlign={'center'}>
              {'Already have an account?'}
            </FontText>
            <TouchableOpacity onPress={signInPress}>
              <FontText
                name={'lexend-medium'}
                size={mediumFont}
                color={'orange'}
                style={{textDecorationLine: 'underline'}}
                textAlign={'center'}>
                {' Sign in'}
              </FontText>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
        <Popup
          visible={isOpen}
          // onBackPress={() => setIsOpen(false)}
          title={'Verify your email'}
          description={`Please verify your email address by clicking the link sent to ${email}.`}
          rightBtnText={'OK'}
          rightBtnPress={() => {
            resetNavigateTo(navigation, RootScreens.Login);
            setIsOpen(false);
          }}
          // btnConatiner={{width:'100%'}}
          rightBtnStyle={{width: '100%', height: hp(6)}}
        />
      </View>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  headerImg: {
    width: '100%',
    height: hp(36),
  },
  middleContainer: {
    flex: 1,
    marginHorizontal: wp(6),
  },
  inputText: {
    borderRadius: 10,
    paddingLeft: wp(13),
    color: colors.black2,
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
    marginTop: hp(2),
  },
  marginTopView: {
    marginTop: hp(1.5),
  },
  agreeContainer: {
    marginTop: hp(6),
    flexWrap: 'wrap',
  },
});
