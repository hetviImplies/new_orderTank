import { Alert, Keyboard, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { hp, isIOS, normalize, wp } from '../../styles/responsiveScreen';
import { Button, FontText, Loader, Popup } from '../../components';
import commonStyle, { fontSize, largeFont, mediumFont, tabIcon } from '../../styles';
import { colors, fonts, SvgIcons } from '../../assets';
import { useForgotPasswordMutation } from '../../api/auth';
import utils from '../../helper/utils';
import { RootScreens } from '../../types/type';
import { resetNavigateTo } from '../../helper/navigationHelper';
import { emailRegx } from '../../helper/regex';
import { DefaultTheme, TextInput } from 'react-native-paper';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState('');
  const [checkValid, setCheckValid] = useState(false);
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

  const isValidEmail =
    checkValid && (email.length === 0 || !validationEmail(email));

  const onContinuePress = async () => {
    setCheckValid(true);
    if (email.length !== 0 && validationEmail(email)) {
      setCheckValid(false);
      const { data, error }: any = await forgotPassword({
        email: email,
      });
      if (!error && data?.statusCode === 200) {
        // utils.showSuccessToast(data.message);
        setIsOpen(true);
      } else {
        utils.showErrorToast(
          data?.message ? data?.message : error?.data?.message,
        );
      }
    }
  };
  const openGmail = async () => {
    try {
      const supported = await Linking.canOpenURL('https://gmail.app.goo.gl');
      console.log('supported: ', supported); 
      if (supported) {
        await Linking.openURL('https://gmail.app.goo.gl');
      } else {
        Alert.alert('Error', 'Email client is not available.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while opening the email client.');
    }
  };

  return (
    <View style={commonStyle.container}>
      <Loader loading={isLoading} />
      <SvgIcons.LogoBg
        width={wp(100)}
        height={wp(41)}
        style={{ alignSelf: 'center' }}
      />
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: "absolute", top:isIOS ? hp(4) : hp(2), left: wp(4.5) ,padding:wp(1)}}>
        <SvgIcons._BackArrow
          width={wp(7)}
          height={wp(7)}
        />
      </TouchableOpacity>
      <View style={styles.middleContainer}>
        <FontText
          name={'mont-bold'}
          size={largeFont}
          color={'black2'}
          pTop={wp(7)}
          textAlign={'left'}>
          {isOpen ? "Check Your Mail" : 'Forgot Password?'}
        </FontText>
        <FontText
          name={'mont-medium'}
          size={mediumFont}
          color={'darkGray'}
          pTop={wp(2)}
          textAlign={'left'}>
          {
            isOpen ? `We have sent a password recover instruction 
to your email.` : "Enter the email associated with your account and we'll send an email with instructions to reset your password."
          }
        </FontText>
        <KeyboardAwareScrollView>
          {!isOpen ? <View style={{ marginTop: hp(3) }}>
            <TextInput
              label="Email"
              value={email}
              blurOnSubmit={false}
              onChangeText={value => setEmail(value.trimStart())}
              mode="outlined"
              autoCapitalize="none"
              outlineColor={isValidEmail ? colors.red : colors.lightGray}
              activeOutlineColor={isValidEmail ? colors.red : colors.black2}
              outlineStyle={{ borderWidth: 1, borderRadius: 25 }}
              returnKeyType={'next'}
              keyboardType={'email-address'}
              onSubmitEditing={() => {
                Keyboard.dismiss();
              }}
              style={{ backgroundColor: colors.white }}
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
          </View> :
            <View style={{ marginTop: hp(3) }}>
              <Button
                onPress={openGmail}
                bgColor={'orange'}
                style={{ borderRadius: normalize(25), marginBottom: hp(1) }}>
                <FontText name={'mont-bold'} size={fontSize} color={'white'}>
                  {'Open Email App'}
                </FontText>
              </Button>
              <Button
                onPress={() => resetNavigateTo(navigation, RootScreens.Login)}
                bgColor={'white'}
                style={styles.buttonContainer}>
                <FontText name={'mont-bold'} size={fontSize} color={'orange'}>
                  {'Skip i’ll Confirm later'}
                </FontText>
              </Button>
            </View>}
        </KeyboardAwareScrollView>
        {!isOpen ? 
        <Button
          onPress={onContinuePress}
          bgColor={'orange'}
          style={styles.buttonContainer}>
          <FontText name={'mont-bold'} size={fontSize} color={'white'}>
            {'Send Instructions'}
          </FontText>
        </Button> :
          <FontText name={'mont-semibold'} size={mediumFont} style={{ textAlign: "center",marginBottom: hp(6),}} color={'darkGray'}>
            Did not receive the email? Check your spam filter,or {
              // <TouchableOpacity>
                <FontText onPress={()=> {
                  setEmail('')
                  setIsOpen(false)}} name={'mont-semibold'} size={mediumFont} color={'orange'}>
                  {'try another email address'}
                </FontText>
            }
          </FontText>}
      </View>
      {/* <Popup
        visible={isOpen}
        // onBackPress={() => setIsOpen(false)}
        // title={'OrderTank'}
        description={`We sent you email with instructions to reset your password.`}
        rightBtnText={'Ok'}
        rightBtnPress={() => {
          setIsOpen(false);
          resetNavigateTo(navigation, RootScreens.Login);
        }}
        // onTouchPress={() => setIsOpen(false)}
        // btnConatiner={{width:'100%'}}
        rightBtnStyle={{width: '100%', height: hp(6)}}
      /> */}
    </View>
  );
};

export default ForgotPasswordScreen;

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
    marginBottom: hp(6),
  },
});
