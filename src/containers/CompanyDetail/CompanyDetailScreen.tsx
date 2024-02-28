import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CompanyDetail, Popup} from '../../components';
import {colors, SvgIcons} from '../../assets';
import {resetNavigateTo} from '../../helper/navigationHelper';
import {authReset} from '../../redux/slices/authSlice';
import {wp} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import {mediumFont} from '../../styles';
import {useLogoutMutation} from '../../api/auth';
import utils from '../../helper/utils';

const CompanyDetailScreen = ({navigation, route}: any) => {
  const from = route.params.from;
  const data = route.params.data;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [logout, {isLoading}] = useLogoutMutation();

  React.useLayoutEffect(() => {
    if (from === 'Profile') {
      navigation.setOptions({
        gestureEnabled: true,
      });
    } else {
      navigation.setOptions({
        headerLeft: () => <></>,
        headerTitleAlign: 'left',
        headerTitleStyle: {
          width: 'auto', // Set width to 'auto' or a specific width
          fontSize: 18,
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => setIsOpen(true)}
            style={{marginRight: wp(2)}}>
            <SvgIcons.PowerOff
              width={wp(7)}
              height={wp(7)}
              fill={colors.orange}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, from]);

  const logoutPress = async () => {
    setIsOpen(false);
    const {data, error}: any = await logout();
    if(!error && data.statusCode === 200) {
      setLoading(true);
      await dispatch(authReset());
      await AsyncStorage.clear();
      const keysToRemove = ['token', 'MyCart', 'MyAddressList', 'NotiToken'];
      await AsyncStorage.multiRemove(keysToRemove);
      setLoading(false);
      resetNavigateTo(navigation, RootScreens.Login);
    } else {
      utils.showErrorToast(error.data.message);
    }
  };

  return (
    <>
      <CompanyDetail
        from={from}
        navigation={navigation}
        loading={loading || isLoading}
        loginData={data}
      />
      <Popup
        visible={isOpen}
        title={'Log out'}
        description={`Are you sure you want to logout?`}
        leftBtnText={'No'}
        rightBtnText={'Yes'}
        leftBtnPress={() => setIsOpen(false)}
        rightBtnPress={() => logoutPress()}
        onTouchPress={() => setIsOpen(false)}
        leftBtnStyle={{
          width: '48%',
          backgroundColor: colors.white2,
          borderWidth: 0,
        }}
        rightBtnStyle={{backgroundColor: colors.red2, width: '48%'}}
        leftBtnTextStyle={{
          color: colors.blue,
          fontSize: mediumFont,
        }}
        rightBtnTextStyle={{fontSize: mediumFont}}
        // style={{paddingHorizontal: wp(4), paddingVertical: wp(5)}}
      />
    </>
  );
};

export default CompanyDetailScreen;

const styles = StyleSheet.create({});
