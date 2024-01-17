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

const ProfileScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
        setIsOpen(true);
        // navigation.navigate(RootScreens.VEHICLE, {From: 'Step'});
        break;
      case 4:
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
            color="black"
            name="lexend-regular"
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
    setLoading(true);
    await AsyncStorage.clear();
    await AsyncStorage.removeItem('token');
    dispatch(authReset());
    setLoading(false);
    resetNavigateTo(navigation, RootScreens.Login);
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
      <Loader loading={loading} />
      <View style={[commonStyle.paddingH4, {marginTop: hp(1)}]}>
        <FlatList
          data={PROFILE_LIST}
          renderItem={_renderItem}
          contentContainerStyle={{padding: wp(0.5)}}
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
          leftBtnStyle={{width: '48%', borderColor: colors.blue}}
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
