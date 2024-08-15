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
  largeFont,
  mediumFont,
  mediumLarge2Font,
  smallFont,
} from '../../styles';
import {colors, SvgIcons, Images, fonts} from '../../assets';
import {RootScreens} from '../../types/type';
import utils from '../../helper/utils';
import {resetNavigateTo} from '../../helper/navigationHelper';
import {emailRegx, phoneRegx} from '../../helper/regex';
import {DefaultTheme, TextInput} from 'react-native-paper';

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

  const theme = {
    ...DefaultTheme,
    fontSize: mediumFont,
    roundness: 15,
    fonts: {
      medium: {
        fontFamily: fonts['mont-medium'],
        fontSize: mediumFont,
      },
    },
  };

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
          {'Sign Up'}
        </FontText>
        <FontText
          name={'mont-medium'}
          size={mediumFont}
          color={'darkGray'}
          pTop={wp(2)}
          textAlign={'left'}>
          {'You have chance to create new account if you really want to.'}
        </FontText>
        <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginTop: hp(3)}}>
            <TextInput
              label="Username"
              value={userName}
              blurOnSubmit={false}
              onChangeText={value => setUserName(value.trimStart())}
              mode="outlined"
              autoCapitalize="none"
              outlineColor={isValidUserName ? colors.red : colors.lightGray}
              activeOutlineColor={isValidUserName ? colors.red : colors.black2}
              outlineStyle={{borderWidth: 1, borderRadius: 25}}
              returnKeyType={'next'}
              onSubmitEditing={() => {
                phonNoRef?.current.focus();
              }}
              style={{backgroundColor: colors.white}}
              textColor={colors.black4}
              contentStyle={styles.inputText}
              cursorColor={colors.darkGray}
              theme={theme}
            />
            {isValidUserName && (
              <FontText
                size={smallFont}
                color={'red'}
                pTop={wp(1)}
                textAlign="right"
                name="regular">{`User Name is Required.`}</FontText>
            )}
          </View>
          <View style={{marginTop: hp(1.5)}}>
            <TextInput
              label="Mobile Number"
              ref={phonNoRef}
              value={phoneNo}
              blurOnSubmit={false}
              onChangeText={value => setPhoneNo(value.trim())}
              mode="outlined"
              autoCapitalize="none"
              outlineColor={isValidPhoneNo ? colors.red : colors.lightGray}
              activeOutlineColor={isValidPhoneNo ? colors.red : colors.black2}
              outlineStyle={{borderWidth: 1, borderRadius: 25}}
              returnKeyType={'next'}
              maxLength={10}
              keyboardType="numeric"
              onSubmitEditing={() => {
                emailRef?.current.focus();
              }}
              style={{backgroundColor: colors.white}}
              textColor={colors.black4}
              contentStyle={styles.inputText}
              cursorColor={colors.darkGray}
              theme={theme}
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
          <View style={{marginTop: hp(1.5)}}>
            <TextInput
              label="Email"
              ref={emailRef}
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
        </KeyboardAwareScrollView>
        <Button
          onPress={onSignUpPress}
          bgColor={'orange'}
          style={styles.buttonContainer}>
          <FontText name={'mont-bold'} size={fontSize} color={'white'}>
            {'Sign Up'}
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
            {'Already have an account?'}
          </FontText>
          <TouchableOpacity onPress={signInPress}>
            <FontText
              name={'mont-semibold'}
              size={mediumFont}
              color={'orange'}
              textAlign={'center'}>
              {' Sign In'}
            </FontText>
          </TouchableOpacity>
        </View>
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
  marginTopView: {
    marginTop: hp(1.5),
  },
  agreeContainer: {
    marginTop: hp(6),
    flexWrap: 'wrap',
  },
});
