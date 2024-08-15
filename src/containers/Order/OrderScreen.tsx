import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import {
  NavigationBar,
  FontText,
  Loader,
  PendingOrderComponent,
  TabBar_,
} from '../../components';
import commonStyle, {
  iconSize,
  mediumFont,
  mediumLargeFont,
  smallFont,
  tabIcon,
} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {ORDERTYPE} from '../../helper/data';
import colors from '../../assets/colors';
import {useGetOrdersQuery} from '../../api/order';
import {RootScreens} from '../../types/type';
import AddressComponent from '../../components/AddressComponent';
import {SvgIcons} from '../../assets';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import { getCartItems } from '../Cart/Carthelper';

const OrderScreen = ({navigation, route}: any) => {
  const selectedType = route?.params?.type;
  const flatListRef: any = useRef(null);
  const [selectOrder, setSelectOrder] = useState<any>({});
  const [orderData, setOrderData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [cartItems, setCartItems] = useState<any>([]);


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
            Order
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
  }, [navigation,cartItems]);

  const {
    data: orderList,
    isFetching: isProcess,
    refetch,
  } = useGetOrdersQuery(
    {
      isBuyerOrder: true,
      status: selectOrder?.value === 'all' ? '' : selectOrder?.value,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  useFocusEffect(
    useCallback(() => {
      flatListRef.current.scrollToIndex({animated: true, index: 0});
      if (selectedType !== undefined) {
        setSelectOrder(selectedType);
      } else {
        setSelectOrder({
          label: 'All',
          value: 'all',
        });
      }
    }, [selectedType]),
  );

  useEffect(() => {
    setOrderData(orderList?.result?.data);
  }, [isProcess, selectOrder]);

  const onRefreshing = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  // const onViewDetail = (item: any) => {
  //   navigation.navigate(RootScreens.SecureCheckout, {
  //     from: RootScreens.Order,
  //     deliveryAdd: item?.deliveryAddress,
  //     billingAdd: item?.billingAddress,
  //     orderDetails: item,
  //     notes: item?.notes,
  //     name: 'Order Details',
  //     nav: 'Order',
  //   });
  // };

  const _renderItem = ({item, index}: any) => {
    return <PendingOrderComponent item={item} navigation={navigation} />;
  };

  // const FirstRoute = () => (
  //   <View style={{flex: 1, backgroundColor: '#ff4081'}} />
  // );

  // const SecondRoute = () => (
  //   <View style={{flex: 1, backgroundColor: '#673ab7'}} />
  // );

  // const renderScene = SceneMap({
  //   All: FirstRoute,
  //   Pending: SecondRoute,
  //   Inprocess: FirstRoute,
  //   PartialDelivered: SecondRoute,
  //   Delivered: FirstRoute,
  //   Cancelled: SecondRoute,
  // });

  // const layout = useWindowDimensions();

  // const [index, setIndex] = React.useState(0);
  // const [routes] = React.useState([
  //   {key: 'All', title: `All (${orderList?.result?.data?.length})`},
  //   {key: 'Pending', title: 'Pending'},
  //   {key: 'Inprocess', title: 'In process'},
  //   {key: 'PartialDelivered', title: 'Partial Delivered'},
  //   {key: 'Delivered', title: 'Delivered'},
  //   {key: 'Cancelled', title: 'Cancelled'},
  // ]);

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
            {'Order'}
          </FontText>
        }
      /> */}
      <Loader loading={isProcess} />
      <View style={{
    marginBottom:wp(4)}}>
        <FlatList
        style={{borderWidth:0}}
          horizontal
          ref={flatListRef}
          data={ORDERTYPE}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{marginHorizontal: wp(-1), paddingTop: hp(1)}}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectOrder(item);
                  // getorderData(item);
                }}
                key={index}
                activeOpacity={0.7}
                style={styles.talkBubble}>
                <View
                  style={
                    selectOrder?.label === item?.label
                      ? styles.talkBubbleSquare
                      : styles.blankSquare
                  }>
                  <FontText
                    color={
                      selectOrder?.label === item?.label ? 'orange' : 'tabGray'
                    }
                    size={mediumFont}
                    textAlign={'center'}
                    name={'mont-semibold'}>
                    {item?.label}{' '}
                    {selectOrder?.label === item?.label
                      ? orderList?.result?.data?.length === undefined ||
                        orderList?.result?.data?.length === 0
                        ? ''
                        : `(${orderList?.result?.data?.length})`
                      : ''}
                  </FontText>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      {/* <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={props => (
            <TabBar_
              props={props}
              style={{backgroundColor: colors.white, width: wp(170),borderWidth:1}}
              indicatorStyle={{backgroundColor: colors.orange}}
            />
        )}
      /> */}

      {orderData && orderData.length === 0 ? (
        <View style={[commonStyle.allCenter, {flex: 1}]}>
          <FontText
            color="gray"
            name="mont-medium"
            size={mediumFont}
            textAlign={'center'}>
            {`${
              selectOrder?.label === 'All' ? '' : selectOrder?.label
            } Orders are not available.`}
            {/* {'There are no orders at the moment.'} */}
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
            <RefreshControl onRefresh={onRefreshing} refreshing={refreshing} />
          }
        />
      )}
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  talkBubble: {
    backgroundColor: 'transparent',
  },
  talkBubbleSquare: {
    paddingHorizontal: wp(4),
    paddingVertical: wp(3),
    backgroundColor: colors.white,
    borderBottomColor:colors.orange,
    borderBottomWidth:2,
  },
  blankSquare: {
    paddingHorizontal: wp(4),
    paddingVertical: wp(3),
    borderBottomWidth:2,
    borderBottomColor:colors.tabGray1
  },
  dashedLine: {
    marginTop: wp(1.5),
    borderWidth: 1,
    borderBottomColor:colors.orange,
    borderStyle: 'dashed',
  },
  paddingT1: {
    paddingTop: hp(1.5),
  },
});
