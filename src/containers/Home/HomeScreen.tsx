import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SvgIcons from '../../assets/SvgIcons';
import {FontText, Button, NavigationBar, Input} from '../../components';
import {fontSize, mediumFont, smallFont, tabIcon} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import {RootScreens} from '../../types/type';
import commonStyle from '../../styles';
import {HISTORY_LIST} from '../../types/data';
import messaging from '@react-native-firebase/messaging';
import Popup from '../../components/Popup';
import {useSelector} from 'react-redux';
import CompanyDetail from '../../components/CompanyDetail';
import utils from '../../helper/utils';
import Images from '../../assets/images';
import {useCompanyRequestMutation} from '../../api/company';
import {FloatingAction} from 'react-native-floating-action';
import {useGetOrdersQuery} from '../../api/order';
import moment from 'moment';
import AddressComponent from '../../components/AddressComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { withInAppNotification } from '../../components/Common/InAppNotification';


const actions = [
  {
    text: 'Add Supplier',
    icon: <SvgIcons.AddSupplier width={tabIcon} height={tabIcon} />,
    name: 'bt_supplier',
    color: '#EEEEEE',
    position: 2,
    buttonSize: hp(5.5),
    textBackground: colors.orange,
    textColor: 'white'
  },
  {
    text: 'Add Order',
    icon: <SvgIcons.AddOrder width={tabIcon} height={tabIcon} />,
    name: 'bt_order',
    color: '#EEEEEE',
    position: 1,
    buttonSize: hp(5.5),
    textBackground: colors.orange,
    textColor: 'white'
  },
];

const HomeScreen = ({navigation, showNotification}: any) => {
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const from = useSelector((state: any) => state.auth.from);
  const [sendCompanyReq, {isLoading: isProcess}] = useCompanyRequestMutation();

  const isGuest =
    (userInfo && Object.keys(userInfo).length === 0) || userInfo === undefined;

  const [notification, setNotification] = useState<any>({});
  const [isOpenPopup, setOpenPopup] = useState<boolean>(
    userInfo?.companyCode ? false : true,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');
  const [orderData, setOrderData] = React.useState([]);

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

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <View
          style={[commonStyle.rowAC, {marginLeft: wp(4), paddingBottom: hp(1)}]}>
          {userInfo && userInfo?.companyId?.logo ? (
            <Image
              source={{uri: userInfo?.companyId?.logo}}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatar} />
          )}
        </View>
      ),
      headerRight: () => (
        <View style={[commonStyle.row, {marginRight: wp(4)}]}>
          <TouchableOpacity
            // style={commonStyle.iconView}
            onPress={() => navigation.navigate(RootScreens.Notification)}>
            <SvgIcons.Bell width={tabIcon} height={tabIcon} />
            {Object.keys(notification).length !== 0 &&
              !notification?.isRead && <View style={styles.countView} />}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    setOpenPopup(userInfo?.companyCode ? false : true);
  }, [userInfo]);

  useEffect(() => {
    setOrderData(orderList?.result);
  }, [isProcessing]);

useEffect(() => {
  console.log('orderData',JSON.stringify(orderData))
    getNotification();
  }, []);

  const getNotification = async () => {
    const notificationToken = await AsyncStorage.getItem('NotiToken');
    console.log("home notitoken.......", notificationToken)
    const onMessageListener = messaging().onMessage(async remoteMessage => {
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
              color={'gray'}
              size={smallFont}
              textAlign={'left'}
              name={'lexend-regular'}>
              {moment(item?.orderDate).format('DD-MM-YYYY')}
            </FontText>
          </View>
          <FontText
            color={'orange'}
            size={smallFont}
            textAlign={'right'}
            name={'lexend-medium'}>
            {'$'}
            {item?.totalAmount}
          </FontText>
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
    let params = {
      companyCode: code,
    };
    const {data, error}: any = await sendCompanyReq(params);
    if (!error) {
      setIsOpen(false);
      setCode('');
      utils.showSuccessToast(data.message);
    } else {
      setIsOpen(false);
      setCode('');
      utils.showErrorToast(error.message);
    }
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
      <Modal transparent={true} animationType={'none'} visible={isOpenPopup}>
        <CompanyDetail setOpenPopup={setOpenPopup} from={from} />
      </Modal>
      {orderData && orderData.length !== 0 ? (
        <FlatList
          data={orderData}
          renderItem={_renderItem}
          contentContainerStyle={{
            paddingHorizontal: wp(4),
            paddingBottom: hp(2),
          }}
        />
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
            onChangeText={(text: string) => setCode(text)}
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
            navigation.navigate(RootScreens.Order);
          }
        }}
        showBackground={true}
        color={colors.orange}
        buttonSize={hp(7)}
        iconHeight={hp(2.2)}
        iconWidth={hp(2.2)}
        shadow={{ shadowOpacity: 0.35, shadowOffset: { width: 0, height: 5 }, shadowColor: "trasparent", shadowRadius: 3 }}
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
    backgroundColor: colors.gray,
    borderRadius: 10,
    marginRight: wp(3),
  },
  inputText: {
    borderRadius: 10,
    paddingLeft: wp(3),
    color: colors.black2,
    fontSize: normalize(14),
    fontFamily: 'lexend-regular',
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
    width: wp(2.5),
    height: wp(2.5),
    backgroundColor: colors.orange,
    borderRadius: wp(10),
    position: 'absolute',
    right: wp(3.2),
    top: wp(2.5),
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
