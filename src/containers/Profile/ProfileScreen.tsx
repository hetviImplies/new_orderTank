import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commonStyle, {
  fontSize,
  iconSize,
  largeFont,
  mediumFont,
  mediumLargeFont,
  smallFont,
  tabIcon,
} from '../../styles';
import {Button, FontText, Input, Loader, Modal, Popup} from '../../components';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import {PROFILE_LIST} from '../../helper/data';
import {RootScreens} from '../../types/type';
import {authReset} from '../../redux/slices/authSlice';
import {resetNavigateTo} from '../../helper/navigationHelper';
import {removeToken} from '../../helper/PushNotification';
import {useGetCurrentUserQuery, useLogoutMutation} from '../../api/auth';
import utils from '../../helper/utils';
import {fonts, Images, SvgIcons} from '../../assets';
import {useFocusEffect} from '@react-navigation/native';
import {getCartItems} from '../Cart/Carthelper';
import { MaterialBottomTabView } from 'react-native-paper/lib/typescript/react-navigation';

const ProfileScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [logout, {isLoading}] = useLogoutMutation();
  const [isOpenLogout, setIsOpenLogout] = useState(false);
  const [cartItems, setCartItems] = useState<any>([]);

  const {data, isFetching} = useGetCurrentUserQuery(null, {
    refetchOnMountOrArgChange: true,
  });

  console.log('data: ', data.result.company.logo);

  useFocusEffect(
    React.useCallback(() => {
      const fetchCartItems = async () => {
        const items = await getCartItems('MyCart');
        setCartItems(items);
      };
      fetchCartItems();
    }, []),
  );

  React.useLayoutEffect(() => {
    // *******************************  Hetvi ********************************
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.orange,
      },
      headerLeft: () => (
        <View
          style={[
            commonStyle.rowAC,
            {marginLeft: wp(4), flexDirection: 'row'},
          ]}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 50,
              padding: 7,
              marginRight: wp(4),
              borderColor: colors.yellow3,
            }}
            // style={commonStyle.iconView}
            onPress={() => navigation.navigate(RootScreens.Home)}>
            <SvgIcons.Back_Arrow width={iconSize} height={iconSize} />
          </TouchableOpacity>
          <FontText
            name={'mont-semibold'}
            size={mediumLargeFont}
            color={'white'}>
            Profile
          </FontText>
        </View>
      ),
      headerRight: () => (
        <View
          style={[
            commonStyle.row,
            {
              marginRight: wp(4),
              width: wp(10),
              justifyContent: 'space-between',
            },
          ]}>
          {/* <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 50,
              padding: 5,
              borderColor: colors.yellow3,
            }}
            // style={commonStyle.iconView}
            onPress={() => setIsOpen(true)}>
            <SvgIcons.Icon_code width={tabIcon} height={tabIcon} />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 50,
              padding: 5,
              borderColor: colors.yellow3,
            }}
            // style={commonStyle.iconView}
            onPress={() => navigation.navigate(RootScreens.Cart)}>
            <SvgIcons.Cart width={tabIcon} height={tabIcon} />
            {cartItems?.length ? (
              <View style={commonStyle.cartCountView}>
                <FontText
                  color="orange"
                  name="mont-semibold"
                  size={normalize(10)}
                  textAlign={'center'}>
                  {cartItems?.length}
                </FontText>
              </View>
            ) : null}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, cartItems]);

  const onItemPress = (index: any) => {
    switch (index) {
      case 0:
        navigation.navigate(RootScreens.CompanyDetail, {
          from: 'Profile',
          name: 'Company detail',
        });
        break;
      case 1:
        navigation.navigate(RootScreens.Address);
        break;
      case 2:
        navigation.navigate(RootScreens.Notification);
        break;
      case 3:
        // setIsDelete(false);
        // setIsOpen(true);
        // navigation.navigate(RootScreens.VEHICLE, {From: 'Step'});
        break;
      case 4:
        // setIsDelete(true);
        // setIsOpen(true);
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
        style={[styles.listContainer, {marginTop: index === 0 ? wp(0) : wp(3)}]}
        onPress={() => onItemPress(index)}>
        <View
          style={[
            commonStyle.rowAC,
            {
              borderBottomWidth: index === PROFILE_LIST.length - 1 ? 0 : 1,
              width: '100%',
              paddingBottom: index === PROFILE_LIST.length - 1 ? wp(0) : wp(3),
              borderBottomColor: colors.orange3,
              justifyContent: 'space-between',
            },
          ]}>
          <View style={[commonStyle.rowAC, {alignItems: 'center'}]}>
            <View style={styles.iconContainer}>{item?.icon}</View>
            <FontText
              color={item?.name === 'Delete Account' ? 'red' : 'black'}
              name="mont-semibold"
              size={mediumFont}
              textAlign={'left'}>
              {item?.name}
            </FontText>
          </View>
          <SvgIcons._RightArrow />
        </View>
      </TouchableOpacity>
    );
  };

  const logoutPress = async () => {
    setIsOpenLogout(false);
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
      <View style={{padding: wp(4), borderWidth: 0,flexDirection:"row",alignItems:'center',justifyContent:"space-between"}}>
        <View style={{flexDirection:"row"}}>
        <Image
          source={data?.result?.company?.logo ? {uri : data?.result?.company?.logo} :Images.companyImg}
          style={{
            width: wp(15),
            height: wp(15),
            borderRadius: normalize(100),
          }}></Image>
        <View style={{flexDirection:"column",justifyContent:"space-between",margin:wp(2.3)}}>
          <FontText
            color="black2"
            style={{maxWidth:wp(50)}}
            name="mont-bold"
            size={mediumFont}
            textAlign={'left'}>
            {data?.result?.name}
          </FontText>
          <FontText
          style={{maxWidth:wp(50)}}
            color="darkGray"
            name="mont-semibold"
            size={smallFont}
            textAlign={'left'}>
            {data?.result?.email}
          </FontText>
        </View>
        </View>
        <View>
          <TouchableOpacity onPress={()=> navigation.navigate(RootScreens.PersonalDetail)} style={{borderRadius:normalize(100),backgroundColor:colors.orange4,padding:wp(3)}}>
            <SvgIcons._Edit_Yellow height={iconSize} width={iconSize} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView  showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          {paddingBottom:hp(15)
          },
        ]}>
      <View
        style={[
          {
            marginHorizontal: wp(3),
            borderWidth: 1,
            borderStyle: 'dashed',
            borderRadius: normalize(15),
            borderColor: colors.orange,
            backgroundColor: colors.orange2,
            padding: wp(2),
          },
        ]}>
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
      </ScrollView>
      <Button
        onPress={()=>setIsOpenLogout(true)}
        bgColor={'orange'}
        flex={null}
        style={[styles.buttonStyle]}>
        <FontText
          name={'mont-bold'}
          size={fontSize}
          color={'white'}>
          {'Logout'}
        </FontText>
      </Button>
      <Modal
        visible={isOpenLogout}
        onBackPress={() => {
          setIsOpenLogout(false);
        }}
        title={' '}
        children={
          <View style={{alignItems:"center",flexDirection:"column"}}>
            <View style={{backgroundColor:colors.orange4,borderRadius:normalize(10),padding:normalize(20),alignItems:"center",justifyContent:"center"}}>
            <SvgIcons.Logout_Profile  />
            </View>
            <FontText
            style={{marginVertical:hp(2)}}
          name={'mont-bold'}
          size={largeFont}
          color={'black'}>
          {'Logout?'}
        </FontText>
        <FontText
          name={'mont-semibold'}
          size={mediumFont}
          color={'black2'}>
          {'Are you Sure, do you want to logout?'}
        </FontText>
      </View>
        }
        rightBtnText={'Yes'}
        leftBtnText={'No'}
        rightBtnColor={'orange'}
        leftBtnColor={'orange4'}
        rightBtnPress={logoutPress}
        leftBtnPress={() => setIsOpenLogout(false)}
        onTouchPress={() => setIsOpen(false)}
        leftBtnStyle={{
          width: '48%',
          backgroundColor: colors.orange4,
          borderWidth: 0,
          marginTop: wp(6),
          borderRadius: normalize(100),
        }}
        rightBtnStyle={{
          backgroundColor: colors.orange,
          width: '48%',
          marginTop: wp(6),
        }}
        leftBtnTextStyle={{
          color: colors.orange,
          fontSize: mediumFont,
          fontFamily: fonts['mont-bold'],
        }}
        rightBtnTextStyle={{
          fontSize: mediumFont,
          fontFamily: fonts['mont-bold'],
        }}
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: normalize(11),
  },
  iconContainer: {
    borderRadius: normalize(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: wp(4),
    backgroundColor: colors.orange3,
    padding: wp(3),
  },
  buttonStyle: {
    borderRadius: 100,
    width: '90%',
    alignSelf: 'center',
    position:'absolute',bottom:wp(10)
  },
});
