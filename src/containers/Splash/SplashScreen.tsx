import {ImageBackground} from 'react-native';
import React, {useEffect} from 'react';
// import {requestPermission} from '../../helper/PushNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {resetNavigateTo} from '../../helper/navigationHelper';
import {RootScreens} from '../../types/type';
import {useSelector} from 'react-redux';

const SplashScreen = ({navigation}: any) => {
  // useEffect(() => {
  //   getToken();
  // }, []);

  // const getToken = async () => {
  //   const notificationToken = await AsyncStorage.getItem('NotiToken');
  //   if (!notificationToken) {
  //     requestPermission();
  //   }
  // };
  const userInfo = useSelector((state: any) => state.auth.userInfo);

  useEffect(() => {
    setTimeout(async () => {
      const token: any = await AsyncStorage.getItem('token');
      if (token && token.trim() !== '') {
        console.log('data?.result.companyCode', userInfo.companyCode);
        if (
          userInfo?.companyCode === undefined ||
          userInfo?.companyCode === ''
        ) {
          console.log('if......');
          navigation.navigate(RootScreens.CompanyDetail, {
            from: 'Login',
            name: 'Enter your company detail',
          });
        } else {
          console.log('else......');
          resetNavigateTo(navigation, RootScreens.DashBoard);
        }
      } else {
        console.log('else...last...');
        resetNavigateTo(navigation, RootScreens.Login);
      }
    }, 1000);
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/images/splash.png')}
      resizeMode="stretch"
      style={{flex: 1}}
    />
  );
};

export default SplashScreen;
