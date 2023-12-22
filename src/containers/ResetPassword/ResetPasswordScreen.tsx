import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import {hp, isIOS, normalize, wp} from '../../styles/responsiveScreen';
import SvgIcons from '../../assets/SvgIcons';
import colors from '../../assets/colors';
import Images from '../../assets/images';
import {Button, FontText, Input, Loader} from '../../components';
import {
  mediumFont,
  largeFont,
  smallFont,
  fontSize,
  mediumLargeFont,
} from '../../styles';
import {RootScreens} from '../../types/type';
import {useResetPasswordMutation} from '../../api/auth';
import utils from '../../helper/utils';
import commonStyle from '../../styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const ResetPasswordScreen = ({navigation, route}: any) => {
  const [reset, {isLoading}] = useResetPasswordMutation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checkValid, setCheckValid] = useState(false);
  const [eyeIcon, setEyeIcon] = useState(false);

  const hashKey = route.params.hash;
  const newPassRef: any = useRef();
  const confirmPassRef: any = useRef();

  const isValidNewPassword =
    checkValid && (newPassword.length === 0 || newPassword.length < 6);
  const isValidConfirmPassword =
    checkValid && (confirmPassword.length === 0 || confirmPassword.length < 6);

  const onSkipPress = () => {
    navigation.navigate(RootScreens.DashBoard);
  };

  const onResetPress = async () => {
    setCheckValid(true);
    if (newPassword.length !== 0 && confirmPassword.length !== 0) {
      setCheckValid(false);
      const {data, error}: any = await reset({
        hash: hashKey,
        body: {password: newPassword, confirmPassword: confirmPassword},
      });
      if (!error && data?.statusCode === 200) {
        navigation.navigate(RootScreens.Login);
        utils.showSuccessToast(data.message);
      } else {
        utils.showErrorToast(data.message || error);
      }
    }
  };

  const handleEyePress = () => {
    setEyeIcon(!eyeIcon);
  };

  return (
    <View style={styles.container}>
      <Loader loading={isLoading} />
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
          {'Reset Password'}
        </FontText>
        <KeyboardAwareScrollView>
          <View style={{marginTop: hp(1)}}>
            <FontText
              name={'opensans-medium'}
              size={mediumFont}
              color={'black2'}
              pTop={wp(5)}
              textAlign={'left'}>
              {'Your password must be at least 6 digits long'}
            </FontText>
            <View
              style={[
                commonStyle.rowAC,
                {
                  marginBottom: hp(1),
                  marginTop: hp(7),
                },
              ]}>
              <SvgIcons.Lock width={wp(4)} height={wp(4)} />
              <FontText
                name={'opensans-semibold'}
                size={smallFont}
                color={'black2'}
                pLeft={wp(1)}
                textAlign={'left'}>
                {'New Password'}
              </FontText>
            </View>
            <Input
              ref={newPassRef}
              value={newPassword}
              onChangeText={(text: string) => setNewPassword(text)}
              placeholder={'Enter New Password'}
              autoCapitalize="none"
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              inputStyle={styles.inputText}
              color={'black'}
              returnKeyType={'next'}
              secureTextEntry={!eyeIcon}
              onSubmit={() => {
                confirmPassRef?.current.focus();
              }}>
              <TouchableOpacity
                onPress={handleEyePress}
                style={{
                  position: 'absolute',
                  right: wp(3.5),
                  top: hp(1.5),
                }}>
                {eyeIcon ? <SvgIcons.Eye /> : <SvgIcons.EyeOff />}
              </TouchableOpacity>
            </Input>
            {isValidNewPassword && (
              <FontText
                size={normalize(12)}
                color={'red'}
                pTop={wp(1)}
                textAlign="right"
                name="regular">
                {checkValid && newPassword.length === 0
                  ? `Password is required.`
                  : 'Password must be at least 6 characters long.'}
              </FontText>
            )}
            <View style={styles.marginTopView}>
              <View style={commonStyle.rowACMB1}>
                <SvgIcons.Lock width={wp(4)} height={wp(4)} />
                <FontText
                  name={'opensans-semibold'}
                  size={smallFont}
                  color={'black2'}
                  pLeft={wp(1)}
                  textAlign={'left'}>
                  {'Confirm Password'}
                </FontText>
              </View>
              <Input
                ref={confirmPassRef}
                value={confirmPassword}
                onChangeText={(text: string) => setConfirmPassword(text)}
                placeholder={'Enter Confirm Password'}
                autoCapitalize="none"
                placeholderTextColor={'placeholder'}
                fontSize={fontSize}
                inputStyle={styles.inputText}
                color={'black'}
                returnKeyType={'done'}
                secureTextEntry
                blurOnSubmit
              />
              {isValidConfirmPassword && (
                <FontText
                  size={normalize(12)}
                  color={'red'}
                  pTop={wp(1)}
                  textAlign="right"
                  name="regular">
                  {checkValid && confirmPassword.length === 0
                    ? `Password is required.`
                    : 'Password must be at least 6 characters long.'}
                </FontText>
              )}
            </View>
            <Button
              onPress={onResetPress}
              bgColor={'brown'}
              style={styles.buttonContainer}>
              <FontText
                name={'opensans-semibold'}
                size={mediumLargeFont}
                color={'white'}>
                {'Reset'}
              </FontText>
            </Button>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default ResetPasswordScreen;

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
    marginHorizontal: wp(6),
    marginTop: hp(-8),
  },
  inputText: {
    borderRadius: 10,
    paddingLeft: wp(3.5),
    color: 'black',
    fontSize: normalize(12),
    fontFamily: 'opensans-medium',
  },
  buttonContainer: {
    borderRadius: 12,
    marginTop: hp(5),
    width: '70%',
    alignSelf: 'center',
  },
  marginTopView: {
    marginTop: hp(1.5),
  },
});
