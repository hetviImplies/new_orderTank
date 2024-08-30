import {
  ImageBackground,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRegisterMutation } from '../../api/auth';
import { hp, normalize, wp } from '../../styles/responsiveScreen';
import { Button, FontText, Input, Loader, OutLine_Input, Popup } from '../../components';
import commonStyle, {
  fontSize,
  iconSize,
  largeFont,
  mediumFont,
  mediumLarge2Font,
  smallFont,
} from '../../styles';
import { colors, SvgIcons, Images, fonts } from '../../assets';
import { RootScreens } from '../../types/type';
import utils from '../../helper/utils';
import { resetNavigateTo } from '../../helper/navigationHelper';
import { emailRegx, phoneRegx } from '../../helper/regex';
import { DefaultTheme, TextInput } from 'react-native-paper';

const SignUpScreen = ({ navigation }: any) => {
  const [register, { isLoading }] = useRegisterMutation();
  let emailRef: any = useRef();
  let phonNoRef: any = useRef();
  let passwordRef: any = useRef();
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
      const { data, error }: any = await register(params);
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
    Keyboard.dismiss();
  };

  return (
    <View style={commonStyle.container}>
      <Loader loading={isLoading} />
      <SvgIcons.LogoBg
        width={wp(100)}
        height={wp(41)}
        style={{ alignSelf: 'center' }}
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
          <View style={{ marginTop: hp(3) }}>
            <OutLine_Input
              setValue={(text: string) => setUserName(text.trim())}
              fontSize={smallFont}
              color={'darkGray'}
              // func={i => ( = i)}
              onSubmitEditing={() => phonNoRef?.focus()}
              returnKeyType={'next'}
              returnKeyLabel="next"
              // keyboardType={"number-pad"}
              value={userName}
              label={'Username'}
              fontName={'mont-medium'}
              multiline={undefined}
              height={undefined}
              multilineHeight={undefined}
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
          <View style={{ marginTop: hp(1.5) }}>
            <OutLine_Input
              setValue={(text: string) => {
                if (text.length <= 10) {
                  return setPhoneNo(text.trim())
                }
              }}
              fontSize={smallFont}
              color={'darkGray'}
              func={i => (phonNoRef = i)}
              onSubmitEditing={() => emailRef?.focus()}
              returnKeyType={'next'}
              returnKeyLabel="next"
              // keyboardType={"number-pad"}
              value={phoneNo}
              label={'Mobile Number'}
              fontName={'mont-medium'}
              multiline={undefined}
              height={undefined}
              keyboardType={"phone-pad"}
              multilineHeight={undefined}
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
          <View style={{ marginTop: hp(1.5) }}>
            <OutLine_Input
              setValue={(text: string) => setEmail(text.trim())}
              fontSize={smallFont}
              color={'darkGray'}
              func={i => (emailRef = i)}
              onSubmitEditing={() => passwordRef?.focus()}
              returnKeyType={'next'}
              returnKeyLabel="next"
              // keyboardType={"number-pad"}
              value={email}
              label={'Email'}
              fontName={'mont-medium'}
              multiline={undefined}
              height={undefined}
              multilineHeight={undefined}
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
          <View style={{ marginTop: hp(1.5) }}>
            <OutLine_Input
              setValue={(text: string) => setPassword(text.trim())}
              fontSize={smallFont}
              color={'darkGray'}
              func={i => (passwordRef = i)}
              returnKeyType={'done'}
              secureTextEntry={!eyeIcon}
              returnKeyLabel="done"
              onSubmitEditing={() => Keyboard.dismiss()}
              // keyboardType={"number-pad"}
              value={password}
              right={
                <TextInput.Icon
                  color={colors.darkGray}
                  onPress={handleEyePress}
                  icon={() => {
                    if (eyeIcon) {
                      return <SvgIcons._Eyes_Open height={iconSize} width={iconSize} />
                    } else {
                      return <SvgIcons._Eyes_Close height={iconSize} width={iconSize} />
                    }
                  }}
                  size={wp(5)}
                />
              }
              label={'Password'}
              fontName={'mont-medium'}
              multiline={undefined}
              height={undefined}
              multilineHeight={undefined}
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
            { marginBottom: hp(2) },
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
          rightBtnStyle={{ width: '100%', height: hp(6) }}
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
