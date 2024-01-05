import {ImageBackground} from 'react-native';
import React, {useEffect, useLayoutEffect} from 'react';
// import {requestPermission} from '../../helper/PushNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {resetNavigateTo} from '../../helper/navigationHelper';
import {RootScreens} from '../../types/type';
import {useDispatch, useSelector} from 'react-redux';
import { useGetCurrentUserQuery } from '../../api/auth';

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
  const {data, isFetching} = useGetCurrentUserQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  // const dispatch = useDispatch();
  // const userInfo = useSelector((state: any) => state.auth.userInfo);

  useLayoutEffect(() => {
    setTimeout(async () => {
      const token: any = await AsyncStorage.getItem('token');
      if (token && token.trim() !== '') {
        console.log('data?.result.companyCode', data?.result?.companyCode);
        if (
           data?.result?.companyCode === undefined ||
           data?.result?.companyCode === ''
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
  }, [isFetching]);

  return (
    <ImageBackground
      source={require('../../assets/images/splash.png')}
      resizeMode="stretch"
      style={{flex: 1}}
    />
  );
};

export default SplashScreen;
