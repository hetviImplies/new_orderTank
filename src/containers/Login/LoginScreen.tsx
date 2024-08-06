import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useLoginMutation, useResendEmailMutation} from '../../api/auth';
import {colors} from '../../assets';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {Button, FontText, Loader, Popup} from '../../components';
import commonStyle, {fontSize, largeFont, mediumFont} from '../../styles';
import SvgIcons from '../../assets/SvgIcons';
import {setCurrentUser} from '../../redux/slices/authSlice';
import {RootScreens} from '../../types/type';
import {resetNavigateTo} from '../../helper/navigationHelper';
import utils from '../../helper/utils';
import {requestPermission} from '../../helper/PushNotification';
import {emailRegx} from '../../helper/regex';
import {DefaultTheme, TextInput} from 'react-native-paper';

const LoginScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const [login, {isLoading}] = useLoginMutation();
  const [resend, {isLoading: isFetching}] = useResendEmailMutation();

  const passwordRef: any = useRef();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [eyeIcon, setEyeIcon] = useState(false);
  const [checkValid, setCheckValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const theme = {
    ...DefaultTheme,
    fontSize: mediumFont,
    roundness: 15,
    fonts: {
      medium: {
        fontFamily: 'mont-medium',
        fontSize: mediumFont,
      },
    },
  };

  const validationEmail = (val: any) => {
    const result = emailRegx.test(val.trim());
    return result;
  };

  const isValidEmail =
    checkValid && (email.length === 0 || !validationEmail(email));
  const isValidPassword =
    checkValid && (password.length === 0 || password.length < 6);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    // const notificationToken = await AsyncStorage.getItem('NotiToken');
    // console.log('NOTIFICATION TOKEN', notificationToken);
    // if (!notificationToken) {
    await requestPermission();
    // }
  };

  const clearData = async () => {
    setEmail('');
    setPassword('');
  };

  const onLoginPress = async () => {
    setCheckValid(true);
    if (
      email.length !== 0 &&
      validationEmail(email) &&
      password.length !== 0 &&
      password.length >= 6
    ) {
      setCheckValid(false);
      const notificationToken: any = await AsyncStorage.getItem('NotiToken');
      console.log('Notification token', notificationToken);
      const body = {
        email,
        password,
        // isMobile: true,
        notificationToken: JSON.stringify(notificationToken),
      };
      const {data, error}: any = await login(body);
      if (!error && data?.statusCode === 200) {
        clearData();
        await dispatch(setCurrentUser(data?.result));
        // await dispatch(setToken(data?.result?.token));
        await AsyncStorage.setItem('userData', JSON.stringify(body));
        // utils.showSuccessToast(data.message);
        if (!data?.result?.company || data?.result?.company === null) {
          resetNavigateTo(navigation, RootScreens.CompanyDetail, {
            from: 'Login',
            name: 'Enter your company detail',
            data: data?.result,
          });
        } else {
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
                      params: {data: data?.result},
                    },
                  ],
                },
              },
            ],
          });
        }
      } else {
        error?.data?.message === 'Please verify email...'
          ? setIsOpen(true)
          : utils.showErrorToast(error?.data?.message);
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
      utils.showSuccessToast(data.message);
      setIsOpen(false);
    } else {
      utils.showErrorToast(
        data?.message ? data?.message : error?.data?.message,
      );
    }
  };

  return (
    <>
      <View style={commonStyle.container}>
        <Loader loading={isLoading || isFetching} />
        <SvgIcons.LogoBg
          width={wp(100)}
          height={wp(41)}
          style={{alignSelf: 'center'}}
        />
        <View style={styles.middleContainer}>
          <FontText
            name={'mont-bold'}
            size={largeFont}
            color={'black2'}
            pTop={wp(7)}
            textAlign={'left'}>
            {'Sign In'}
          </FontText>
          <FontText
            name={'mont-medium'}
            size={mediumFont}
            color={'darkGray'}
            pTop={wp(2)}
            textAlign={'left'}>
            {'Welcome back to OrderTank! 👋'}
          </FontText>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={{marginTop: hp(3)}}>
              <TextInput
                label="Email"
                value={email}
                blurOnSubmit={false}
                onChangeText={value => setEmail(value.trimStart())}
                mode="outlined"
                autoCapitalize="none"
                outlineColor={isValidEmail ? colors.red : colors.lightGray}
                activeOutlineColor={isValidEmail ? colors.red : colors.black2}
                outlineStyle={{borderWidth: 1, borderRadius: 25}}
                returnKeyType={'next'}
                keyboardType={'email-address'}
                onSubmitEditing={() => {
                  passwordRef?.current.focus();
                }}
                style={{backgroundColor: colors.white}}
                textColor={colors.black4}
                contentStyle={styles.inputText}
                cursorColor={colors.darkGray}
                theme={theme}
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
            <View style={{marginTop: hp(1.5)}}>
              <TextInput
                ref={passwordRef}
                label="Password"
                value={password}
                onChangeText={(text: string) => setPassword(text.trim())}
                mode="outlined"
                outlineColor={
                  isValidPassword && password.length < 6
                    ? colors.red
                    : colors.lightGray
                }
                activeOutlineColor={
                  isValidPassword && password.length < 6
                    ? colors.red
                    : colors.black2
                }
                outlineStyle={{borderWidth: 1, borderRadius: 25}}
                secureTextEntry={!eyeIcon}
                right={
                  <TextInput.Icon
                    color={colors.darkGray}
                    onPress={handleEyePress}
                    icon={eyeIcon ? 'eye-outline' : 'eye-off-outline'}
                    size={wp(5)}
                  />
                }
                returnKeyType={'done'}
                onSubmitEditing={() => Keyboard.dismiss()}
                style={{backgroundColor: colors.white}}
                textColor={colors.black4}
                contentStyle={styles.inputText}
                cursorColor={colors.darkGray}
                theme={theme}
              />
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
            <TouchableOpacity
              onPress={onForgotPress}
              style={{alignSelf: 'flex-end', marginTop: wp(2.5)}}>
              <FontText
                name={'mont-semibold'}
                size={mediumFont}
                color={'orange'}
                textAlign={'right'}>
                {'Forgot Password?'}
              </FontText>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
          <Button
            onPress={onLoginPress}
            disabled={isLoading}
            bgColor={'orange'}
            style={styles.buttonContainer}>
            <FontText name={'mont-bold'} size={fontSize} color={'white'}>
              {'Sign In'}
            </FontText>
          </Button>
          <View
            style={[
              commonStyle.rowC,
              commonStyle.marginT2,
              {marginBottom: hp(2)},
            ]}>
            <FontText
              name={'mont-medium'}
              size={mediumFont}
              color={'darkGray'}
              textAlign={'center'}>
              {'Don’t have an account?'}
            </FontText>
            <TouchableOpacity onPress={signUpPress}>
              <FontText
                name={'mont-semibold'}
                size={mediumFont}
                color={'orange'}
                textAlign={'center'}>
                {' Sign Up'}
              </FontText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Popup
        visible={isOpen}
        onBackPress={() => setIsOpen(false)}
        title={'Verify your email'}
        description={`Please check your email for the verification link. If you have not received the email, we can resend it.`}
        rightBtnText={'Resend'}
        rightBtnPress={sendEmailPress}
        rightBtnStyle={{width: '100%', height: hp(6)}}
      />
    </>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  middleContainer: {
    flex: 1,
    marginHorizontal: wp(4),
  },
  inputText: {
    color: colors.darkGray,
    fontSize: mediumFont,
    fontFamily: 'Montserrat-Medium',
    backgroundColor: 'transparent',
    paddingLeft: wp(5),
  },
  buttonContainer: {
    borderRadius: normalize(25),
  },
});
