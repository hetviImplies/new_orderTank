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
  fontSize,
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
import {fonts, SvgIcons} from '../../assets';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import { getCartItems } from '../Cart/Carthelper';
import { Dropdown } from 'react-native-element-dropdown';

const OrderScreen = ({navigation, route}: any) => {
  const selectedType = route?.params?.type;
  const flatListRef: any = useRef(null);
  const [selectOrder, setSelectOrder] = useState<any>({"_index": 0, "label": "All", "value": "all"});
  const [orderData, setOrderData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [cartItems, setCartItems] = useState<any>([]);
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

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

  // useFocusEffect(
  //   useCallback(() => {
  //     flatListRef.current.scrollToIndex({animated: true, index: 0});
  //     if (selectedType !== undefined) {
  //       setSelectOrder(selectedType);
  //     } else {
  //       setSelectOrder({
  //         label: 'All',
  //         value: 'all',
  //       });
  //     }
  //   }, [selectedType]),
  // );

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

      {/* ************************************** DropDown ************************************** */}
      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingHorizontal:wp(3),marginTop:hp(2)}}>
      <FontText
            name={'mont-semibold'}
            size={fontSize}
            color={'black2'}
            textAlign={'center'}>
            {selectOrder?.label}{' '}({orderList?.result?.data?.length})
          </FontText>
      <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: colors.lightGray }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={ORDERTYPE}
          // search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'All' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setSelectOrder(item);
            setIsFocus(false);
          }}
        />
        </View>
        {/* ************************************** Tabs ************************************** */}
        {/* <FlatList
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
        /> */}
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
  },container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: hp(5.5),
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: normalize(100),
    paddingHorizontal: wp(3),
    width:wp(45)
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: smallFont,
    color:colors.darkGray,
    fontStyle:fonts["mont-medium"]
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
