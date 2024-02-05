import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CompanyDetail, Popup} from '../../components';
import {colors,SvgIcons} from '../../assets';
import {resetNavigateTo} from '../../helper/navigationHelper';
import {authReset} from '../../redux/slices/authSlice';
import {wp} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import {mediumFont} from '../../styles';

const CompanyDetailScreen = ({navigation, route}: any) => {
  const from = route.params.from;
  const data = route.params.data;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  React.useLayoutEffect(() => {
    if (from !== 'Profile') {
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
    setLoading(true);
    await dispatch(authReset());
    await AsyncStorage.clear();
    const keysToRemove = ['token', 'MyCart', 'MyAddressList', 'NotiToken'];
    await AsyncStorage.multiRemove(keysToRemove);
    setLoading(false);
    resetNavigateTo(navigation, RootScreens.Login);
  };

  return (
    <>
      <CompanyDetail
        from={from}
        navigation={navigation}
        loading={loading}
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
