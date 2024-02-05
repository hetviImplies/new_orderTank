import {ImageBackground, Keyboard, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {Button, FontText, Input, Loader, Popup} from '../../components';
import commonStyle, {
  fontSize,
  iconSize,
  mediumFont,
  mediumLarge2Font,
} from '../../styles';
import {colors, Images, SvgIcons} from '../../assets';
import {useForgotPasswordMutation} from '../../api/auth';
import utils from '../../helper/utils';
import {RootScreens} from '../../types/type';
import {resetNavigateTo} from '../../helper/navigationHelper';
import {emailRegx} from '../../helper/regex';

const ForgotPasswordScreen = ({navigation}: any) => {
  const [forgotPassword, {isLoading}] = useForgotPasswordMutation();
  const [email, setEmail] = useState('');
  const [checkValid, setCheckValid] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
      const {data, error}: any = await forgotPassword({
        email: email,
      });
      if (!error && data?.statusCode === 200) {
        // utils.showSuccessToast(data.message);
        setIsOpen(true);
      } else {
        utils.showErrorToast(data?.message ? data?.message : error?.data?.message);
      }
    }
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
          {'Forgot Password'}
        </FontText>
      </ImageBackground>
      <View style={styles.middleContainer}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <SvgIcons.BackRound
            width={tabIcon}
            height={tabIcon}
            style={commonStyle.marginT2}
          />
        </TouchableOpacity> */}
        <KeyboardAwareScrollView>
          <View style={{marginTop: hp(3)}}>
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
              onChangeText={(text: string) => setEmail(text.trim())}
              placeholder={'Enter Email'}
              autoCapitalize="none"
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              inputStyle={styles.inputText}
              style={styles.input}
              color={'black'}
              returnKeyType={'next'}
              blurOnSubmit
              onSubmit={() => Keyboard.dismiss()}
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
                  ? 'Email is required.'
                  : 'Invalid Email.'}
              </FontText>
            )}
          </View>
          <Button
            onPress={onContinuePress}
            bgColor={'orange'}
            style={styles.buttonContainer}>
            <FontText name={'lexend-semibold'} size={fontSize} color={'white'}>
              {'Submit'}
            </FontText>
          </Button>
        </KeyboardAwareScrollView>
      </View>
      <Popup
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
      />
    </View>
  );
};

export default ForgotPasswordScreen;

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
});
