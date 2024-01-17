import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import CompanyDetail from '../../components/CompanyDetail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SvgIcons from '../../assets/SvgIcons';
import colors from '../../assets/colors';
import {resetNavigateTo} from '../../helper/navigationHelper';
import {authReset} from '../../redux/slices/authSlice';
import {wp} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import {useDispatch} from 'react-redux';
import Popup from '../../components/Popup';
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
    await AsyncStorage.clear();
    await AsyncStorage.removeItem('token');
    dispatch(authReset());
    setLoading(false);
    resetNavigateTo(navigation, RootScreens.Login);
  };

  return (
    <>
      <CompanyDetail from={from} navigation={navigation} loading={loading} loginData={data}/>
      <Popup
        visible={isOpen}
        title={'Log out'}
        description={`Are you sure you want to logout?`}
        leftBtnText={'No'}
        rightBtnText={'Yes'}
        leftBtnPress={() => setIsOpen(false)}
        rightBtnPress={() => logoutPress()}
        onTouchPress={() => setIsOpen(false)}
        leftBtnStyle={{width: '48%', borderColor: colors.blue}}
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
