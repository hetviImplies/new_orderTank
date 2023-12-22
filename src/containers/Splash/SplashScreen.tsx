import {ImageBackground} from 'react-native';
import React, {useEffect} from 'react';
// import {requestPermission} from '../../helper/PushNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {resetNavigateTo} from '../../helper/navigationHelper';
import {RootScreens} from '../../types/type';

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

  useEffect(() => {
    setTimeout(async () => {
      const token: any = await AsyncStorage.getItem('token');
      const navigateTo: any = await AsyncStorage.getItem('navigateTo'); 
      const checkValue: any = await AsyncStorage.getItem('check'); 
      if (
        (token && token.trim() !== '') ||
        navigateTo == RootScreens.DashBoard
      ) {
        resetNavigateTo(navigation, RootScreens.DashBoard);
      } else {
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
