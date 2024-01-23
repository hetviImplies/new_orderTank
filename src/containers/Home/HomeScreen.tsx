import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import {FloatingAction} from 'react-native-floating-action';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {colors, SvgIcons, Images} from '../../assets';
import {
  FontText,
  Input,
  Loader,
  Popup,
  AddressComponent,
  ListHeader,
  Button,
} from '../../components';
import commonStyle, {
  fontSize,
  mediumFont,
  smallFont,
  tabIcon,
} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import utils from '../../helper/utils';
import {
  useCompanyRequestMutation,
  useGetCompanyQuery,
  useGetSupplierQuery,
} from '../../api/company';
import {useGetOrdersQuery} from '../../api/order';
import {withInAppNotification} from '../../components/Common/InAppNotification';
import {setCurrentUser} from '../../redux/slices/authSlice';
import {useGetCurrentUserQuery} from '../../api/auth';
import {mergeArrays, updateAddressList} from '../Cart/Carthelper';
import {useGetNotificationQuery} from '../../api/notification';
import {FLOATING_BTN_ACTION} from '../../helper/data';

const HomeScreen = ({navigation, route, showNotification}: any) => {
  const dispatch = useDispatch();
  const loginData = route?.params?.data;
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const companyId = useSelector((state: any) => state.auth.companyId);
  const [sendCompanyReq, {isLoading: isProcess}] = useCompanyRequestMutation();
  const {
    data,
    isFetching,
    refetch: compRefetch,
  } = useGetCompanyQuery(
    userInfo?.companyId?._id ||
      userInfo?.companyId ||
      loginData?.companyId?._id,
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
  const {data: userData, isFetching: isFetch} = useGetCurrentUserQuery(null, {
    refetchOnMountOrArgChange: true,
  });
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
  const {
    data: supplierList,
    isFetching: isReqProcessing,
    refetch: reqRefetch,
  } = useGetSupplierQuery(
    {status: 'pending'},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [notification, setNotification] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [orderData, setOrderData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      refetch();
      notiRefetch();
      compRefetch();
      reqRefetch();
    }, [refetch]),
  );

  useFocusEffect(
    React.useCallback(() => {
      if (notificationData?.result?.length !== 0) {
        const data = notificationData?.result?.find(
          (item: any) => item.seen === false,
        );
        setNotification(data === undefined ? {} : data);
      }
    }, [notificationData, isNotiFetch]),
  );

  useEffect(() => {
    dispatch(setCurrentUser(userData?.result));
  }, [isFetch]);

  useEffect(() => {
    async function getAddressData() {
      const mergedArray = await mergeArrays(data?.result?.address);
      console.log('mergedArray', mergedArray);
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
      headerLeft: () => (
        <View style={[commonStyle.rowAC, {marginLeft: wp(4)}]}>
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
        </View>
      ),
      headerRight: () => (
        <View style={[commonStyle.row, {marginRight: wp(4)}]}>
          <TouchableOpacity
            // style={commonStyle.iconView}
            onPress={() => navigation.navigate(RootScreens.Notification)}>
            <SvgIcons.Bell width={tabIcon} height={tabIcon} />
            {Object.keys(notification)?.length !== 0 &&
              notification?.seen === false && <View style={styles.countView} />}
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
  ]);

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

  const onViewDetail = (item: any) => {
    navigation.navigate(RootScreens.SecureCheckout, {
      from: RootScreens.Order,
      deliveryAdd: item?.deliveryAddress,
      billingAdd: item?.billingAddress,
      orderDetails: item,
      notes: item?.notes,
      name: 'Order Details',
    });
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <View
        style={[
          commonStyle.shadowContainer,
          {
            backgroundColor: colors.white,
            borderRadius: normalize(10),
            paddingVertical: hp(1.5),
            marginBottom: hp(1.5),
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
              item?.status === 'pending'
                ? 'gray3'
                : item?.status === 'cancelled'
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

  const _reqRenderItem = ({item, index}: any) => {
    return (
      <View style={[styles.itemContainer, commonStyle.shadowContainer]}>
        <View style={commonStyle.rowAC}>
          {item?.logo ? (
            <Image source={{uri: item?.logo}} style={styles.logo} />
          ) : (
            <Image source={Images.supplierImg} style={styles.logo} />
          )}
          <View>
            <FontText
              name={'lexend-regular'}
              size={fontSize}
              color={'black'}
              textAlign={'left'}>
              {item?.companyName}
            </FontText>
            <FontText
              name={'lexend-regular'}
              size={smallFont}
              color={'gray'}
              pTop={wp(2)}
              textAlign={'left'}>
              {item?.companyCode}
            </FontText>
          </View>
        </View>
        <Button disabled bgColor={'green'} style={styles.buttonContainer}>
          <FontText name={'lexend-regular'} size={smallFont} color={'white'}>
            {'Pending'}
          </FontText>
        </Button>
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

  console.log(
    'supplierList?.result?.length',
    supplierList?.result?.length,
    orderData?.length !== 0,
  );

  return (
    <>
      <ScrollView
        style={commonStyle.container}
        contentContainerStyle={{flex: 1}}
        showsVerticalScrollIndicator={false}>
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
        {/* <Modal transparent={true} animationType={'none'} visible={isOpenPopup}>
        <CompanyDetail setOpenPopup={setOpenPopup} from={from} />
      </Modal> */}
        {supplierList?.result?.length !== 0 || orderData?.length !== 0 ? (
          <View style={{marginTop: hp(1)}}>
            {supplierList &&
            supplierList?.result &&
            supplierList?.result.length !== 0 ? (
              <View style={styles.listContainer}>
                <ListHeader
                  leftName={'Pending Requests'}
                  rightName={'See all'}
                  rightPress={() => {
                    navigation.navigate(RootScreens.PendingRequest);
                  }}
                />
                <FlatList
                  data={supplierList?.result}
                  renderItem={_reqRenderItem}
                  contentContainerStyle={styles.containerContent}
                />
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
                <FlatList
                  data={orderData && orderData.slice(0, 2)}
                  renderItem={_renderItem}
                  contentContainerStyle={styles.product2CC}
                />
              </View>
            ) : null}
          </View>
        ) : (
          <View style={[commonStyle.allCenter, {flex: 1}]}>
            <FontText
              color="gray"
              name="lexend-regular"
              size={mediumFont}
              textAlign={'center'}>
              {'No Data found.'}
            </FontText>
          </View>
        )}
        {/* {orderData && orderData.length === 0 ? (
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
      )} */}
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
      </ScrollView>
      <FloatingAction
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
      />
    </>
  );
};

export default withInAppNotification(HomeScreen);
// export default HomeScreen;

const styles = StyleSheet.create({
  avatar: {
    width: hp(5),
    height: hp(5),
    borderRadius: 10,
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
  dashedLine: {
    marginTop: wp(1),
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'dashed',
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
    backgroundColor: colors.white,
    borderRadius: normalize(6),
    marginBottom: hp(1.5),
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
    borderRadius: normalize(10),
    height: hp(3.5),
    width: '25%',
  },
  containerContent: {
    paddingTop: hp(0.5),
    paddingHorizontal: wp(4),
    marginTop: hp(1),
  },
});
