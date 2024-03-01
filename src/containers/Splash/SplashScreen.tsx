import {AppState, ImageBackground, Linking} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {resetNavigateTo} from '../../helper/navigationHelper';
import {RootScreens} from '../../types/type';
import {useLoginMutation} from '../../api/auth';
import {Loader, Popup} from '../../components';
import {checkVersion} from 'react-native-check-version';
import {hp} from '../../styles/responsiveScreen';
import Config from 'react-native-config';

const SplashScreen = ({navigation, route}: any) => {
  const [login, {isLoading}] = useLoginMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [updateDialog, setUpdateDialog] = useState({status: 'none', url: ''});

  const authData = async () => {
    const UserData = await AsyncStorage.getItem('userData');
    if (UserData) {
      const body = JSON.parse(UserData);
      const {data, error}: any = await login(body);
      if (!error && data?.statusCode === 200) {
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
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        _VersionCheck();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);

  async function _VersionCheck() {
    const version = await checkVersion();
    fetch(`${Config.API_URL}/systemSetting`)
      .then(response => response.json())
      .then(data => {
        if (version.needsUpdate === false) {
          const updateStatus = data?.result?.updateDialog;
          setUpdateDialog({status: updateStatus, url: version.url});
          if (updateStatus.toLowerCase() === 'forcefully') {
            setIsOpen(true);
          } else if (updateStatus.toLowerCase() === 'optional') {
            setIsOpen(true);
          } else {
            authData();
          }
        } else {
          authData();
        }
      })
      .catch(error => console.error('Error:', error));
  }

  return (
    <ImageBackground
      source={require('../../assets/images/splash.png')}
      resizeMode="stretch"
      style={{flex: 1}}>
      <Loader loading={isLoading} />
      {updateDialog?.status === 'forcefully' ? (
        <Popup
          visible={isOpen}
          title={'App update available'}
          description={'Please update the app to continue.'}
          rightBtnText={'Update'}
          rightBtnPress={() => {
            Linking.openURL(updateDialog.url);
            setIsOpen(false);
          }}
          rightBtnStyle={{width: '100%', height: hp(6)}}
        />
      ) : (
        <Popup
          visible={isOpen}
          title={'App update available'}
          description={'Please update the app to continue.'}
          leftBtnText={'Cancel'}
          leftBtnPress={() => {
            setIsOpen(false);
            authData();
          }}
          rightBtnText={'Update'}
          rightBtnPress={() => {
            Linking.openURL(updateDialog.url);
            setIsOpen(false);
          }}
        />
      )}
    </ImageBackground>
  );
};

export default SplashScreen;
