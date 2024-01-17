import {
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
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await getCartItems();
      setCartData(items);
      const price = await calculateTotalPrice();
      setTotalPrice(price);
    };
    fetchCartItems();
  }, [cartData]);

  const placeOrderPress = () => {
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
  };

  const handleIncrement = async (cartId: any) => {
    const data = await incrementCartItem(cartId);
    setCartData(data);
  };

  const handleDecrement = async (cartId: any) => {
    const data = await decrementCartItem(cartId, 'Cart');
    setCartData(data);
  };

  const handleRemoveItem = async (cartId: any) => {
    const data = await removeCartItem(cartId);
    setCartData(data);
    setIsOpen(false);
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <View style={[styles.itemContainer, commonStyle.shadowContainer]}>
        <View style={[commonStyle.rowAC, commonStyle.flex]}>
          {item?.image ? (
            <Image source={{uri: item.image}} style={styles.logo} />
          ) : (
            <Image source={Images.productImg} style={styles.logo} />
          )}
          <View style={{marginLeft: wp(4), width: '66%'}}>
            <FontText
              name={'lexend-regular'}
              size={mediumFont}
              color={'gray4'}
              // pTop={wp(2)}
              textAlign={'left'}>
              {item?.name}
            </FontText>
            <FontText
              name={'lexend-regular'}
              size={fontSize}
              color={'black2'}
              pTop={wp(2)}
              textAlign={'left'}>
              {'₹'}
              {item?.price}
            </FontText>
            <View
              style={[
                commonStyle.rowAC,
                styles.countContainer,
                {width: wp(25)},
              ]}>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  handleDecrement(item?._id);
                }}>
                <SvgIcons.Remove width={wp(4)} height={wp(4)} />
              </TouchableOpacity>
              <FontText
                color="white"
                name="lexend-medium"
                size={mediumFont}
                textAlign={'left'}>
                {item.quantity}
              </FontText>
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => {
                  handleIncrement(item?._id);
                }}>
                <SvgIcons.Plus
                  width={wp(4)}
                  height={wp(4)}
                  fill={colors.orange}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            setIsOpen(true);
            setSelectedItem(item._id);
            // handleRemoveItem(item._id);
          }}>
          <SvgIcons.Trash width={wp(4)} height={wp(4)} />
        </TouchableOpacity>
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
        leftBtnStyle={{width: '48%', borderColor: colors.blue}}
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
    marginBottom: hp(1.5),
  },
  logo: {
    width: hp(11),
    height: hp(11),
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
