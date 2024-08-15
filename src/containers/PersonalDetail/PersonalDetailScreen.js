import {BackHandler, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {colors, fonts, SvgIcons} from '../../assets';
import {
  NavigationBar,
  FontText,
  Input,
  Button,
  Loader,
  OutLine_Input,
} from '../../components';
import commonStyle, {
  fontSize,
  iconSize,
  mediumFont,
  mediumLargeFont,
  smallFont,
} from '../../styles';
import {wp, hp, normalize} from '../../styles/responsiveScreen';
import {
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
} from '../../api/auth';
import {useUpdateProfileMutation} from '../../api/profile';
import utils from '../../helper/utils';
import {setCurrentUser} from '../../redux/slices/authSlice';
import {emailRegx} from '../../helper/regex';
import {RootScreens} from '../../types/type';

const PersonalDetailScreen = ({navigation}) => {
  const {data, isFetching} = useGetCurrentUserQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  const [updateProfile, {isLoading: isProcess}] =
    useUpdateCurrentUserMutation();

  const dispatch = useDispatch();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [checkValid, setCheckValid] = useState(false);
  const [editInformation, setEditInformation] = React.useState(false);
  const [btnText, setBtnText] = React.useState('Edit Profile');
  let emailRef = useRef(null);
  let nameRef = useRef(null);
  let phonNoRef = useRef(null);
  React.useLayoutEffect(() => {
    // *******************************  Hetvi ********************************
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.orange,
      },
      headerLeft: () => (
        <View
          style={[
            commonStyle.rowAC,
            {marginLeft: wp(4), flexDirection: 'row'},
          ]}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 50,
              padding: 7,
              marginRight: wp(4),
              borderColor: colors.yellow3,
            }}
            // style={commonStyle.iconView}
            onPress={() => navigation.goBack()}>
            <SvgIcons.Back_Arrow width={iconSize} height={iconSize} />
          </TouchableOpacity>
          <FontText
            name={'mont-semibold'}
            size={mediumLargeFont}
            color={'white'}>
            Personal Detail
          </FontText>
        </View>
      ),
    });
  }, [navigation]);

  const validationEmail = (val) => {
    const result = emailRegx.test(val.trim());
    return result;
  };

  const isValidUserName = checkValid && userName?.length === 0;
  const isValidEmail =
    checkValid && (email?.length === 0 || !validationEmail(email));
  const isValidPhoneNo =
    checkValid && (phoneNo?.length === 0 || phoneNo?.length < 10);

  useEffect(() => {
    setUserName(data?.result?.name);
    setPhoneNo(data?.result?.phone);
    setEmail(data?.result?.email);
  }, [data]);

  useEffect(() => {
    dispatch(setCurrentUser(data?.result));
  }, [data, isFetching]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  const backAction = () => {
    onBackPress();
    return true;
  };

  const clearData = () => {
    setUserName('');
    setPhoneNo('');
  };

  const onBackPress = () => {
    navigation.goBack();
    clearData();
  };

  const onEditPress = () => {
    setBtnText('Save & update');
    setEditInformation(true);
  };

  const onSubmitPress = async () => {
    setCheckValid(true);
    if (
      userName.length !== 0 &&
      email.length !== 0 &&
      validationEmail(email) &&
      phoneNo.length !== 0
    ) {
      let params = {
        name: userName,
        phone: phoneNo,
      };
      const {data, error} = await updateProfile(params);
      if (!error) {
        setBtnText('Edit Profile');
        setEditInformation(false);
        utils.showSuccessToast(data.message);
      } else {
        utils.showSuccessToast(error.message);
      }
    }
  };
  console.log('phonNoRef',phonNoRef);
  console.log('nameRef',nameRef);

  return (
    <View style={commonStyle.container}>
      {/* <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2.5)}}
        borderBottomWidth={0}
        leftStyle={{width: '100%'}}
        left={
          <View style={[commonStyle.rowAC]}>
            <TouchableOpacity
              style={[commonStyle.iconView, {marginRight: wp(5)}]}
              onPress={onBackPress}>
              <SvgIcons.BackArrow width={tabIcon} height={tabIcon} />
            </TouchableOpacity>
            <FontText
              name={'lexend-semibold'}
              size={mediumLargeFont}
              color={'black'}
              textAlign={'left'}>
              {'Personal Detail'}
            </FontText>
          </View>
        }
      /> */}
      <Loader loading={isFetching || isProcess} />
      <KeyboardAwareScrollView>
        <View style={[commonStyle.marginT2, {marginHorizontal: wp(4)}]}>
          {/* <View style={commonStyle.rowACMB1}>
            <FontText
              name={'lexend-regular'}
              size={mediumFont}
              color={'gray3'}
              pLeft={wp(1)}
              textAlign={'left'}>
              {'Name:'}
            </FontText>
          </View> */}
          {/* <Input
            editable={editInformation}
            value={userName}
            onChangeText={(text: string) => {
              setUserName(text.trimStart());
            }}
            autoCapitalize="none"
            placeholder={'Enter Your Name'}
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
          /> */}
          <OutLine_Input
          fontSize={smallFont}
          color={'darkGray'}
          func={i => (nameRef = i)}
          onSubmitEditing={() => phonNoRef.focus()}
          returnKeyType={'next'}
          returnKeyLabel="next"
          placeholder={'Enter Your Name'}
          editable={editInformation}
          value={userName}
          label={'Name'}
            setValue={(text) => {
              setUserName(text.trimStart());
            }}
            fontName={'mont-medium'}
          />
          {isValidUserName && (
            <FontText
              size={normalize(12)}
              color={'red'}
              pTop={wp(1)}
              textAlign="right"
              name="regular">{`Name is Required.`}</FontText>
          )}
          <View style={styles.marginTopView}>
            {/* <Input
              editable={editInformation}
              ref={phonNoRef}
              value={phoneNo}
              onChangeText={(text: string) => setPhoneNo(text.trim())}
              placeholder={'Enter Your Mobile Number'}
              autoCapitalize="none"
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              inputStyle={styles.inputText}
              style={styles.input}
              color={'black'}
              returnKeyType={'done'}
              maxLength={10}
              keyboardType={'numeric'}
              blurOnSubmit
              children={
                <View style={[commonStyle.abs, {left: wp(4)}]}>
                  <SvgIcons.Phone width={iconSize} height={iconSize} />
                </View>
              }
            /> */}
            <OutLine_Input
            func={(i) => (phonNoRef = i)}
            onSubmitEditing={()=>console.log('done...')}
          fontSize={smallFont}
          color={'darkGray'}
          fontName={'mont-medium'}
          returnKeyType={'done'}
          returnKeyLabel="done"
          placeholder={'Enter Your PhoneNumber'}
          editable={editInformation}
          value={phoneNo}
          label={'Mobile Number'}
          setValue={(text)=>setPhoneNo(text.trim())}
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
            {/* <Input
              editable={false}
              ref={emailRef}
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
              placeholder={'Enter Your Email'}
              autoCapitalize="none"
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              inputStyle={[styles.inputText, {color: colors.gray}]}
              style={styles.input}
              color={'black'}
              returnKeyType={'next'}
              blurOnSubmit
              children={
                <View style={[commonStyle.abs, {left: wp(4)}]}>
                  <SvgIcons.Email width={iconSize} height={iconSize} />
                </View>
              }
            /> */}
             <OutLine_Input
             editable={false}
            func={(i) => (emailRef = i)}
            onSubmitEditing={()=>console.log('done...')}
          fontSize={smallFont}
          color={'darkGray'}
          returnKeyType={'done'}
          returnKeyLabel="done"
          placeholder={'Enter Your PhoneNumber'}
          value={email}
          label={'Email'}
          fontName={'mont-medium'}
          setValue={(text)=>setEmail(text.trim())}
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
        </View>
      </KeyboardAwareScrollView>
      <Button
        onPress={() => {
          editInformation ? onSubmitPress() : onEditPress();
        }}
        bgColor={'orange'}
        // disabled={!isCheck}
        style={styles.buttonContainer}>
        <FontText name={'mont-bold'} size={fontSize} color={'white'}>
          {btnText}
        </FontText>
      </Button>
    </View>
  );
};

export default PersonalDetailScreen;

const styles = StyleSheet.create({
  inputText: {
    borderRadius: 10,
    paddingLeft: wp(13),
    color: colors.black2,
    fontSize: normalize(14),
    fontFamily: fonts['mont-medium'],
    backgroundColor: colors.gray2,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    height: hp(6),
  },
  buttonContainer: {
    borderRadius: normalize(100),
    marginTop: hp(2),
    marginBottom: hp(3),
    marginHorizontal: wp(4),
  },
  marginTopView: {
    marginTop: hp(1.5),
  },
});
