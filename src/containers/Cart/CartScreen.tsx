import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import commonStyle, {
  fontSize,
  largeFont,
  mediumFont,
  mediumLarge1Font,
  mediumLargeFont,
  smallFont,
  tabIcon,
} from '../../styles';
import {Button, FontText, Loader, NavigationBar} from '../../components';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import SvgIcons from '../../assets/SvgIcons';
import {
  useGetCartsQuery,
  useRemoveCartMutation,
  useUpdateCartMutation,
} from '../../api/cart';
import {RootScreens} from '../../types/type';
import Popup from '../../components/Popup';
import utils from '../../helper/utils';
import RBSheet from 'react-native-raw-bottom-sheet';
import CartCountModule from '../../components/CartCountModule';
import {useSelector} from 'react-redux';

const CartScreen = ({navigation, route}: any) => {
  const companyId = route.params.companyId;

  const {
    data: carts,
    isFetching,
    refetch,
  } = useGetCartsQuery(
    {companyId: companyId},
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const [updateCart, {isLoading: isLoad}] = useUpdateCartMutation();
  const [removeCart, {isLoading: isFetch}] = useRemoveCartMutation();

  const quantityRef: any = useRef();
  const [cartData, setCartData] = useState<any>([]);
  const [selectedItem, setSelectedItem] = useState<any>({});
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCartData(carts?.result);
  }, [isFetching, carts, companyId]);

  const placeOrderPress = () => {
    const address = userInfo?.companyId?.address.find(
      (item: any) => item.isPriority,
    );
    navigation.navigate(RootScreens.SecureCheckout, {
      data: carts?.result,
      deliveryAdd: address,
      billingAdd: address,
      companyId: companyId,
      from: RootScreens.Cart,
    });
  };

  const quantityIncrement = async (itm: any) => {
    let qua = {
      ...itm,
      quantity: itm.quantity >= 0 ? itm.quantity + 1 : 0,
    };
    setSelectedItem(qua);
  };

  const quantityDecrement = async (itm: any) => {
    let data = {
      ...itm,
      quantity: itm.quantity > 1 ? itm.quantity - 1 : 1,
    };
    setSelectedItem(data);
  };

  const quantityDoneHandler = async () => {
    let body: any = {
      quantity: selectedItem.quantity,
    };
    let params = {
      body: body,
      _id: selectedItem?._id,
    };
    console.log('Params', params);
    const {data, error}: any = await updateCart(params);
    console.log('UPDATA', data, error);

    if (!error && data?.statusCode === 200) {
      quantityRef.current.close();
      utils.showSuccessToast(data.message);
    } else {
      utils.showErrorToast(data.message || error);
    }
  };

  const removeCartItem = async () => {
    setIsOpen(false);
    console.log('productId', [selectedItem?._id]);
    const {data, error}: any = await removeCart({ids: [selectedItem?._id]});
    console.log('DATA', data, error);
    if (!error) {
      refetch();
      utils.showSuccessToast(data.message);
    } else {
      utils.showErrorToast(error.message);
    }
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <View style={[styles.itemContainer, commonStyle.shadowContainer]}>
        <View style={[commonStyle.rowAC, commonStyle.flex]}>
          <Image source={{uri: item?.productData?.image}} style={styles.logo} />
          <View style={{marginLeft: wp(4), width: '66%'}}>
            <FontText
              name={'lexend-regular'}
              size={mediumFont}
              color={'gray4'}
              // pTop={wp(2)}
              textAlign={'left'}>
              {item?.productData?.name}
            </FontText>
            <FontText
              name={'lexend-regular'}
              size={fontSize}
              color={'black2'}
              pTop={wp(2)}
              textAlign={'left'}>
              {'$'}
              {item?.productData?.price}
            </FontText>
          </View>
        </View>
        <View style={{justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={styles.trash}
            onPress={() => {
              setSelectedItem(item);
              setIsOpen(true);
            }}>
            <SvgIcons.Trash width={wp(4)} height={wp(4)} />
          </TouchableOpacity>
          <Button
            onPress={() => {
              setSelectedItem(item);
              quantityRef.current.open();
            }}
            bgColor={'orange'}
            style={styles.quantityBtn}>
            <FontText
              name={'lexend-medium'}
              size={smallFont}
              pLeft={wp(0.5)}
              pRight={wp(2)}
              color={'white'}>
              {`Qty ${item.quantity}`}
            </FontText>
            <SvgIcons.DownArrow
              height={wp(3)}
              width={wp(3)}
              fill={colors.white}
            />
          </Button>
        </View>
      </View>
    );
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
      <View style={commonStyle.flex}>
        {cartData && cartData?.length !== 0 ? (
          <FlatList
            data={cartData?.cart}
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
            {/* <TouchableOpacity
              onPress={() => navigation.navigate(RootScreens.DashBoard)}>
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
            </TouchableOpacity> */}
          </View>
        )}
        <CartCountModule
          btnText={'Secure Checkout'}
          btnColor={'orange'}
          cartData={cartData}
          onPress={placeOrderPress}
          isShow={true}
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
        rightBtnPress={removeCartItem}
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
      <RBSheet
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
          <View style={[commonStyle.rowAC, styles.countContainer]}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                quantityDecrement(selectedItem);
              }}>
              <SvgIcons.Remove width={wp(4)} height={wp(4)} />
            </TouchableOpacity>
            <FontText
              name={'lexend-regular'}
              size={mediumLargeFont}
              color={'orange'}
              // pTop={wp(2)}
              textAlign={'left'}>
              {selectedItem.quantity}
            </FontText>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                quantityIncrement(selectedItem);
              }}>
              <SvgIcons.Plus
                width={wp(4)}
                height={wp(4)}
                fill={colors.orange}
              />
            </TouchableOpacity>
          </View>
          <Button
            onPress={quantityDoneHandler}
            bgColor={'orange'}
            style={[styles.buttonContainer]}>
            <FontText name={'lexend-medium'} size={fontSize} color={'white'}>
              {'Done'}
            </FontText>
          </Button>
        </View>
      </RBSheet>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  product2CC: {
    paddingTop: hp(0.5),
    paddingHorizontal: wp(4),
  },
  buttonContainer: {
    borderRadius: normalize(6),
    marginTop: hp(1.5),
    // marginVertical: hp(3),
    width: '88%',
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btSheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  quantitySheet: {
    marginHorizontal: wp(6),
    marginVertical: hp(1),
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
    width: hp(8.5),
    height: hp(8.5),
    resizeMode: 'cover',
    borderRadius: normalize(6),
  },
  iconContainer: {
    width: hp(4),
    height: hp(4),
    borderRadius: normalize(3),
    backgroundColor: colors.white2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    // backgroundColor: colors.orange,
    borderRadius: normalize(4),
    justifyContent: 'space-between',
    width: '50%',
    padding: hp(0.8),
    marginTop: hp(2),
  },
  trash: {
    padding: wp(1),
    alignSelf: 'flex-end',
  },
  quantityBtn: {
    height: hp(3),
    width: 'auto',
    justifyContent: 'space-between',
    marginTop: hp(0.5),
  },
});
