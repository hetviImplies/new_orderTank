import { ImageBackground } from 'react-native';
import React, { useEffect, useLayoutEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetNavigateTo } from '../../helper/navigationHelper';
import { RootScreens } from '../../types/type';
import { useLoginMutation } from '../../api/auth';
import { Loader } from '../../components';

const SplashScreen = ({ navigation }: any) => {
  const [login, { isLoading }] = useLoginMutation();

  useLayoutEffect(() => {
    authData()
  }, []);

  const authData = async () => {
    const UserData = await AsyncStorage.getItem('userData');
    console.log('UserData...', UserData)
    if (UserData) {
      const body = JSON.parse(UserData);
      const { data, error }: any = await login(body);
      if (!error && data?.statusCode === 200) {
        console.log('login data....', data)
        if (!data?.result?.company || data?.result?.company === null) {
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
    } else {
      resetNavigateTo(navigation, RootScreens.Login);
    }
  }

  return (
    <ImageBackground
      source={require('../../assets/images/splash.png')}
      resizeMode="stretch"
      style={{ flex: 1 }}
    >
      <Loader loading={isLoading} />
    </ImageBackground>
  );
};

export default SplashScreen;
