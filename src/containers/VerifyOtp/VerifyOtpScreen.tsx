import {
  Alert,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Images from '../../assets/images';
import {hp, isIOS, normalize, wp} from '../../styles/responsiveScreen';
import {Button, FontText, Input, Loader} from '../../components';
import {
  fontSize,
  largeFont,
  mediumFont,
  mediumLargeFont,
  smallFont,
} from '../../styles';
import colors from '../../assets/colors';
import SvgIcons from '../../assets/SvgIcons';
// import OTPInputView from '@twotalltotems/react-native-otp-input';
import {RootScreens} from '../../types/type';
import {
  useForgotPasswordMutation,
  useResendEmailMutation,
  useVerifyPasswordOtpMutation,
  useVerifyUserOtpMutation,
} from '../../api/auth';
import utils from '../../helper/utils';
import commonStyle from '../../styles';

const VerifyOtpScreen = ({navigation, route}: any) => {
  const [verifyPassword, {isLoading}] = useVerifyPasswordOtpMutation();
  const [verifyUser, {isLoading: isProcessing}] = useVerifyUserOtpMutation();
  const [resend, {isLoading: isFetching}] = useResendEmailMutation();
  const [forgotPassword, {isLoading: isForgotPassLoading}] =
    useForgotPasswordMutation();

  const [code, setCode] = useState('');

  const routeData: any = route.params.data;

  const onSkipPress = () => {
    navigation.navigate(RootScreens.DashBoard);
  };

  const onVerifyPress = async () => {
    if (code !== '') {
      if (routeData.from === 'forgotPassword') {
        let params = {
          email: routeData?.email,
          passwordOtp: code,
        };
        const {data, error}: any = await verifyPassword(params);
        if (!error && data?.statusCode === 200) {
          navigation.navigate(RootScreens.ResetPass, {hash: data.result.hash});
          utils.showSuccessToast(data.message);
        } else {
          utils.showErrorToast(data.message || error);
        }
      } else {
        let params = {
          email: routeData?.email,
          verifyOtp: code,
        };
        const {data, error}: any = await verifyUser(params);
        if (!error && data?.statusCode === 200) {
          navigation.navigate(RootScreens.Login);
          utils.showSuccessToast(data.message);
        } else {
          utils.showErrorToast(data.message || error);
        }
      }
    } else {
      Alert.alert('Please fill OTP');
    }
  };

  const onRequestPress = async () => {
    setCode('');
    if (routeData.from === 'forgotPassword') {
      const {data, error}: any = await forgotPassword({
        email: routeData?.email,
      });
      if (!error && data?.statusCode === 200) {
      } else {
        utils.showErrorToast(data.message || error);
      }
    } else {
      const {data, error}: any = await resend({email: routeData?.email});
      if (!error && data?.statusCode === 200) {
      } else {
        utils.showErrorToast(data.message || error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Loader
        loading={isLoading || isProcessing || isForgotPassLoading || isFetching}
      />
      <ImageBackground
        source={Images.topImg}
        style={styles.headerImg}
        resizeMode="cover">
        {/* <TouchableOpacity onPress={onSkipPress}>
          <FontText
            name={'opensans-semibold'}
            size={mediumFont}
            color={'white'}
            pTop={isIOS ? hp(5) : hp(1)}
            pRight={wp(3)}
            textAlign={'right'}>
            {'Skip>>'}
          </FontText>
        </TouchableOpacity> */}
      </ImageBackground>
      <View style={styles.middleContainer}>
        <FontText
          name={'opensans-bold'}
          size={largeFont}
          color={'black2'}
          textAlign={'left'}>
          {'Verify OTP'}
        </FontText>
        <View style={{marginTop: hp(6)}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: hp(5),
            }}>
            <FontText
              name={'opensans-medium'}
              size={mediumFont}
              color={'black2'}
              style={{width: '75%'}}
              pTop={wp(5)}
              textAlign={'center'}>
              {`Code is sent to ${
                routeData?.phone !== undefined ? routeData?.phone : ''
              } ${routeData?.phone !== undefined ? 'or' : ''} ${
                routeData?.email
              }. Please Check your inbox.`}
            </FontText>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: hp(3),
            }}>
            {/* <OTPInputView
              style={{width: '80%', height: hp(5)}}
              pinCount={4}
              code={code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
              onCodeChanged={code => setCode(code)}
              autoFocusOnLoad={false}
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={code => {
                console.log(`Code is ${code}, you are good to go!`);
              }}
            /> */}
          </View>
          <View style={[commonStyle.allCenter, commonStyle.marginT2]}>
            <FontText
              name={'opensans-medium'}
              size={fontSize}
              color={'black'}
              textAlign={'center'}>
              {'Didn’t receive code ?'}
            </FontText>
            <TouchableOpacity onPress={onRequestPress}>
              <FontText
                name={'opensans-bold'}
                size={fontSize}
                color={'brown'}
                style={{textDecorationLine: 'underline'}}
                textAlign={'center'}>
                {' Resend OTP'}
              </FontText>
            </TouchableOpacity>
          </View>
        </View>
        <Button
          onPress={onVerifyPress}
          bgColor={'brown'}
          style={styles.buttonContainer}>
          <FontText
            name={'opensans-semibold'}
            size={mediumLargeFont}
            color={'white'}>
            {'Verify'}
          </FontText>
        </Button>
      </View>
      {/* <ImageBackground
        source={Images.topImg}
        style={styles.headerImg}
        resizeMode="stretch">
        <TouchableOpacity onPress={onSkipPress}>
          <FontText
            name={'opensans-semibold'}
            size={mediumFont}
            color={'white'}
            pTop={isIOS ? hp(5) : hp(1)}
            pRight={wp(3)}
            textAlign={'right'}>
            {'Skip>>'}
          </FontText>
        </TouchableOpacity>
        <View style={styles.middleContainer}>
          <FontText
            name={'opensans-bold'}
            size={largeFont}
            color={'black2'}
            textAlign={'left'}>
            {'Verify OTP'}
          </FontText>
          <View style={{marginTop: hp(6)}}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: hp(5),
              }}>
              <FontText
                name={'opensans-medium'}
                size={mediumFont}
                color={'black2'}
                style={{width: '75%'}}
                pTop={wp(5)}
                textAlign={'center'}>
                {
                  'Code is sent to +91 878*****92 or name@domain.com. Please Check your inbox'
                }
              </FontText>
            </View>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: hp(3),
              }}>
              <OTPInputView
                style={{width: '80%', height: hp(5)}}
                pinCount={4}
                code={code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                onCodeChanged={code => setCode(code)}
                autoFocusOnLoad
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={code => {
                  console.log(`Code is ${code}, you are good to go!`);
                }}
              />
            </View>
            <View style={styles.rowContainer}>
              <FontText
                name={'opensans-medium'}
                size={fontSize}
                color={'black'}
                textAlign={'center'}>
                {'Didn’t receive code ?'}
              </FontText>
              <TouchableOpacity onPress={onRequestPress}>
                <FontText
                  name={'opensans-bold'}
                  size={fontSize}
                  color={'brown'}
                  style={{textDecorationLine: 'underline'}}
                  textAlign={'center'}>
                  {' Request again'}
                </FontText>
              </TouchableOpacity>
            </View>
          </View>
          <Button
            onPress={onVerifyPress}
            bgColor={'brown'}
            style={styles.buttonContainer}>
            <FontText
              name={'opensans-semibold'}
              size={mediumLargeFont}
              color={'white'}>
              {'Verify'}
            </FontText>
          </Button>
        </View>
      </ImageBackground> */}
    </View>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerImg: {
    width: '100%',
    height: hp(35),
  },
  middleContainer: {
    flex: 1,
    // marginTop: isIOS ? hp(22) : hp(25),
    marginHorizontal: wp(6),
    marginTop: hp(-8),
  },
  buttonContainer: {
    borderRadius: 12,
    marginTop: hp(6),
    width: '70%',
    alignSelf: 'center',
  },
  underlineStyleBase: {
    backgroundColor: colors.white,
    borderWidth: 0,
    borderRadius: 10,
    height: hp(5.5),
    width: hp(5.5),
    color: colors.black,
    fontSize: normalize(14),
    fontFamily: 'opensans-medium',
  },
  underlineStyleHighLighted: {},
});
