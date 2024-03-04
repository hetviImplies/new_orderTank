import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyle, {fontSize, mediumFont} from '../../styles';
import {FontText, Loader, Popup} from '../../components';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import {PROFILE_LIST} from '../../helper/data';
import {RootScreens} from '../../types/type';
import {authReset} from '../../redux/slices/authSlice';
import {resetNavigateTo} from '../../helper/navigationHelper';
import {removeToken} from '../../helper/PushNotification';
import {useLogoutMutation} from '../../api/auth';
import utils from '../../helper/utils';

const ProfileScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [logout, {isLoading}] = useLogoutMutation();

  const onItemPress = (index: any) => {
    switch (index) {
      case 0:
        navigation.navigate(RootScreens.PersonalDetail);
        break;
      case 1:
        navigation.navigate(RootScreens.CompanyDetail, {
          from: 'Profile',
          name: 'Company detail',
        });
        break;
      case 2:
        navigation.navigate(RootScreens.Address);
        break;
      case 3:
        setIsDelete(false);
        setIsOpen(true);
        // navigation.navigate(RootScreens.VEHICLE, {From: 'Step'});
        break;
      case 4:
        setIsDelete(true);
        setIsOpen(true);
        // navigation.navigate(RootScreens.DEPOSITE, {From: 'Step'});
        break;
      case 5:
        // navigation.navigate(RootScreens.DEPOSITE, {From: 'Step'});
        break;
      case 6:
        // navigation.navigate(RootScreens.DEPOSITE, {From: 'Step'});
        break;

      case 7:
        // logoutPress();
        break;
      default:
        break;
    }
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        style={[styles.listContainer, commonStyle.shadowContainer]}
        onPress={() => onItemPress(index)}>
        <View style={commonStyle.rowAC}>
          <View style={styles.iconContainer}>{item?.icon}</View>
          <FontText
            color={item?.name === 'Delete Account' ? 'red' : 'black'}
            name="lexend-medium"
            size={fontSize}
            textAlign={'left'}>
            {item?.name}
          </FontText>
        </View>
      </TouchableOpacity>
    );
  };

  const logoutPress = async () => {
    setIsOpen(false);
    const {data, error}: any = await logout({});
    if (!error && data.statusCode === 200) {
      setLoading(true);
      await dispatch(authReset());
      await AsyncStorage.clear();
      const keysToRemove = ['token', 'MyCart', 'MyAddressList', 'NotiToken'];
      await AsyncStorage.multiRemove(keysToRemove);
      await removeToken();
      setLoading(false);
      resetNavigateTo(navigation, RootScreens.Login);
    } else {
      utils.showErrorToast(error.data.message);
    }
  };

  return (
    <View style={commonStyle.container}>
      {/* <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2)}}
        borderBottomWidth={0}
        left={
          <FontText
            name={'lexend-semibold'}
            size={mediumLargeFont}
            color={'black'}
            textAlign={'center'}>
            {'Profile'}
          </FontText>
        }
      /> */}
      <Loader loading={loading || isLoading} />
      <View style={[commonStyle.paddingH4, {marginTop: hp(1)}]}>
        <FlatList
          data={PROFILE_LIST}
          renderItem={_renderItem}
          contentContainerStyle={{padding: wp(0.5)}}
        />
        <Popup
          visible={isOpen}
          title={isDelete ? 'Delete Account' : 'Log out'}
          description={
            isDelete
              ? 'Are you sure you want to delete account?'
              : `Are you sure you want to logout?`
          }
          leftBtnText={'No'}
          rightBtnText={'Yes'}
          leftBtnPress={() => {
            setIsOpen(false);
            setIsOpen(false);
          }}
          rightBtnPress={() => logoutPress()}
          onTouchPress={() => {
            setIsOpen(false);
            setIsOpen(false);
          }}
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
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp(2),
    backgroundColor: colors.white,
    marginBottom: hp(2),
    borderRadius: normalize(11),
  },
  iconContainer: {
    borderRadius: 10,
    width: hp(4),
    height: hp(4),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(4),
  },
});
