import {ImageBackground, StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Images from '../../assets/images';
import {Button, FontText} from '../../components';
import {largeFont, mediumFont, mediumLargeFont} from '../../styles';
import {hp, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import {RootScreens} from '../../types/type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setIsAuthenticated} from '../../redux/slices/authSlice';
import {useDispatch} from 'react-redux';
// import {requestPermission} from '../../helper/PushNotification';

const WelcomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  // const [token, setToken] = useState('');

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    // const notificationToken = await AsyncStorage.getItem('NotiToken');
    // if (!notificationToken) {
    //   requestPermission();
    // }
    const token: any = await AsyncStorage.getItem('token');
    if (token && token.trim() !== '') {
      dispatch(setIsAuthenticated(true));
    }
  };

  const onStartedHandler = async() => {
    await AsyncStorage.setItem('check', 'true');
    navigation.navigate(RootScreens.Login);
  };

  return (
    <>
      <ImageBackground
        source={Images.splashImg}
        style={styles.splashImage}
        resizeMode="cover">
        <View style={styles.bottomContainer}>
          <FontText
            name={'opensans-semibold'}
            size={largeFont}
            color={'white'}
            textAlign={'center'}>
            Find the Best
          </FontText>
          <View style={styles.labelView}>
            <FontText
              name={'opensans-extrabold'}
              size={largeFont}
              color={'white'}
              pRight={wp(2)}
              textAlign={'center'}>
              Watches
            </FontText>
            <FontText
              name={'opensans-semibold'}
              size={largeFont}
              color={'white'}
              textAlign={'center'}>
              For You
            </FontText>
          </View>
          <FontText
            name={'opensans-semibold'}
            size={mediumFont}
            color={'lightgray'}
            textAlign={'center'}
            pBottom={hp(3)}>
            {`Get the best version of\nyour look style`}
          </FontText>
          <Button
            onPress={onStartedHandler}
            bgColor={'brown'}
            style={styles.buttonContainer}>
            <FontText
              pLeft={wp(4)}
              pRight={wp(4)}
              name={'opensans-semibold'}
              size={mediumLargeFont}
              color={'white'}>
              {'Get Started'}
            </FontText>
          </Button>
        </View>
      </ImageBackground>
    </>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  splashImage: {
    width: '100%',
    height: '100%',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: hp(5),
    width: '100%',
  },
  buttonContainer: {
    borderRadius: 10,
    height: hp(7),
    width: '70%',
    alignSelf: 'center',
  },
  labelView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: hp(3),
  },
});
