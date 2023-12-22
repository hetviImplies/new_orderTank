import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import commonStyle, {
  fontSize,
  iconSize,
  largeFont,
  mediumFont,
  mediumLarge1Font,
  mediumLargeFont,
  smallFont,
  tabIcon,
} from '../../styles';
import {Button, FontText, Input, Loader, NavigationBar} from '../../components';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import SvgIcons from '../../assets/SvgIcons';
import {BASE_URL, PROFILE_LIST} from '../../types/data';
import {
  useGetCartsQuery,
  useRemoveCartMutation,
  useUpdateCartMutation,
} from '../../api/cart';
import {RootScreens} from '../../types/type';
import {useGetCurrentUserQuery} from '../../api/auth';
import {useGetAddressQuery} from '../../api/address';
import Popup from '../../components/Popup';
import {useAddWishlistsMutation} from '../../api/wishlist';
import utils from '../../helper/utils';
import RBSheet from 'react-native-raw-bottom-sheet';

const CartScreen = ({navigation}: any) => {
  const {
    data: carts,
    isFetching,
    refetch,
  } = useGetCartsQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const {data: address, isFetching: isProcessing} = useGetAddressQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const [updateCart, {isLoading: isLoad}] = useUpdateCartMutation();
  const [removeCart, {isLoading: isFetch}] = useRemoveCartMutation();
  const [addWishlist, {isLoading}] = useAddWishlistsMutation();

  const quantityRef: any = useRef();
  const [cartData, setCartData] = useState<any>([]);
  const [couponCode, setCouponCode] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [selectedCartID, setSelectedCartID] = useState<any>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCartData(carts?.result?.cartList?.data);
  }, [carts, isFetching]);

  const placeOrderPress = () => {
    // if (
    //   address?.result &&
    //   address?.result?.data &&
    //   address?.result?.data?.length > 0
    // ) {
    //   navigation.navigate(RootScreens.OrderSummary, {
    //     addressData: address?.result?.data[0],
    //   });
    // } else {
    //   navigation.navigate(RootScreens.AddAddress);
    // }
    navigation.navigate(RootScreens.SecureCheckout)
  };

  const quantityIncrement = async (itm: any) => {
    if (itm.productId.stock > itm.quantity) {
      let data = {
        ...itm,
        quantity: itm.quantity >= 0 ? itm.quantity + 1 : 0,
      };
      setSelectedItem(data);
    } else {
      setSelectedItem(itm);
    }

    // const updatedCartItems = cartData.map((item: any, index: any) =>
    //   item.products.productId._id === itm.productId._id
    //     ? {
    //         ...item,
    //         products: {
    //           _id: item.products._id,
    //           productId: item.products.productId,
    //           quantity: item.products.quantity + 1,
    //         },
    //       }
    //     : item,
    // );

    // let body: any = {};
    // body.products = updatedCartItems.map((item: any, index: any) => {
    //   return {
    //     productId: item?.products.productId._id,
    //     quantity: item?.products.quantity,
    //   };
    // });
    // let params = {
    //   body: body,
    //   _id: itm?._id,
    // };

    // const {data, error}: any = await updateCart(params);
    // if (!error && data?.statusCode === 200) {
    //   // utils.showSuccessToast(data.message);
    // } else {
    //   // utils.showErrorToast(data.message || error);
    // }
    // setCartData(updatedCartItems);
  };

  const quantityDecrement = async (itm: any) => {
    let data = {
      ...itm,
      quantity: itm.quantity > 0 ? itm.quantity - 1 : 0,
    };
    setSelectedItem(data);
    // const updatedCartItems = cartData.map((item: any) =>
    //   item.products.productId._id === itm.productId._id &&
    //   item.products.quantity > 0
    //     ? {
    //         ...item.products,
    //         products: {
    //           _id: item.products._id,
    //           productId: item.products.productId,
    //           quantity: item.products.quantity - 1,
    //         },
    //       }
    //     : item,
    // );

    // let body: any = {};
    // body.products = updatedCartItems.map((item: any, index: any) => {
    //   return {
    //     productId: item?.products.productId._id,
    //     quantity: item?.products.quantity,
    //   };
    // });
    // let params = {
    //   body: body,
    //   _id: itm?._id,
    // };

    // const {data, error}: any = await updateCart(params);
    // if (!error && data?.statusCode === 200) {
    //   // utils.showSuccessToast(data.message);
    // } else {
    //   // utils.showErrorToast(data.message || error);
    // }

    // setCartData(updatedCartItems);
  };

  const quantityDoneHandler = async () => {
    const updatedCartItems = await cartData.map((item: any) => {
      return {
        ...item,
        products: {
          ...item.products,
          quantity:
            String(item.products.productId._id) ==
            String(selectedItem.productId._id)
              ? selectedItem.quantity
              : item.products.quantity,
        },
      };
    });
    let body: any = {};
    body.products = updatedCartItems.map((item: any, index: any) => {
      return {
        productId: item?.products.productId._id,
        quantity: item?.products.quantity,
      };
    });
    let params = {
      body: body,
      _id: selectedCartID,
    };

    const {data, error}: any = await updateCart(params);
    if (!error && data?.statusCode === 200) {
      quantityRef.current.close();
      utils.showSuccessToast(data.message);
    } else {
      utils.showErrorToast(data.message || error);
    }
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <View style={[styles.cartContainer, commonStyle.shadowContainer]}>
        <Image
          source={{uri: `${BASE_URL}/${item?.products?.productId?.thumbnail}`}}
          style={[styles.cartImage]}
        />
        <View style={styles.contentRowContainer}>
          <View style={{width: '70%'}}>
            <FontText
              color="black2"
              name="lexend-medium"
              size={mediumFont}
              pBottom={hp(1)}
              textAlign={'left'}>
              {item?.products?.productId?.productName}
            </FontText>
            <FontText
              color="brown"
              name="lexend-bold"
              size={mediumFont}
              pBottom={hp(1)}
              textAlign={'left'}>
              {'$'}
              {item?.products?.productId?.price}
            </FontText>
            <View style={commonStyle.rowAC}>
              {/* <SvgIcons.Star width={wp(4)} height={wp(4)} /> */}
              <FontText
                color="black2"
                name="lexend-medium"
                size={mediumFont}
                pLeft={wp(1)}
                textAlign={'left'}>
                {item?.products?.productId?.rating}
              </FontText>
            </View>
          </View>
          <View style={[commonStyle.colJB, {width: '30%'}]}>
            <TouchableOpacity
              onPress={() => {
                setSelectedItem(item?.products);
                setIsOpen(true);
              }}>
              <SvgIcons.Trash
                width={iconSize}
                height={iconSize}
                style={commonStyle.end}
              />
            </TouchableOpacity>
            <Button
              onPress={() => {
                setSelectedItem(item?.products);
                setSelectedCartID(item?._id);
                quantityRef.current.open();
              }}
              bgColor={'brownOpacity'}
              style={{
                height: hp(3),
                width: 'auto',
                justifyContent: 'space-between',
              }}>
              <FontText
                name={'lexend-medium'}
                size={smallFont}
                pLeft={wp(0.5)}
                // pRight={wp(2)}
                color={'brown'}>
                {`Qty ${item.products.quantity}`}
              </FontText>
              <SvgIcons.DownArrow
                height={wp(5)}
                width={wp(5)}
                fill={colors.brown}
              />
            </Button>
            {/* <View style={[commonStyle.rowJB]}>
              <TouchableOpacity
                onPress={() => {
                  quantityRef.current.open();
                  // quantityDecrement(item);
                }}>
                <SvgIcons.Remove
                  width={iconSize}
                  height={iconSize}
                  style={commonStyle.start}
                />
              </TouchableOpacity>
              <FontText
                color="black2"
                name="lexend-medium"
                size={mediumFont}
                textAlign={'left'}>
                {item.products.quantity}
              </FontText>
              <TouchableOpacity
                onPress={() => {
                  quantityRef.current.open();
                  // quantityIncrement(item);
                }}>
                <SvgIcons.Add
                  width={iconSize}
                  height={iconSize}
                  style={commonStyle.start}
                />
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </View>
    );
  };

  const removeCartItem = async () => {
    setIsOpen(false);
    const {data, error}: any = await removeCart({
      productId: selectedItem?.productId,
    });
    refetch();
  };

  const addToWishlist = async () => {
    setIsOpen(false);
    const {data, error}: any = await addWishlist({
      product: selectedItem?.productId?._id,
    });
    if (!error) {
      const {data, error: err}: any = await removeCart({
        productId: selectedItem?.productId,
      });
    }
    refetch();
  };

  return (
    <View style={commonStyle.container}>
      <NavigationBar
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
      />
      <Loader loading={isFetching || isLoad || isFetch} />

      <View style={[styles.itemContainer, commonStyle.shadowContainer]}>
        <View style={commonStyle.rowAC}>
          <Image
            source={require('../../assets/images/image.png')}
            style={styles.logo}
          />
          <View style={{marginLeft: wp(4), width: '64%'}}>
            <FontText
              name={'lexend-regular'}
              size={normalize(13)}
              color={'gray4'}
              // pTop={wp(2)}
              textAlign={'left'}>
              {'Bread spread (250 gm)'}
            </FontText>
            <FontText
              name={'lexend-regular'}
              size={fontSize}
              color={'black2'}
              pTop={wp(1.5)}
              pBottom={wp(1.5)}
              textAlign={'left'}>
              {'₹250'}
            </FontText>
            <View style={[commonStyle.rowAC, styles.countContainer]}>
              <TouchableOpacity style={styles.iconContainer}>
                <SvgIcons.Remove width={wp(3.5)} height={wp(3.5)} />
              </TouchableOpacity>
              <FontText
                name={'lexend-regular'}
                size={normalize(13)}
                color={'white'}
                // pTop={wp(2)}
                textAlign={'left'}>
                {'1'}
              </FontText>
              <TouchableOpacity style={styles.iconContainer}>
                <SvgIcons.Plus
                  width={wp(3.5)}
                  height={wp(3.5)}
                  fill={colors.orange}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.trash} onPress={() => setIsOpen(true)}>
          <SvgIcons.Trash width={wp(4)} height={wp(4)} />
        </TouchableOpacity>
      </View>
      {/* <View style={[commonStyle.paddingH4, {flex: 1}]}>
        {cartData && cartData?.length !== 0 ? (
          <View>
            <FlatList
              data={cartData}
              renderItem={_renderItem}
              contentContainerStyle={styles.product2CC}
            />
          </View>
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
            <TouchableOpacity
              onPress={() => navigation.navigate(RootScreens.Home)}>
              <FontText
                color="orange"
                name="lexend-medium"
                size={mediumLargeFont}
                pTop={wp(20)}
                pBottom={wp(2.5)}
                style={{textDecorationLine: 'underline'}}
                textAlign={'center'}>
                {'Continue Shopping'}
              </FontText>
            </TouchableOpacity>
          </View>
        )}
      </View> */}
      {/* {cartData && cartData?.length !== 0 && (
        <> */}
      <View style={[styles.totalContainer]}>
        <View style={{padding: wp(3)}}>
          <View style={[commonStyle.rowJB, {marginBottom: hp(1)}]}>
            <FontText
              color="black2"
              name="lexend-regular"
              size={mediumFont}
              textAlign={'left'}>
              {`Sub Total (${cartData?.length} items)`}
            </FontText>
            <FontText
              color="black2"
              name="lexend-regular"
              size={mediumFont}
              textAlign={'left'}>
              {`$${carts?.result?.subAmount}`}
            </FontText>
          </View>
          <View style={[commonStyle.rowJB, {marginBottom: hp(1)}]}>
            <FontText
              color="black2"
              name="lexend-regular"
              size={mediumFont}
              textAlign={'left'}>
              {'Discount'}
            </FontText>
            <FontText
              color="black2"
              name="lexend-regular"
              size={mediumFont}
              textAlign={'left'}>
              {`$${carts?.result?.totalDiscount}`}
            </FontText>
          </View>
          <View style={[commonStyle.rowJB]}>
            <FontText
              color="black2"
              name="lexend-regular"
              size={mediumFont}
              textAlign={'left'}>
              {'Shipping Charge'}
            </FontText>
            <FontText
              color="black2"
              name="lexend-regular"
              size={mediumFont}
              textAlign={'left'}>
              {`$${carts?.result?.shippingCharges}`}
            </FontText>
          </View>
        </View>
        <View style={[commonStyle.rowJB, styles.totalSubContainer]}>
          <FontText
            color="white"
            name="lexend-regular"
            size={mediumFont}
            textAlign={'left'}>
            {'Subtotal'}
          </FontText>
          <FontText
            color="white"
            name="lexend-regular"
            size={mediumFont}
            textAlign={'left'}>
            {`$${carts?.result?.grandTotal}`}
          </FontText>
        </View>
        <View style={commonStyle.flexA}>
        <Button
          onPress={placeOrderPress}
          bgColor={'orange'}
          style={[styles.buttonContainer]}>
          <FontText name={'lexend-medium'} size={fontSize} color={'white'}>
            {'Secure checkout'}
          </FontText>
        </Button>
        </View>
      </View>

      {/* </>
      )} */}
      <Popup
        visible={isOpen}
        onOpen={() => setIsOpen(true)}
        onBackPress={() => setIsOpen(false)}
        title={`Are you sure you want to Cancel\nthis item?`}
        titleStyle={{fontSize: normalize(14)}}
        leftBtnText={'No, don’t cancel'}
        rightBtnText={'Yes, cancel'}
        leftBtnPress={addToWishlist}
        rightBtnPress={removeCartItem}
        onTouchPress={() => setIsOpen(false)}
        leftBtnStyle={{width: '48%'}}
        rightBtnStyle={{backgroundColor: colors.red2, width: '48%'}}
        leftBtnTextStyle={{color: colors.blue, fontSize: mediumFont}}
        rightBtnTextStyle={{fontSize: mediumFont}}
        style={{paddingHorizontal: wp(4), paddingVertical: wp(5)}}
      />
      {/* <RBSheet
        ref={quantityRef}
        height={hp(25)}
        closeOnPressMask
        closeOnPressBack
        closeOnDragDown
        dragFromTopOnly
        customStyles={{
          container: styles.btSheetContainer,
        }}>
        <View style={styles.quantitySheet}>
          <FontText
            color="black2"
            name="lexend-medium"
            size={mediumLargeFont}
            textAlign={'left'}>
            {'Add Quantity'}
          </FontText>
          <View style={[commonStyle.rowJB, {marginTop: hp(2), width: '20%'}]}>
            <TouchableOpacity
              onPress={() => {
                quantityDecrement(selectedItem);
              }}>
              <SvgIcons.Remove width={wp(10)} height={wp(10)} />
            </TouchableOpacity>
            <FontText
              color="black2"
              name="lexend-medium"
              size={fontSize}
              pLeft={wp(5)}
              pRight={wp(5)}
              textAlign={'left'}>
              {selectedItem.quantity}
            </FontText>
            <TouchableOpacity
              onPress={() => {
                quantityIncrement(selectedItem);
              }}>
              <SvgIcons.Plus width={wp(10)} height={wp(10)} />
            </TouchableOpacity>
          </View>
          <Button
            onPress={quantityDoneHandler}
            bgColor={'brown'}
            style={[styles.buttonContainer, {width: '100%'}]}>
            <FontText name={'lexend-medium'} size={fontSize} color={'white'}>
              {'Done'}
            </FontText>
          </Button>
        </View>
      </RBSheet> */}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  contentRowContainer: {
    marginLeft: wp(4),
    flexDirection: 'row',
    width: '68%',
    justifyContent: 'space-between',
  },
  product2CC: {
    paddingTop: hp(0.5),
    paddingHorizontal: wp(0.5),
  },
  cartImage: {
    width: hp(10),
    height: hp(10),
    resizeMode: 'contain',
  },
  cartContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
    marginBottom: hp(1.5),
    borderRadius: 12,
  },
  inputText: {
    paddingLeft: wp(3),
    color: 'black',
    fontSize: normalize(12),
    fontFamily: 'lexend-medium',
  },
  input: {
    borderRadius: 10,
    justifyContent: 'center',
    height: hp(6),
    borderWidth: 1,
    borderColor: colors.gray,
  },
  buttonContainer: {
    borderRadius: normalize(6),
    marginVertical: hp(3),
    position: 'absolute',
    bottom: 0,
    width:'88%'
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalContainer: {
    flex: 1,
    backgroundColor: colors.white2,
    marginTop: hp(1),
  },
  totalSubContainer: {
    backgroundColor: colors.orange,
    padding: wp(3),
  },
  btSheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  qtyBtn: {
    borderRadius: 6,
    // width: '16%',
    height: hp(3.5),
  },
  quantitySheet: {
    marginHorizontal: wp(6),
    marginVertical: hp(1),
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: hp(1.5),
    backgroundColor: colors.white,
    borderRadius: normalize(10),
    marginBottom: hp(1.5),
    // width: '90%',
    marginHorizontal: wp(4),
  },
  logo: {
    width: hp(12),
    height: hp(12),
    resizeMode: 'cover',
    borderRadius: normalize(6),
  },
  iconContainer: {
    width: hp(2.8),
    height: hp(2.8),
    borderRadius: normalize(3),
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    backgroundColor: colors.orange,
    borderRadius: normalize(4),
    justifyContent: 'space-between',
    width: '50%',
    padding: hp(0.5),
  },
  trash: {
    padding: wp(1),
    alignSelf: 'flex-start',
  },
});
