import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import {FloatingAction} from 'react-native-floating-action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {colors, SvgIcons, Images, fonts} from '../../assets';
import {
  FontText,
  Input,
  Loader,
  Popup,
  AddressComponent,
  ListHeader,
  Button,
  CountCard,
  PendingOrderComponent,
  PendingSuppliersComponent,
  BackModal,
} from '../../components';
import commonStyle, {
  fontSize,
  iconSize,
  mediumFont,
  mediumLarge1Font,
  smallFont,
  tabIcon,
} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import utils from '../../helper/utils';
import {useGetCompanyQuery} from '../../api/company';
import {useGetOrdersQuery} from '../../api/order';
import {withInAppNotification} from '../../components/Common/InAppNotification';
import {setCurrentUser} from '../../redux/slices/authSlice';
import {useGetCurrentUserQuery} from '../../api/auth';
import {getCartItems, mergeArrays, updateAddressList} from '../Cart/Carthelper';
import {useGetNotificationQuery} from '../../api/notification';
import {FLOATING_BTN_ACTION} from '../../helper/data';
import {
  useCompanyRequestMutation,
  useGetSupplierQuery,
} from '../../api/companyRelation';
import { ConditionContext } from '../ConditionProvider/ConditionContext';


const HomeScreen = ({navigation, route, showNotification}: any) => {
  const dispatch = useDispatch();
  const loginData = route?.params?.data;
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const [sendCompanyReq, {isLoading: isProcess}] = useCompanyRequestMutation();
  const {
    data: userData,
    isFetching: isFetch,
    refetch: refetchCurrentUser,
  } = useGetCurrentUserQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const {
    data,
    isFetching,
    refetch: compRefetch,
  } = useGetCompanyQuery(
    loginData?.company?.id ? loginData?.company?.id : userInfo?.company?.id,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const {
    data: notificationData,
    isFetching: isNotiFetch,
    refetch: notiRefetch,
  } = useGetNotificationQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const {
    data: orderList,
    isFetching: isProcessing,
    refetch,
  } = useGetOrdersQuery(
    {
      isBuyerOrder: true,
      status: 'pending',
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const {
    data: supplierList,
    isFetching: isReqProcessing,
    refetch: reqRefetch,
  } = useGetSupplierQuery(
    {isRequested: true, sellerLists: true},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [notification, setNotification] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [orderData, setOrderData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [cartItems, setCartItems] = useState<any>([]);
  const {condition,setCondition, floatRef} = useContext(ConditionContext);
  useFocusEffect(
    React.useCallback(() => {
      refetch();
      notiRefetch();
      compRefetch();
      reqRefetch();
      refetchCurrentUser();
    }, [refetch]),
  );

  useFocusEffect(
    React.useCallback(() => {
      refetchCurrentUser();
    }, [isFetching, refetch]),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (notificationData?.result?.length !== 0) {
        const data = notificationData?.result?.find(
          (item: any) => item.isSeen === false,
        );
        setNotification(data === undefined ? {} : data);
      }
    }, [notificationData, isNotiFetch]),
  );

  useEffect(() => {
    async function currentUserData() {
      await dispatch(setCurrentUser(userData?.result));
    }
    currentUserData();
  }, [isFetch, userData]);

  useEffect(() => {
    async function getAddressData() {
      const updateAddress = data?.result?.addresses.filter(
        (item: any) => item?.isDeleted === false,
      );
      const mergedArray = await mergeArrays(updateAddress);
      await updateAddressList(mergedArray);
    }
    getAddressData();
  }, [data, isFetching, loginData]);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, []),
  );

  React.useLayoutEffect(() => {
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
          {data?.result?.logo ? (
            <Image
              source={{
                uri: data?.result?.logo,
              }}
              style={styles.avatar}
            />
          ) : (
            // <View style={styles.avatar} />
            <Image source={Images.companyImg} style={styles.avatar} />
          )}
          <View style={{marginLeft: '5%'}}>
            <FontText name={'mont-semibold'} size={smallFont} color={'white'}>
              {'Welcome to OrderTank'}
            </FontText>
            <FontText style={{maxWidth:wp(50)}} name={'mont-semibold'} size={mediumFont} color={'white'}>
              {userInfo?.name}
            </FontText>
          </View>
        </View>
      ),
      headerRight: () => (
        <View
          style={[
            commonStyle.row,
            {
              marginRight: wp(4),
              width: wp(21),
              justifyContent: 'space-between',
            },
          ]}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 50,
              padding: 5,
              borderColor: colors.yellow3,
            }}
            // style={commonStyle.iconView}
            onPress={() => navigation.navigate(RootScreens.Notification)}>
            <SvgIcons.Bell_ width={tabIcon} height={tabIcon} />
            {Object.keys(notification)?.length !== 0 &&
              notification?.isSeen === false && (
                <View style={styles.countView} />
              )}
          </TouchableOpacity>
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
  }, [
    navigation,
    userInfo,
    isFetching,
    isNotiFetch,
    notificationData,
    notification,
    cartItems
  ]);

  useEffect(() => {
    setOrderData(orderList?.result?.data);
  }, [isProcessing]);

  useEffect(() => {
    getNotification();
  }, []);

  const getNotification = async () => {
    const notificationToken = await AsyncStorage.getItem('NotiToken');
    const onMessageListener = messaging().onMessage(async remoteMessage => {
      console.log('home notitoken.......', notificationToken);
      console.log('remoteMessage', remoteMessage);
      showNotification({
        title: remoteMessage?.notification?.title,
        message: remoteMessage?.notification?.body,
        icon: Images.notificationImg,
        onPress: () => {
          navigation.navigate(RootScreens.Notification);
        },
      });
    });

    const onNotificationOpened = messaging().onNotificationOpenedApp(
      remoteMessage => {
        navigation.navigate(RootScreens.Notification);
      },
    );

    const notificationOpen = await messaging().getInitialNotification();
    if (notificationOpen) {
      navigation.navigate(RootScreens.Notification);
    }

    return async () => {
      try {
        onMessageListener();
        onNotificationOpened();
      } catch (error) {
        utils.showErrorToast(error);
      }
    };
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchCartItems = async () => {
        const items = await getCartItems('MyCart');
        setCartItems(items);
      };
      fetchCartItems();
    }, []),
  );

  const _renderItem = ({item, index}: any) => {
    return (
      <PendingOrderComponent item={item} navigation={navigation}/>
    )
  };

  const _reqRenderItem = ({item, index}: any) => {
    return (
      <PendingSuppliersComponent navigation={navigation} disable={true} item={item}/>
    );
  };

  const onAddCodePress = () => {
    setIsOpen(true);
  };

  const applyCodePress = async () => {
    setIsOpen(false);
    let params = {
      companyCode: code,
    };
    const {data, error}: any = await sendCompanyReq(params);
    if (!error && data?.statusCode === 201) {
      setCode('');
      utils.showSuccessToast(data.message);
    } else {
      setCode('');
      utils.showErrorToast(
        data?.message ? data?.message : error?.data?.message,
      );
    }
  };

  const onRefreshing = () => {
    setRefreshing(true);
    refetch();
    reqRefetch();
    setRefreshing(false);
  };

  return (
    <>
      <ScrollView
        style={commonStyle.container}
        contentContainerStyle={{flex: 1}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />
        }
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            borderWidth: 0,
            justifyContent: 'space-between',
            width: wp(92),
            alignSelf: 'center',
          }}>
          <CountCard
            title={'Total Suppliers'}
            count={supplierList?.result?.data.length}
            func={()=> navigation.navigate(RootScreens.Supplier)}
          />
          <CountCard title={'Total Orders'} 
          count={orderData?.length} func={()=> navigation.navigate(RootScreens.Order,{from : "Home"})}/>
        </View>
        {/* <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2.5)}}
        borderBottomWidth={0}
        leftStyle={{width: '70%'}}
        left={
          <View style={[commonStyle.rowAC]}>
            <View style={commonStyle.rowAC}>
              {userInfo && userInfo?.companyId?.logo ? (
                <Image
                  source={{uri: userInfo?.companyId?.logo}}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatar} />
              )}
            </View>
            <FontText
              name={'lexend-semibold'}
              size={fontSize}
              color={'black'}
              textAlign={'left'}>
              {'Welcome to Ordertank'}
            </FontText>
          </View>
        }
        // right={
        //   <View style={[commonStyle.row]}>
        //     <TouchableOpacity
        //       style={commonStyle.iconView}
        //       onPress={() => navigation.navigate(RootScreens.Notification)}>
        //       <SvgIcons.Bell width={tabIcon} height={tabIcon} />
        //       {Object.keys(notification).length !== 0 &&
        //         !notification?.isRead && <View style={styles.countView} />}
        //     </TouchableOpacity>
        //   </View>
        // }
      /> */}
        <Loader
          loading={
            isProcessing ||
            isProcess ||
            isFetch ||
            isNotiFetch ||
            isReqProcessing
          }
        />

        {supplierList?.result?.data?.length !== 0 || orderData?.length !== 0 ? (
          <View style={{marginTop: hp(1)}}>
            {supplierList &&
            supplierList?.result?.data &&
            supplierList?.result?.data.length !== 0 ? (
              <View style={styles.listContainer}>
                <ListHeader
                  leftName={'Pending Requests'}
                  rightName={'See all'}
                  rightPress={() => {
                    navigation.navigate(RootScreens.PendingRequest);
                  }}
                />
                <View style={styles.containerContent}>
                  {supplierList?.result?.data?.slice(0, 2).map((item: any) => {
                    return _reqRenderItem({item});
                  })}
                </View>
              </View>
            ) : null}
            {orderData && orderData.length !== 0 ? (
              <View style={[styles.listContainer, {paddingVertical: 0}]}>
                <ListHeader
                  leftName={'Pending Orders'}
                  rightName={'See all'}
                  rightPress={() => {
                    navigation.navigate(RootScreens.Order, {
                      type: {
                        label: 'Pending',
                        value: 'pending',
                      },
                    });
                  }}
                />
                <View style={styles.product2CC}>
                  {orderData &&
                    orderData.slice(0, 2).map((item: any) => {
                      return _renderItem({item});
                    })}
                </View>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={[commonStyle.allCenter, {flex: 1}]}>
            <FontText
              color="gray"
              name="mont-medium"
              size={mediumFont}
              textAlign={'center'}>
              {'No Data found.'}
            </FontText>
          </View>
        )}
         <BackModal onBackPress={async()=>{
            floatRef.current.animateButton();
           setCondition(false)
          }} visible={condition}/>
        <Popup
          visible={isOpen}
          onBackPress={() => setIsOpen(false)}
          title={'Enter Supplier Code'}
          titleStyle={{textAlign: 'left'}}
          children={
            <Input
              value={code}
              onChangeText={(text: string) => setCode(text.trimStart())}
              placeholder={''}
              autoCapitalize="none"
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              inputStyle={styles.inputText}
              style={styles.input}
              color={'black'}
              returnKeyType={'next'}
              keyboardType={'numeric'}
              blurOnSubmit
            />
          }
          disabled={code !== '' ? false : true}
          rightBtnText={'Apply'}
          rightBtnColor={code !== '' ? 'orange' : 'gray'}
          rightBtnPress={applyCodePress}
          rightBtnStyle={{width: '100%'}}
        />
      </ScrollView>
      {/* <FloatingAction
        actions={FLOATING_BTN_ACTION}
        onPressItem={name => {
          if (name === 'bt_supplier') {
            onAddCodePress();
          } else {
            navigation.navigate(RootScreens.Supplier);
          }
        }}
        showBackground={true}
        overlayColor="rgba(52, 52, 52, 0.5)"
        color={colors.orange}
        buttonSize={hp(7)}
        iconHeight={hp(2.2)}
        iconWidth={hp(2.2)}
        shadow={{
          shadowOpacity: 0.35,
          shadowOffset: {width: 0, height: 5},
          shadowColor: 'trasparent',
          shadowRadius: 3,
        }}
      /> */}
    </>
  );
};

export default withInAppNotification(HomeScreen);
// export default HomeScreen;

const styles = StyleSheet.create({
  avatar: {
    width: hp(5),
    height: hp(5),
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.white,
  },
  inputText: {
    borderRadius: 10,
    paddingLeft: wp(6),
    color: colors.black2,
    fontSize: normalize(14),
    fontFamily: fonts['mont-medium'],
    backgroundColor: colors.white,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    height: hp(6),
    marginVertical: hp(1),
  },
  iconView: {
    backgroundColor: colors.white2,
    borderRadius: 12,
    width: hp(6),
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: hp(1),
  },
  countView: {
    width: wp(2.6),
    height: wp(2.6),
    backgroundColor: colors.white,
    borderRadius: wp(10),
    position: 'absolute',
    left: wp(5),
    bottom:wp(7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashedLine: {
    marginTop: wp(1),
    borderTopWidth: 1,
    borderColor: colors.orange3,
    marginHorizontal: wp(3),
  },
  paddingT1: {
    paddingTop: hp(1),
  },
  addressContainer: {
    padding: wp(3),
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: normalize(8),
    marginBottom: hp(2),
  },
  listContainer: {
    backgroundColor: colors.white,
    marginTop: hp(1.5),
    paddingVertical: wp(2),
  },
  product2CC: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1.5),
    paddingBottom: hp(0.5),
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    backgroundColor: colors.orange2,
    borderRadius: normalize(10),
    marginBottom: hp(1.5),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.orange,
  },
  logo: {
    width: hp(6.5),
    height: hp(6.5),
    resizeMode: 'cover',
    borderRadius: normalize(5),
    marginRight: wp(3),
    borderWidth: 0.2,
    borderColor: colors.black2,
  },
  buttonContainer: {
    borderRadius: 5,
    height: hp(3.5),
    width: wp(20),
  },
  containerContent: {
    paddingTop: hp(0.5),
    paddingHorizontal: wp(4),
    marginTop: hp(1),
  },
});
