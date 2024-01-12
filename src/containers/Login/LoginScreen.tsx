import {
  ImageBackground,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useLoginMutation, useResendEmailMutation} from '../../api/auth';
import {useDispatch} from 'react-redux';
import Images from '../../assets/images';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {Button, FontText, Input, Loader} from '../../components';
import {
  fontSize,
  iconSize,
  mediumFont,
  mediumLarge2Font,
  smallFont,
} from '../../styles';
import SvgIcons from '../../assets/SvgIcons';
import {
  setCurrentUser,
  setIsAuthenticated,
  setToken,
} from '../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootScreens} from '../../types/type';
import {resetNavigateTo} from '../../helper/navigationHelper';
import utils from '../../helper/utils';
import commonStyle from '../../styles';
// import {setCurrentUser, setToken} from '../../redux/slices/authSlice';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {requestPermission} from '../../helper/PushNotification';
import colors from '../../assets/colors';
import Popup from '../../components/Popup';
import {requestPermission} from '../../helper/PushNotification';

const LoginScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [login, {isLoading}] = useLoginMutation();
  const [resend, {isLoading: isFetching}] = useResendEmailMutation();
  const passwordRef: any = useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [eyeIcon, setEyeIcon] = useState(false);
  const [checkValid, setCheckValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const emailRegx =
    /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

  const validationEmail = (val: any) => {
    const result = emailRegx.test(val.trim());
    return result;
  };

  const isValidEmail =
    checkValid && (email.length === 0 || !validationEmail(email));
  const isValidPassword =
    checkValid && (password.length === 0 || password.length < 8);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    const notificationToken = await AsyncStorage.getItem('NotiToken');
    if (!notificationToken) {
      requestPermission();
    }
    const token: any = await AsyncStorage.getItem('token');
    if (token && token.trim() !== '') {
      dispatch(setIsAuthenticated(true));
    }
  };

  const clearData = async () => {
    setEmail('');
    setPassword('');
  };

  const onLoginPress = async () => {
    setCheckValid(true);
    if (email.length !== 0 && validationEmail(email) && password.length !== 0) {
      setCheckValid(false);
      const notificationToken: any = await AsyncStorage.getItem('NotiToken');
      console.log('Notification token', notificationToken);
      const {data, error}: any = await login({
        email,
        password,
        isMobile: true,
        notificationToken,
      });
      console.log('Data', data, error);
      if (!error && data?.statusCode === 200) {
        clearData();
        dispatch(setCurrentUser(data?.result));
        dispatch(setToken(data?.token));
        await AsyncStorage.setItem('token', data?.token);
        // utils.showSuccessToast(data.message);
        if (
          data?.result?.companyCode === undefined ||
          data?.result?.companyCode === ''
        ) {
          resetNavigateTo(navigation, RootScreens.CompanyDetail, {
            from: 'Login',
            name: 'Enter your company detail',
          });
        } else {
          resetNavigateTo(navigation, RootScreens.DashBoard);
        }
      } else {
        dispatch(setIsAuthenticated(false));
        data?.message !== 'Please verified email first' &&
          utils.showErrorToast(data.message || error.message);
        data?.message === 'Please verified email first' && setIsOpen(true);
      }
    }
  };

  const handleEyePress = () => {
    setEyeIcon(!eyeIcon);
  };

  const onForgotPress = () => {
    navigation.navigate(RootScreens.ForgotPass);
  };

  const signUpPress = () => {
    navigation.navigate(RootScreens.SignUp);
  };

  const sendEmailPress = async () => {
    const {data, error}: any = await resend({email: email});
    if (!error && data?.statusCode === 200) {
      setIsOpen(false);
    } else {
      utils.showErrorToast(data?.message ? data?.message : error?.message);
    }
  };

  return (
    <>
      <View style={commonStyle.container}>
        <Loader loading={isLoading || isFetching} />
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
            {'Sign in'}
          </FontText>
        </ImageBackground>
        <View style={styles.middleContainer}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginTop: hp(6)}}>
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
                  {'Email:'}
                </FontText>
              </View>
              <Input
                value={email}
                onChangeText={(text: string) => setEmail(text)}
                placeholder={'Enter Email'}
                autoCapitalize="none"
                placeholderTextColor={'placeholder'}
                fontSize={fontSize}
                inputStyle={styles.inputText}
                style={styles.input}
                color={'black'}
                returnKeyType={'next'}
                blurOnSubmit
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
                      : 'Password must be at least 8 characters long.'}
                  </FontText>
                )}
              </View>
              <TouchableOpacity onPress={onForgotPress}>
                <FontText
                  name={'lexend-regular'}
                  size={smallFont}
                  color={'orange'}
                  pTop={wp(2)}
                  style={{textDecorationLine: 'underline'}}
                  textAlign={'right'}>
                  {'Forgot Password ?'}
                </FontText>
              </TouchableOpacity>
            </View>
            <Button
              onPress={onLoginPress}
              bgColor={'orange'}
              style={styles.buttonContainer}>
              <FontText
                name={'lexend-semibold'}
                size={fontSize}
                color={'white'}>
                {'Sign in'}
              </FontText>
            </Button>
            <View style={[commonStyle.rowC, commonStyle.marginT2]}>
              <FontText
                name={'lexend-medium'}
                size={mediumFont}
                color={'black'}
                textAlign={'center'}>
                {'Don’t have an account?'}
              </FontText>
              <TouchableOpacity onPress={signUpPress}>
                <FontText
                  name={'lexend-medium'}
                  size={mediumFont}
                  color={'orange'}
                  style={{textDecorationLine: 'underline'}}
                  textAlign={'center'}>
                  {' Sign up'}
                </FontText>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
      <Popup
        visible={isOpen}
        onBackPress={() => setIsOpen(false)}
        title={'Verify your email'}
        description={`Please check your email for the verification link. If you have not received the email, we can resend it.`}
        rightBtnText={'Resend'}
        rightBtnPress={sendEmailPress}
        // onTouchPress={() => setIsOpen(false)}
        // btnConatiner={{width:'100%'}}
        rightBtnStyle={{width: '100%', height: hp(6)}}
      />
      {/* )} */}
    </>
  );
};

export default LoginScreen;

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
    paddingLeft: wp(12),
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
    marginTop: hp(15),
  },
  marginTopView: {
    marginTop: hp(1.5),
  },
});
