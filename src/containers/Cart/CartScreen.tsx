import {
  BackHandler,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import commonStyle, {
  fontSize,
  iconSize,
  mediumFont,
  mediumLarge1Font,
  mediumLargeFont,
  smallest,
  smallFont,
  tabIcon,
} from '../../styles';
import {
  FontText,
  Popup,
  CartCountModule,
  NavigationBar,
  CountNumberModule,
  Modal,
} from '../../components';
import {colors, SvgIcons, Images, fonts} from '../../assets';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import {
  calculateTotalPrice,
  decrementCartItem,
  getCartItems,
  incrementCartItem,
  removeCartItem,
} from './Carthelper';
import {useFocusEffect} from '@react-navigation/native';
import utils from '../../helper/utils';

const CartScreen = ({navigation, route}: any) => {
  const [cartData, setCartData] = useState<any>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState(
    route?.params?.notes ? route?.params?.notes : '',
  );
  const [date, setDate] = useState(
    route?.params?.expectedDate ? route?.params?.expectedDate : new Date(),
  );
  const cartType = route?.params?.cartType;
  const orderDetails = route?.params?.orderDetails;
  const deliveryAdd = route?.params?.deliveryAdd;
  const billingAdd = route?.params?.billingAdd;
  const nav = route?.params?.nav;

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
            onPress={() => navigation.goBack()}>
            <SvgIcons.Back_Arrow width={iconSize} height={iconSize} />
          </TouchableOpacity>
          <FontText
            name={'mont-semibold'}
            size={mediumLargeFont}
            color={'white'}>
            Cart
          </FontText>
        </View>
      ),
    });
  }, [navigation, cartItems]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  const backAction = () => {
    navigation.goBack();
    return true;
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={[commonStyle.rowAC, {marginRight: wp(3)}]}>
          {cartType === 'updateOrder' ? (
            <TouchableOpacity
              style={[{marginRight: wp(1)}]}
              onPress={() =>
                navigation.navigate(RootScreens.ProductListing, {
                  id: orderDetails?.company?.id,
                  company: orderDetails?.company?.companyName,
                  cartType: cartType,
                  deliveryAdd: deliveryAdd,
                  billingAdd: billingAdd,
                  orderDetails: orderDetails,
                  notes: notes,
                  expectedDate: date,
                  nav: nav,
                })
              }>
              <FontText
                name={'mont-medium'}
                size={mediumFont}
                color={'black2'}
                textAlign={'left'}>
                {'ADD'}
              </FontText>
            </TouchableOpacity>
          ) : null}
        </View>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const fetchCartItems = async () => {
      let items: any;
      if (cartType && cartType === 'updateOrder') {
        items = await getCartItems('updateOrder');
      } else {
        items = await getCartItems();
      }
      // const items = await getCartItems();
      setCartData(items);
      const price = await calculateTotalPrice(cartType);
      setTotalPrice(price);
    };
    fetchCartItems();
  }, [cartData]);

  const placeOrderPress = () => {
    if (cartType === 'updateOrder') {
      navigation.navigate(RootScreens.SecureCheckout, {
        from: RootScreens.Cart,
        name: 'Update Order',
        expectedDate: date,
        notes: notes,
        cartType: 'updateOrder',
        deliveryAdd: deliveryAdd,
        billingAdd: billingAdd,
        orderDetails: orderDetails,
        nav: nav,
        onGoBackCart: (paramCart: any) => {
          setNotes(paramCart?.notes);
          setDate(paramCart?.expectedDate);
        },
      });
    } else {
      navigation.navigate(RootScreens.SecureCheckout, {
        from: RootScreens.Cart,
        name: 'Place Order',
        expectedDate: date,
        notes: notes,
        onGoBackCart: (paramCart: any) => {
          setNotes(paramCart?.notes);
          setDate(paramCart?.expectedDate);
        },
      });
    }
  };

  const handleIncrement = async (cartId: any) => {
    const data = await incrementCartItem(cartId, cartType);
    setCartData(data);
  };

  const handleDecrement = async (cartId: any) => {
    const data = await decrementCartItem(cartId, 'Cart', cartType);
    setCartData(data);
  };

  const handleRemoveItem = async (cartId: any) => {
    const data = await removeCartItem(cartId, cartType);
    setCartData(data);
    setIsOpen(false);
  };


  const _renderItem = ({item, index}: any) => {
    return (
      <View style={[styles.itemContainer]}>
        <View style={[commonStyle.rowAC, commonStyle.flex]}>
          <View
            style={{
              borderWidth: 0,
              borderRadius: normalize(8),
              backgroundColor: colors.orange3,
              padding: item?.product?.image ? null : '3%',
            }}>
            {item?.product?.image ? (
              <Image source={{uri: item?.product?.image}} style={styles.logo} />
            ) : (
              <Image
                source={Images._productImg}
                style={[styles.logo, {width: hp(5), height: hp(5)}]}
              />
            )}
          </View>
          <View style={{marginLeft: wp(4), width: '66%'}}>
            <FontText
              name={'mont-semibold'}
              size={smallFont}
              color={'black2'}
              textAlign={'left'}>
              {item?.product?.productName}
            </FontText>
            {item?.product?.minOrderQuantity == 0 &&
            item?.product?.maxOrderQuantity == 0 ? null : (
              <FontText
                name={'mont-medium'}
                size={smallest}
                color={'gray4'}
                textAlign={'left'}>
                {`Range : ${item?.product?.minOrderQuantity} - ${item?.product?.maxOrderQuantity}`}
              </FontText>
            )}
            <FontText
              name={'mont-bold'}
              size={smallFont}
              color={'orange'}
              pTop={wp(1)}
              pBottom={wp(1)}
              textAlign={'left'}>
              {'₹'}
              {item?.price}
              {item?.product?.unit && `${'/'}${item?.product?.unit}`}
            </FontText>
          </View>
        </View>
        <View>
          {/* <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              paddingTop: hp(1),
              paddingLeft: wp(5),
            }}
            onPress={() => {
              setIsOpen(true);
              setSelectedItem(item.id);
              // handleRemoveItem(item.id);
            }}>
            <SvgIcons.Trash width={wp(4)} height={wp(4)} />
          </TouchableOpacity> */}
          {/* <View
            style={[commonStyle.rowAC, styles.countContainer, {width: wp(25)}]}>
            <TouchableOpacity
              style={{flex: 0.3}}
              onPress={() => handleDecrement(item?.id)}>
              <View style={[styles.iconContainer]}>
                <SvgIcons.Remove width={wp(4)} height={wp(4)} />
              </View>
            </TouchableOpacity>
            <FontText
              color="white"
              name="lexend-medium"
              size={mediumFont}
              style={{flex: 0.45}}
              textAlign={'center'}>
              {item.quantity}
            </FontText>
            <TouchableOpacity
              style={{flex: 0.3, alignItems: 'flex-end'}}
              onPress={() => handleIncrement(item?.id)}>
              <View style={[styles.iconContainer]}>
                <SvgIcons.Plus
                  width={wp(4)}
                  height={wp(4)}
                  fill={colors.orange}
                />
              </View>
            </TouchableOpacity>
          </View> */}
          <View>
            <CountNumberModule
              from={'cart'}
              cartItems={item}
              handleDecrement={handleDecrement}
              handleIncrement={handleIncrement}
              productDetail={item}
            />
            <TouchableOpacity
              style={{
                padding: wp(2),
                alignSelf: 'flex-end',
                backgroundColor: colors.red3,
                borderRadius: normalize(100),
                justifyContent: 'center',
              }}
              onPress={() => {
                setIsOpen(true);
                setSelectedItem(item.id);
                // handleRemoveItem(item.id);
              }}>
              <SvgIcons._Trash width={wp(4)} height={wp(4)} />
            </TouchableOpacity>
          </View>
          {/* <CountNumberModule from={'cart'} cartItems={item} handleDecrement={handleDecrement} handleIncrement={handleIncrement} productDetail={item} /> */}
        </View>
      </View>
    );
  };
  const cancelOrder = async () => {
    setIsOpen(false);
    const {data, error}: any = await cancelOrder(orderDetails.id);
    if (!error && data?.statusCode === 200) {
      utils.showSuccessToast('Order Cancel Successfully.');
      navigation.goBack();
    } else {
      utils.showErrorToast(
        data?.message ? data?.message : error?.data?.message,
      );
    }
  };

  return (
    <View style={[commonStyle.container, {paddingTop: hp(1.5)}]}>
      {/* <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2)}}
        borderBottomWidth={0}
        leftStyle={{width: '100%'}}
        left={
          <View style={[commonStyle.rowAC]}>
            <TouchableOpacity
              style={[commonStyle.iconView, {marginRight: wp(5)}]}
              onPress={() => navigation.goBack()}>
              <SvgIcons.BackArrow width={tabIcon} height={tabIcon} />
            </TouchableOpacity>
            <FontText
              name={'lexend-semibold'}
              size={mediumLargeFont}
              color={'black'}
              textAlign={'left'}>
              {'Shopping Cart'}
            </FontText>
          </View>
        }
      /> */}
      <View style={commonStyle.flex}>
        {cartData && cartData?.length !== 0 ? (
          <FlatList
            data={cartData}
            renderItem={_renderItem}
            contentContainerStyle={styles.product2CC}
          />
        ) : (
          <View style={styles.emptyCart}>
            <SvgIcons.EmptyCart width={wp(40)} height={wp(40)} />
            <FontText
              color="black2"
              name="mont-semibold"
              size={mediumLarge1Font}
              pTop={wp(4)}
              pBottom={wp(2.5)}
              textAlign={'center'}>
              {'Your cart is Empty!'}
            </FontText>
            <FontText
              color="gray"
              name="mont-medium"
              size={fontSize}
              textAlign={'center'}>
              {`Looks like you haven’t added\n anything to your cart yet`}
            </FontText>
          </View>
        )}
        <CartCountModule
          btnText={'Checkout'}
          btnColor={'orange'}
          cartData={cartData}
          onPress={placeOrderPress}
          isShow={true}
          total={totalPrice.toFixed(2)}
        />
      </View>
      <Modal
        visible={isOpen}
        onBackPress={() => setIsOpen(false)}
        description={`Are you sure you want to Cancel\nthis item?`}
        title={' '}
        titleStyle={{ fontSize: normalize(14) }}
        leftBtnText={'No, don’t cancel'}
        rightBtnText={'Yes, cancel'}
        leftBtnPress={() => setIsOpen(false)}
        rightBtnPress={() => handleRemoveItem(selectedItem)}
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
        style={{ paddingHorizontal: wp(4), paddingVertical: wp(5) }}
      />
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  product2CC: {
    paddingTop: hp(0.5),
    paddingHorizontal: wp(4),
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    backgroundColor: colors.white,
    borderRadius: normalize(15),
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.orange,
    marginBottom: hp(1.5),
    width: '100%',
  },
  logo: {
    resizeMode: 'cover',
    borderRadius: normalize(6),
    width: hp(6.5),
    height: hp(6.5),
  },
  iconContainer: {
    width: hp(2.5),
    height: hp(2.5),
    borderRadius: normalize(3),
    backgroundColor: colors.white2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    backgroundColor: colors.orange,
    borderRadius: normalize(4),
    justifyContent: 'space-between',
    padding: hp(0.6),
    marginTop: hp(1),
  },
});
