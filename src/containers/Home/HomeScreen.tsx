import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SvgIcons from '../../assets/SvgIcons';
import {FontText, Input, Loader} from '../../components';
import {fontSize, mediumFont, smallFont, tabIcon} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import {RootScreens} from '../../types/type';
import commonStyle from '../../styles';
import messaging from '@react-native-firebase/messaging';
import Popup from '../../components/Popup';
import {useDispatch, useSelector} from 'react-redux';
import utils from '../../helper/utils';
import Images from '../../assets/images';
import {useCompanyRequestMutation, useGetCompanyQuery} from '../../api/company';
import {FloatingAction} from 'react-native-floating-action';
import {useGetOrdersQuery} from '../../api/order';
import moment from 'moment';
import AddressComponent from '../../components/AddressComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {withInAppNotification} from '../../components/Common/InAppNotification';
import {useFocusEffect} from '@react-navigation/native';
import {setCurrentUser} from '../../redux/slices/authSlice';
import {useGetCurrentUserQuery} from '../../api/auth';
import {setAddressList} from '../../redux/slices/addressSlice';
import {
  getAddressList,
  mergeArrays,
  updateAddressList,
} from '../Cart/Carthelper';
import {
  useGetNotificationQuery,
  useReadNotificationMutation,
} from '../../api/notification';

const actions = [
  {
    text: 'Add Supplier',
    icon: <SvgIcons.AddSupplier width={tabIcon} height={tabIcon} />,
    name: 'bt_supplier',
    color: '#EEEEEE',
    position: 2,
    buttonSize: hp(5.5),
    textBackground: colors.orange,
    textColor: 'white',
  },
  {
    text: 'Add Order',
    icon: <SvgIcons.AddOrder width={tabIcon} height={tabIcon} />,
    name: 'bt_order',
    color: '#EEEEEE',
    position: 1,
    buttonSize: hp(5.5),
    textBackground: colors.orange,
    textColor: 'white',
  },
];

const HomeScreen = ({navigation, route, showNotification}: any) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const companyId = useSelector((state: any) => state.auth.companyId);
  // const userData = route?.params?.data;
  const [sendCompanyReq, {isLoading: isProcess}] = useCompanyRequestMutation();
  const {data, isFetching} = useGetCompanyQuery(
    userInfo?.companyId?._id || userInfo?.companyId || companyId,
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const {data: notificationData, isFetching: isNotiFetch, refetch: notiRefetch,} =
    useGetNotificationQuery(null, {
      refetchOnMountOrArgChange: true,
    });
  const {data: userData, isFetching: isFetch} = useGetCurrentUserQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const [notification, setNotification] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [orderData, setOrderData] = React.useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: orderList,
    isFetching: isProcessing,
    refetch,
  } = useGetOrdersQuery(
    {
      isBuyer: true,
      status: 'pending',
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  useFocusEffect(
    React.useCallback(() => {
      refetch();
      notiRefetch();
    }, [refetch]),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (notificationData?.result?.length !== 0) {
        const data = notificationData?.result?.find(
          (item: any) => item.seen === false,
        );
        console.log('item....//////', data);
        setNotification(data === undefined ? {} : data);
      }
    }, [notificationData, isNotiFetch]),
  );

  useEffect(() => {
    dispatch(setCurrentUser(userData?.result));
  }, [isFetch]);

  // useEffect(() => {
  //   let list = data?.result?.address.map((item: any) => ({
  //     ...item,
  //     deliveryAdd: item.isPriority,
  //     billingAdd: item.isPriority,
  //   }));
  //   dispatch(setAddressList(list));
  //   console.log('list', list);
  // }, [data, isFetching]);

  useEffect(() => {
    getAddressData();
  }, [data, isFetching]);

  const getAddressData = async () => {
    const mergedArray = await mergeArrays(data?.result?.address);
    await updateAddressList(mergedArray);
    // const addressData = await getAddressList();
  };
  // console.log('data.....//////', addressData.length, addressData);

  // const getAddressData = async () => {
  //   const addressData = await getAddressList();
  //     'data.....//////',
  //   console.log(
  //     addressData.length,
  //     addressData,
  //   );
  //   if (data?.result && addressData.length === 0) {

  //     console.log('HOME address', data?.result?.address[0]);
  //     let upadetdData: any = [];
  //     upadetdData.push({
  //       ...data?.result?.address[0],
  //       deliveryAdd: true,
  //       billingAdd: true,
  //     });
  //     // let list: any = data?.result?.address.map((item: any) => ({
  //     //   ...item,
  //     //   deliveryAdd: item.isPriority,
  //     //   billingAdd: item.isPriority,
  //     // }));
  //     await updateAddressList(upadetdData);
  //     console.log('list', upadetdData);
  //   } else {
  //     let updateData = data?.result?.address.map((address: any) => {
  //     console.log('address..........//', addressData);
  //       let find = addressData.find((item: any) => item._id === address._id);
  //       // let find = addressData.includes(address._id);
  //       if (!find) {
  //       console.log('FOUND', find);
  //         return {
  //           ...address,
  //           deliveryAdd: false,
  //           billingAdd: false,
  //         };
  //       }
  //       return {
  //         ...address,
  //         deliveryAdd: find?.deliveryAdd || false,
  //         billingAdd: find?.billingAdd || false,
  //       };
  //     });
  //     await updateAddressList(updateData);
  //     // console.log('updateData', updateData);
  //   }
  // };

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, []),
  );

  console.log('notification?.seen', notification?.seen);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View style={[commonStyle.rowAC, {marginLeft: wp(4)}]}>
          {userInfo?.companyId?.logo || data?.result?.logo ? (
            <Image
              source={{
                uri: data?.result?.logo
                  ? data?.result?.logo
                  : userInfo?.companyId?.logo,
              }}
              style={styles.avatar}
            />
          ) : (
            // <View style={styles.avatar} />
            <Image source={Images.companyImg} style={styles.avatar} />
          )}
        </View>
      ),
      headerRight: () => (
        <View style={[commonStyle.row, {marginRight: wp(4)}]}>
          <TouchableOpacity
            // style={commonStyle.iconView}
            onPress={() => navigation.navigate(RootScreens.Notification)}>
            <SvgIcons.Bell width={tabIcon} height={tabIcon} />
            {/* {noitification?.result?.length > noitification?.result?.length && <View style={styles.countView} />} */}
            {Object.keys(notification)?.length !== 0 && notification?.seen === false && (
              <View style={styles.countView} />
            )}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, userInfo, isFetching, isNotiFetch, notificationData, notification]);

  useEffect(() => {
    setOrderData(orderList?.result);
  }, [isProcessing]);

  useEffect(() => {
    getNotification();
  }, []);

  const getNotification = async () => {
    const notificationToken = await AsyncStorage.getItem('NotiToken');
    const onMessageListener = messaging().onMessage(async remoteMessage => {
      console.log('home notitoken.......', notificationToken);
      showNotification({
        title: remoteMessage?.notification?.title,
        message: remoteMessage?.notification?.body,
        icon: Images.notificationImg,
        // leftIcon: `${URLS.BASE_URL}/notifications/${remoteMessage?.data?.notificationId}/attachments`,
      });
    });

    return async () => {
      try {
        onMessageListener();
        // onNotificationOpened();
      } catch (error) {
        utils.showErrorToast(error);
      }
    };
  };

  const onItemPress = (index: any) => {
    switch (index) {
      case 0:
        navigation.navigate(RootScreens.Order);
        break;
      case 1:
        navigation.navigate(RootScreens.Supplier);
        break;
      // case 2:
      //   navigation.navigate(RootScreens.Order);
      //   break;
      default:
        break;
    }
  };

  const onViewDetail = (item: any) => {
    navigation.navigate(RootScreens.SecureCheckout, {
      from: RootScreens.Order,
      deliveryAdd: item?.deliveryAddress,
      billingAdd: item?.billingAddress,
      orderDetails: item,
      name: 'Order Details',
    });
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <View
        style={[
          commonStyle.marginT2,
          commonStyle.shadowContainer,
          {
            backgroundColor: colors.white,
            borderRadius: normalize(10),
            paddingVertical: hp(1.5),
          },
        ]}>
        <View style={[commonStyle.rowJB, commonStyle.paddingH4]}>
          <View>
            <FontText
              color={'black2'}
              size={smallFont}
              textAlign={'left'}
              name={'lexend-regular'}>
              {item?.orderId}
            </FontText>
            <FontText
              color={'black2'}
              size={smallFont}
              textAlign={'left'}
              name={'lexend-regular'}>
              {item?.companyId?.companyName}
            </FontText>
          </View>
          <View>
            <FontText
              color={'gray'}
              size={smallFont}
              textAlign={'left'}
              name={'lexend-regular'}>
              {moment(item?.orderDate).format('DD-MM-YYYY')}
            </FontText>
            <FontText
              color={'orange'}
              size={smallFont}
              textAlign={'right'}
              name={'lexend-medium'}>
              {'₹'}
              {item?.totalAmount?.toFixed(2)}
            </FontText>
          </View>
        </View>
        <View style={[styles.dashedLine]} />
        <View style={[{marginTop: hp(1), paddingHorizontal: wp(2)}]}>
          <AddressComponent
            item={item?.deliveryAddress}
            from={RootScreens.SecureCheckout}
          />
        </View>
        <View style={[styles.dashedLine]} />
        <View
          style={[commonStyle.rowJB, styles.paddingT1, commonStyle.paddingH4]}>
          <FontText
            color={
              item?.status === 'pending' || item?.status === 'cancelled'
                ? 'red'
                : item?.status === 'delivered'
                ? 'green'
                : item?.status === 'processing'
                ? 'yellow'
                : 'black'
            }
            size={smallFont}
            textAlign={'left'}
            name={'lexend-medium'}>
            {item?.status}
          </FontText>
          <TouchableOpacity onPress={() => onViewDetail(item)}>
            <FontText
              color={'orange'}
              size={smallFont}
              textAlign={'left'}
              style={{textDecorationLine: 'underline'}}
              name={'lexend-medium'}>
              {'View detail'}
            </FontText>
          </TouchableOpacity>
        </View>
      </View>
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
    if (!error && data?.statusCode === 200) {
      setCode('');
      utils.showSuccessToast(data.message);
    } else {
      setCode('');
      utils.showErrorToast(data?.message ? data?.message : error?.message);
    }
  };

  const onRefreshing = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  return (
    <View style={commonStyle.container}>
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
      <Loader loading={isProcessing || isProcess || isFetch || isNotiFetch} />
      {/* <Modal transparent={true} animationType={'none'} visible={isOpenPopup}>
        <CompanyDetail setOpenPopup={setOpenPopup} from={from} />
      </Modal> */}
      {orderData && orderData.length === 0 ? (
        <View style={[commonStyle.allCenter, {flex: 1}]}>
          <FontText
            color="gray"
            name="lexend-regular"
            size={mediumFont}
            textAlign={'center'}>
            {'No pending orders are available.'}
          </FontText>
        </View>
      ) : (
        <FlatList
          data={orderData}
          renderItem={_renderItem}
          contentContainerStyle={{
            paddingHorizontal: wp(4),
            paddingBottom: hp(2),
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />
          }
        />
      )}
      {/* <Button
          bgColor={'orange'}
          style={styles.buttonContainer}
          onPress={onAddCodePress}>
          <FontText name={'lexend-semibold'} size={fontSize} color={'white'}>
            {'Add your Supplier'}
          </FontText>
        </Button> */}
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
            blurOnSubmit
          />
        }
        disabled={code !== '' ? false : true}
        rightBtnText={'Apply'}
        rightBtnColor={code !== '' ? 'orange' : 'gray'}
        rightBtnPress={applyCodePress}
        rightBtnStyle={{width: '100%'}}
      />
      <FloatingAction
        actions={actions}
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
      />
      {/* <TouchableOpacity
        onPress={() => navigation.navigate(RootScreens.Cart)}
        style={styles.floatingButton}>
        <SvgIcons.Buy width={wp(8.5)} height={wp(8.5)} fill={colors.white} />
        {carts && carts?.result && carts?.result?.cart?.length ? (
          <View style={[styles.cartCount]}>
            <FontText
              color="orange"
              name="lexend-medium"
              size={smallFont}
              textAlign={'center'}>
              {carts?.result?.cart?.length}
            </FontText>
          </View>
        ) : null}
      </TouchableOpacity> */}
    </View>
  );
};

export default withInAppNotification(HomeScreen);
// export default HomeScreen;

const styles = StyleSheet.create({
  avatar: {
    width: hp(5),
    height: hp(5),
    // backgroundColor: colors.white2,
    borderRadius: 10,
    // marginRight: wp(3),
  },
  inputText: {
    borderRadius: 10,
    paddingLeft: wp(3),
    color: colors.black2,
    fontSize: normalize(14),
    fontFamily: 'Lexend-Regular',
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
  itemContainer: {
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: colors.white,
    borderRadius: normalize(6),
    marginBottom: hp(2),
    width: '48%',
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
    backgroundColor: colors.orange,
    borderRadius: wp(10),
    position: 'absolute',
    left: wp(3.5),
    top: wp(0.2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCount: {
    width: wp(5),
    height: wp(5),
    backgroundColor: colors.white,
    borderRadius: wp(10),
    position: 'absolute',
    right: wp(3),
    top: wp(3.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    borderRadius: normalize(6),
    marginHorizontal: wp(6),
    marginTop: hp(3),
  },
  floatingButton: {
    width: hp(8),
    height: hp(8),
    borderRadius: hp(4),
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: wp(7),
    right: wp(5),
  },
  dashedLine: {
    marginTop: wp(1.5),
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'dashed',
  },
  paddingT1: {
    paddingTop: hp(1.5),
  },
});
