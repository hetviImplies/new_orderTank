import {ImageBackground} from 'react-native';
import React, {useEffect, useLayoutEffect} from 'react';
// import {requestPermission} from '../../helper/PushNotification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {resetNavigateTo} from '../../helper/navigationHelper';
import {RootScreens} from '../../types/type';
import {useGetCurrentUserQuery} from '../../api/auth';

const SplashScreen = ({navigation}: any) => {
  const {data, isFetching} = useGetCurrentUserQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await data.fetch();
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, [data]);

  useLayoutEffect(() => {
    const checkCompanyCode = async () => {
      const token: any = await AsyncStorage.getItem('token');
      if (token && token.trim() !== '') {
        if (
          data?.result?.companyCode === undefined ||
          data?.result?.companyCode === ''
        ) {
          // navigation.navigate(RootScreens.CompanyDetail, {
          //   from: 'Login',
          //   name: 'Enter your company detail',
          // });
          resetNavigateTo(navigation, RootScreens.CompanyDetail, {
            from: 'Login',
            name: 'Enter your company detail',
          });
        } else {
          resetNavigateTo(navigation, RootScreens.DashBoard);
        }
      } else {
        resetNavigateTo(navigation, RootScreens.Login);
      }
    };

    if (!isFetching) {
      checkCompanyCode();
    }
  }, [isFetching, data, navigation]);

  return (
    <ImageBackground
      source={require('../../assets/images/splash.png')}
      resizeMode="stretch"
      style={{flex: 1}}
    />
  );
};

export default SplashScreen;
