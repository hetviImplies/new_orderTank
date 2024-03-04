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
  mediumFont,
  mediumLarge1Font,
} from '../../styles';
import {
  FontText,
  Popup,
  CartCountModule,
  NavigationBar,
} from '../../components';
import {colors, SvgIcons, Images} from '../../assets';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {RootScreens} from '../../types/type';
import {
  calculateTotalPrice,
  decrementCartItem,
  getCartItems,
  incrementCartItem,
  removeCartItem,
} from './Carthelper';

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
                name={'lexend-regular'}
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
      <View style={[styles.itemContainer, commonStyle.shadowContainer]}>
        <View style={[commonStyle.rowAC, commonStyle.flex]}>
          {item?.product?.image ? (
            <Image source={{uri: item?.product?.image}} style={styles.logo} />
          ) : (
            <Image source={Images.productImg} style={styles.logo} />
          )}
          <View style={{marginLeft: wp(4), width: '66%'}}>
            <FontText
              name={'lexend-regular'}
              size={mediumFont}
              color={'gray4'}
              textAlign={'left'}>
              {item?.product?.productName}
            </FontText>
            <FontText
              name={'lexend-regular'}
              size={fontSize}
              color={'black2'}
              pTop={wp(1)}
              pBottom={wp(1)}
              textAlign={'left'}>
              {'₹'}
              {item?.price}
              {item?.product?.unit && `${'/'}${item?.product?.unit}`}
            </FontText>
            {item?.product?.minOrderQuantity == 0 &&
            item?.product?.maxOrderQuantity == 0 ? null : (
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'gray4'}
                textAlign={'left'}>
                {`Range : ${item?.product?.minOrderQuantity} - ${item?.product?.maxOrderQuantity}`}
              </FontText>
            )}
          </View>
        </View>
        <View>
          <TouchableOpacity
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
          </TouchableOpacity>
          <View
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
          </View>
        </View>
      </View>
    );
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
              name="lexend-medium"
              size={mediumLarge1Font}
              pTop={wp(4)}
              pBottom={wp(2.5)}
              textAlign={'center'}>
              {'Your cart is Empty!'}
            </FontText>
            <FontText
              color="gray"
              name="lexend-regular"
              size={fontSize}
              textAlign={'center'}>
              {`Looks like you haven’t added\n anything to your cart yet`}
            </FontText>
          </View>
        )}
        <CartCountModule
          btnText={'Continue'}
          btnColor={'orange'}
          cartData={cartData}
          onPress={placeOrderPress}
          isShow={true}
          total={totalPrice.toFixed(2)}
        />
      </View>
      <Popup
        visible={isOpen}
        // onBackPress={() => setIsOpen(false)}
        title={`Are you sure you want to Cancel\nthis item?`}
        titleStyle={{fontSize: normalize(14)}}
        leftBtnText={'No, don’t cancel'}
        rightBtnText={'Yes, cancel'}
        leftBtnPress={() => setIsOpen(false)}
        rightBtnPress={() => handleRemoveItem(selectedItem)}
        onTouchPress={() => setIsOpen(false)}
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
        style={{paddingHorizontal: wp(4), paddingVertical: wp(5)}}
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
    justifyContent: 'space-between',
    padding: hp(1.5),
    backgroundColor: colors.white,
    borderRadius: normalize(10),
    marginBottom: hp(1),
  },
  logo: {
    width: hp(7),
    height: hp(7),
    resizeMode: 'cover',
    borderRadius: normalize(6),
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
