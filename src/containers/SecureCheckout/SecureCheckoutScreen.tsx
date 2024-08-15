import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  FontText,
  Loader,
  Input,
  Button,
  AddressComponent,
  IconHeader,
  CartCountModule,
  Popup,
  CountNumberModule,
  Modal,
} from '../../components';
import commonStyle, {
  iconSize,
  mediumFont,
  mediumLarge1Font,
  mediumLargeFont,
  smallest,
  smallFont,
  tabIcon,
} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {colors, SvgIcons, Images, fonts} from '../../assets';
import {RootScreens} from '../../types/type';
import {
  useAddOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
} from '../../api/order';
import utils from '../../helper/utils';
import {
  calculateTotalPrice,
  decrementCartItem,
  getAddressList,
  getCartItems,
  incrementCartItem,
  removeCartItem,
  updateAddressList,
  updateCartItems,
} from '../Cart/Carthelper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {resetNavigateTo} from '../../helper/navigationHelper';
import ModalComponente from '../../components/Modal';

const SecureCheckoutScreen = ({navigation, route}: any) => {
  const [createOrder, {isLoading}] = useAddOrderMutation();
  const [updateOrder, {isLoading: isProcessing}] = useUpdateOrderMutation();
  const [cancleOrder, {isLoading: isFetching}] = useDeleteOrderMutation();
  const deliveryAdd = route.params.deliveryAdd;
  const billingAdd = route.params.billingAdd;
  const from = route.params.from;
  const nav = route.params.nav;
  const orderDetails = route.params.orderDetails;
  const note = route?.params?.notes;
  const expectedDate = route?.params?.expectedDate;
  const cartType = route?.params?.cartType;
  const [notes, setNotes] = useState(note ? note : '');
  const [date, setDate] = useState(expectedDate ? expectedDate : new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [deliAdd, setDeliAdd] = useState<any>(deliveryAdd ? deliveryAdd : {});
  const [billAdd, setBillAdd] = useState<any>(billingAdd ? billingAdd : {});
  const isOrder = from === RootScreens.Order;
  const [addressData, setAddressData] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [cartData, setCartData] = useState<any>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isClick, setIsClick] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [cartItems, setCartItems] = useState<any>([]);
  const [orderId, setOrderId] = useState();
  const [selectedItem, setSelectedItem] = useState<any>({});
  const product = isOrder
    ? orderDetails?.orderDetails?.map((item: any) => {
        return {
          ...item,
          company: {...orderDetails?.company},
        };
      })
    : cartData;

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
            onPress={()=>navigation.goBack()}>
            <SvgIcons.Back_Arrow width={iconSize} height={iconSize} />
          </TouchableOpacity>
          <FontText
            name={'mont-semibold'}
            size={mediumLargeFont}
            color={'white'}>
            {from === 'Order' ? 'Order Detail' : 'Checkout'}
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
  }, [navigation, cartType, isOrder, nav, cartItems]);

  const onBackPress = () => {
    if (!isOrder && cartType === 'updateOrder') {
      navigation.navigate(RootScreens.SecureCheckout, {
        from: RootScreens.Order,
        deliveryAdd: orderDetails?.deliveryAddress,
        billingAdd: orderDetails?.billingAddress,
        orderDetails: orderDetails,
        notes: orderDetails?.notes,
        name: 'Order Details',
        expectedDate: orderDetails?.approxDeliveryDate,
        nav: nav,
      });
    } else {
      if (nav === 'Home') {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: RootScreens.DashBoard,
              state: {
                index: 0,
                routes: [
                  {
                    name: RootScreens.Home,
                  },
                ],
              },
            },
          ],
        });
      } else if (nav === 'Order') {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: RootScreens.DashBoard,
              state: {
                index: 0,
                routes: [
                  {
                    name: RootScreens.Order,
                  },
                ],
              },
            },
          ],
        });
      } else {
        navigation.goBack();
      }
    }
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [cartType, isOrder, nav]);

  const backAction = () => {
    onBackPress();
    return true;
  };

  useEffect(() => {
    setIsClick(false);
    const fetchCartItems = async () => {
      let items: any;
      if (cartType && cartType === 'updateOrder') {
        items = await getCartItems('updateOrder');
      } else {
        items = await getCartItems();
      }
      // const companyNames = items.map(
      //   (item: any) => item.companyData[0].companyName,
      // );
      const firstCompanyName = items[0]?.company?.companyName;
      setCompanyName(firstCompanyName);
      setCartData(items);
      const price = await calculateTotalPrice(cartType);
      setTotalPrice(price);
    };
    fetchCartItems();
  }, [navigation, cartType]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchAddressItems = async (cartType?: any) => {
        let items: any;
        if (cartType === 'updateOrder') {
          items = await getAddressList('updateAddress');
          if (items?.length === 0) {
            items = await getAddressList();

            const itms = items.map((obj: any) => {
              if (obj.id === deliveryAdd.id) {
                obj.deliveryAdd = true;
              } else {
                obj.deliveryAdd = false;
              }
              if (obj.id === billingAdd.id) {
                obj.billingAdd = true;
              } else {
                obj.billingAdd = false;
              }
              return obj;
            });

            await updateAddressList(items, 'updateAddress');
          }

          setDeliAdd(items?.find((d: any) => d?.deliveryAdd === true));
          setBillAdd(items?.find((d: any) => d?.billingAdd === true));
        } else {
          items = await getAddressList();

          setDeliAdd(items?.find((d: any) => d?.deliveryAdd === true));
          setBillAdd(items?.find((d: any) => d?.billingAdd === true));
        }
        setAddressData(items);
      };
      fetchAddressItems(cartType);
    }, [navigation, cartType]),
  );

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(Platform.OS === 'ios');
    Platform.OS !== 'ios' && setDate(currentDate);
    setSelectedDate(currentDate);
  };

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

  const showDatepicker = () => {
    setShow(true);
  };
  const backActionOrderPlaced = () => {
    resetNavigateTo(navigation, RootScreens.DashBoard);
    return true;
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
    setIsOpen2(false);
  };

  const _renderItem = ({item, index}: any) => {
    return (
      //  <>
      //    <View key={item.id} style={[styles.itemContainer]}>
      //     <View style={[commonStyle.rowJB, commonStyle.flex]}>
      //       {item?.product?.image ? (
      //         <Image source={{uri: item?.product?.image}} style={styles.logo} />
      //       ) : (
      //         <Image source={Images.productImg} style={styles.logo} />
      //       )}
      //       <View style={{width: '50%'}}>
      //         <FontText
      //           name={'lexend-regular'}
      //           size={mediumFont}
      //           color={'gray4'}
      //           textAlign={'left'}>
      //           {item?.product?.productName}
      //         </FontText>
      //         <FontText
      //           name={'lexend-regular'}
      //           size={mediumFont}
      //           color={'black2'}
      //           pTop={wp(1)}
      //           pBottom={wp(1)}
      //           textAlign={'left'}>
      //           {'₹'}
      //           {item?.price}
      //           {item?.product?.unit && `${'/'}${item?.product?.unit}`} (
      //           {item?.quantity} qty)
      //         </FontText>
      //         {item?.product?.minOrderQuantity == 0 &&
      //         item?.product?.maxOrderQuantity == 0 ? null : (
      //           <FontText
      //             name={'lexend-regular'}
      //             size={mediumFont}
      //             color={'gray4'}
      //             textAlign={'left'}>
      //             {`Range : ${item?.product?.minOrderQuantity} - ${item?.product?.maxOrderQuantity}`}
      //           </FontText>
      //         )}
      //       </View>
      //       <View style={{width: '20%'}}>
      //         <FontText
      //           name={'lexend-regular'}
      //           size={mediumFont}
      //           textAlign={'right'}
      //           color={'orange'}>
      //           {'₹'}
      //           {(item?.price * item?.quantity).toFixed(2)}
      //         </FontText>
      //       </View>
      //     </View>
      //   </View>
      //   {product?.length !== index + 1 ? <View style={[styles.line]} /> : null}
      // </>
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
          <View style={{marginLeft: wp(4), width: '78%'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <FontText
                name={'mont-semibold'}
                size={smallFont}
                color={'black2'}
                textAlign={'left'}>
                {item?.product?.productName}{' '}
              </FontText>
              {!isOrder ? null : (
                <FontText
                  name={'mont-semibold'}
                  size={smallFont}
                  color={'gray5'}
                  textAlign={'left'}>
                  (Qty : {item?.quantity})
                </FontText>
              )}
            </View>
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <FontText
                name={isOrder ? 'mont-semibold' : 'mont-bold'}
                size={isOrder ? smallest : smallFont}
                color={isOrder ? 'gray5' : 'orange'}
                pTop={wp(1)}
                pBottom={wp(1)}
                textAlign={'left'}>
                {'₹'} {item?.price}
                {item?.product?.unit && `${'/'}${item?.product?.unit}`}
              </FontText>
              {!isOrder ? null : (
                <FontText
                  name={'mont-bold'}
                  size={smallFont}
                  textAlign={'right'}
                  color={'orange'}>
                  {'₹'}
                  {(item?.price * item?.quantity).toFixed(2)}
                </FontText>
              )}
            </View>
          </View>
        </View>
        <View>
          {isOrder ? null : (
            <View style={{alignItems: 'center'}}>
              <CountNumberModule
                from={'cart'}
                cartItems={item}
                productDetail={item}
                handleDecrement={handleDecrement}
                handleIncrement={handleIncrement}
              />
              <TouchableOpacity
                style={{
                  padding: wp(2),
                  alignSelf: 'flex-end',
                  backgroundColor: colors.red3,
                  borderRadius: normalize(100),
                  justifyContent: 'center',
                  marginRight: wp(2),
                }}
                onPress={() => {
                  setIsOpen2(true);
                  setSelectedItem(item.id);
                  // handleRemoveItem(item.id);
                }}>
                <SvgIcons._Trash width={wp(4)} height={wp(4)} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  const addressRenderItem = ({item, index}: any) => {
    let delivery = addressData?.find((d: any) => d?.deliveryAdd);
    let billing = addressData?.find((d: any) => d?.billingAdd);
    return (
      <View style={{flexDirection: 'column'}} key={index}>
        <IconHeader
          label={index === 0 ? 'Delivery address' : 'Billing address'}
          isEdit={isOrder ? false : true}
          onEditPress={() => {
            let params: any = {
              from: RootScreens.SecureCheckout,
              type: index === 0 ? 'Delivery address' : 'Billing address',
              deliveryAdd: delivery,
              billingAdd: billing,
              cartData: cartData,
              notes: notes,
              expectedDate: date,
              orderDetails: orderDetails,
            };
            navigation.navigate(RootScreens.Address, {
              data:
                cartType === undefined
                  ? params
                  : {...params, addressType: 'updateAddress'},
              onGoBack: (param: any) => {
                setDeliAdd(param?.deliveryAdd);
                setBillAdd(param?.billingAdd);
              },
            });
          }}
        />
        {isOrder ? (
          // <AddressComponent
          //   item={
          //     index === 0
          //       ? orderDetails?.deliveryAddress
          //       : orderDetails?.billingAddress
          //   }
          //   from={RootScreens.SecureCheckout}
          //   isEditDelete={false}
          // />
          <>
            {index === 0 ? (
              <>
                {orderDetails?.deliveryAddress?.addressLine ? (
                  <AddressComponent
                    type={'Home'}
                    item={orderDetails?.deliveryAddress}
                    from={RootScreens.Address}
                    isEditDelete={false}
                  />
                ) : null}
              </>
            ) : (
              <>
                {orderDetails?.billingAddress?.addressLine ? (
                  <AddressComponent
                    type={'Company'}
                    item={orderDetails?.billingAddress}
                    from={RootScreens.Address}
                    isEditDelete={false}
                  />
                ) : (
                  <FontText
                    name={'mont-medium'}
                    size={smallFont}
                    pLeft={wp(2)}
                    color={'black2'}>
                    {'Not available'}
                  </FontText>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {index === 0 ? (
              <>
                {delivery !== undefined ? (
                  <AddressComponent
                    type={'Home'}
                    item={delivery}
                    from={RootScreens.SecureCheckout}
                    isEditDelete={false}
                  />
                ) : null}
              </>
            ) : (
              <>
                {billing !== undefined ? (
                  <AddressComponent
                    type={'Company'}
                    item={billing}
                    from={RootScreens.SecureCheckout}
                    isEditDelete={false}
                  />
                ) : null}
              </>
            )}
            {/* {delivery !== undefined || billing !== undefined ? (
              <AddressComponent
                item={index === 0 ? delivery : billing}
                from={RootScreens.SecureCheckout}
                isEditDelete={false}
              />
            ) : <View/>} */}
          </>
        )}
        {/* {index === 0 && <View style={styles.line} />} */}
      </View>
    );
  };

  const placeOrderPress = async () => {
    if (deliAdd === undefined) {
      Alert.alert('Error', 'Delivery Address is required', [
        {
          text: 'Ok',
          onPress: () => {
            setIsClick(false);
          },
        },
      ]);
    } else {
      let body: any = {};
      let ids;
      body = cartData?.map((item: any, index: any) => {
        return {
          product: item?.product?.id,
          quantity: item?.quantity,
        };
      });
      ids = cartData?.find((item: any, index: any) => item?.company);
      let params = {
        orderDetails: body,
        notes: notes,
        approxDeliveryDate: date,
        deliveryAddress: deliAdd?.id,
        billingAddress: billAdd?.id,
        company: ids.company.id,
        // isBuyer: true,
      };
      billAdd === undefined && delete params.billingAddress;
      if (cartType === 'updateOrder') {
        let body = {
          data: params,
          id: orderDetails.id,
        };
        const {data: order, error}: any = await updateOrder(body);
        if (!error && order?.statusCode === 200) {
          await updateCartItems([], 'updateOrder');
          let updatedCartItems = await getCartItems('updateOrder');
          utils.showSuccessToast(order?.message);
          setIsClick(false);
          if (updatedCartItems?.length == 0) {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: RootScreens.DashBoard,
                  state: {
                    index: 0,
                    routes: [
                      {
                        name: RootScreens.Order,
                      },
                    ],
                  },
                },
              ],
            });
          }
        } else {
          setIsClick(false);
          utils.showErrorToast(
            order?.message ? order?.message : error?.data?.message,
          );
        }
      } else {
        const {data: order, error}: any = await createOrder(params);
        setIsOpen1(true);
        if (!error && order?.statusCode === 201) {
          await updateCartItems([]);
          let updatedCartItems = await getCartItems();

          setOrderId(order?.result);
          if (updatedCartItems?.length == 0) {
            setIsClick(false);

            // navigation.navigate(RootScreens.OrderPlaced, {data: order?.result});
          }
        } else {
          setIsClick(false);
          utils.showErrorToast(
            order?.message ? order?.message : error?.data?.message,
          );
        }
      }
    }
  };

  const cancelOrder = async () => {
    setIsOpen(false);
    const {data, error}: any = await cancleOrder(orderDetails.id);
    if (!error && data?.statusCode === 200) {
      utils.showSuccessToast('Order Cancel Successfully.');
      navigation.goBack();
    } else {
      utils.showErrorToast(
        data?.message ? data?.message : error?.data?.message,
      );
    }
  };

  const onEditPress = async () => {
    const orderData = await product.map((item: any) => {
      item.id = Number(item.product.id);
      return item;
    });
    await updateCartItems(orderData, 'updateOrder');
    await updateAddressList([], 'updateAddress');
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
  };

  return (
    <View style={commonStyle.container}>
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
              {isOrder ? 'Order Detail' : 'Secure Checkout'}
            </FontText>
          </View>
        }
      /> */}
      <Loader loading={isLoading || isFetching || isProcessing} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp(2),
          paddingTop: isOrder ? hp(2) : 0,
        }}
        nestedScrollEnabled
        style={[commonStyle.paddingH4]}>
        <View style={[styles.addressContainer, {marginTop: from==="Cart" ? wp(4) : wp(0)}]}>
          {isOrder ? (
            <View style={{alignItems: 'flex-start'}}>
              <FontText
                name={'mont-semibold'}
                size={mediumFont}
                color={'black2'}
                textAlign={'left'}>
                {'Order Items'}
              </FontText>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <FontText
                name={'mont-semibold'}
                size={mediumFont}
                color={'black2'}
                textAlign={'left'}>
                {'Order list'}
              </FontText>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  let params: any = {
                    from: RootScreens.SecureCheckout,
                    deliveryAdd: deliAdd,
                    billingAdd: billAdd,
                    cartData: cartData,
                    notes: notes,
                    expectedDate: date,
                    cartType: 'updateOrder',
                    orderDetails: orderDetails,
                    nav: nav,
                  };
                  if (cartType === 'updateOrder') {
                    navigation.navigate(RootScreens.Cart, params);
                  } else {
                    delete params.orderDetails;
                    delete params.cartType;
                    navigation.goBack();
                    route.params.onGoBackCart(params);
                  }
                }}>
                <SvgIcons.Edit width={tabIcon} height={tabIcon} />
              </TouchableOpacity>
            </View>
          )}
          {/* <ScrollView
            contentContainerStyle={{maxHeight: hp(32),marginTop:wp(3)}}
            showsVerticalScrollIndicator={false}>
            {product.map((item: any, index: any) => {
              return _renderItem({item, index});
            })}
          </ScrollView> */}
          <View style={{maxHeight: hp(32), paddingVertical: wp(2)}}>
            <FlatList
              data={product}
              renderItem={_renderItem}
              nestedScrollEnabled
              scrollEnabled
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item?._id?.toString()}
            />
          </View>
          {/* <FlatList
      data={product}
      renderItem={_renderItem}
      keyExtractor={(item, index) => index.toString()} // Use a unique key for each item
      contentContainerStyle={{maxHeight: hp(32),marginTop:wp(3)}}
      showsVerticalScrollIndicator={false}
    /> */}
        </View>
        {/* <FontText
          name={'lexend-regular'}
          size={mediumFont}
          color={'orange'}
          pTop={wp(1)}
          textAlign={'left'}>
          {'Company Name:'}
          <FontText
            name={'lexend-regular'}
            size={mediumFont}
            color={'black2'}
            textAlign={'left'}>
            {' '}
            {orderDetails?.company?.companyName
              ? orderDetails?.company?.companyName
              : companyName}
          </FontText>
        </FontText> */}
        {/* {isOrder ? (
          <View>
            <FontText
              name={'lexend-regular'}
              size={mediumFont}
              color={'orange'}
              textAlign={'left'}>
              {'Order Date:'}
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'black2'}
                textAlign={'left'}>
                {' '}
                {moment(orderDetails?.orderDate).format('DD-MM-YYYY')}
              </FontText>
            </FontText>
            <FontText
              name={'lexend-regular'}
              size={mediumFont}
              color={'orange'}
              textAlign={'left'}>
              {'Delivery Date:'}
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'black2'}
                textAlign={'left'}>
                {' '}
                {moment(orderDetails?.approxDeliveryDate).format('DD-MM-YYYY')}
              </FontText>
            </FontText>
            <FontText
              name={'lexend-regular'}
              size={mediumFont}
              color={'orange'}
              textAlign={'left'}>
              {'Order Id:'}
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'black2'}
                textAlign={'left'}>
                {' '}
                {orderDetails?.orderId}
              </FontText>
            </FontText>
          </View>
        ) : null} */}
        {!isOrder ? null : (
          <View
            style={{
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: colors.orange,
              borderRadius: normalize(15),
              padding: wp(3),
              backgroundColor: colors.orange2,
              marginBottom: wp(3),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <FontText
                name={'mont-semibold'}
                size={smallFont}
                color={'black2'}
                textAlign={'left'}>
                {orderDetails?.orderId}
              </FontText>
              <View
                style={{
                  borderWidth: 0,
                  borderRadius: 5,
                  height: hp(3.5),
                  width: wp(20),
                  backgroundColor:
                    orderDetails?.status === 'pending'
                      ? colors.yellow1
                      : orderDetails?.status === 'cancelled'
                      ? colors.red3
                      : orderDetails?.status === 'delivered'
                      ? colors.green1
                      : orderDetails?.status === 'processing'
                      ? colors.orange3
                      : colors.gray5,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontText
                  color={
                    orderDetails?.status === 'pending'
                      ? 'yellow2'
                      : orderDetails?.status === 'cancelled'
                      ? 'red'
                      : orderDetails?.status === 'delivered'
                      ? 'green'
                      : orderDetails?.status === 'processing'
                      ? 'orange'
                      : 'tabGray1'
                  }
                  size={smallFont}
                  textAlign={'left'}
                  name={'mont-bold'}>
                  {orderDetails?.status?.charAt(0).toUpperCase() +
                    orderDetails?.status?.slice(1)}
                </FontText>
              </View>
            </View>
            <FontText
              name={'mont-medium'}
              size={smallFont}
              color={'darkGray'}
              textAlign={'left'}>
              {/* {orderDetails} */}ddddd
            </FontText>
          </View>
        )}
        <View style={[{bottom: wp(3)}]}>
          {[1, 2].map((item, index) => {
            return addressRenderItem({item, index});
          })}
        </View>

        {isOrder && notes === '' ? null : (
          <View style={[styles.addressContainer, {marginBottom: wp(4)}]}>
            {isOrder ? (
              <View style={[styles.inputText]}>
                <FontText
                  name={'mont-medium'}
                  size={mediumFont}
                  color={'black2'}
                  textAlign={'left'}>
                  {' '}
                  {notes}
                </FontText>
              </View>
            ) : (
              <Input
                value={notes}
                onChangeText={(text: string) => setNotes(text)}
                placeholder={'Type note here...'}
                autoCapitalize="none"
                placeholderTextColor={'gray3'}
                inputStyle={styles.inputText}
                color={'black'}
                returnKeyType={'done'}
                blurOnSubmit
                multiline
              />
            )}
          </View>
        )}
        <View style={styles.addressContainer}>
          {isOrder ? (
            <View style={[styles.quantityBtn, {paddingVertical: wp(4)}]}>
              <FontText
                name={'mont-medium'}
                size={mediumFont}
                pLeft={wp(4)}
                color={'black2'}>
                {moment(orderDetails?.approxDeliveryDate).format('DD')} -{' '}
                {moment(orderDetails?.approxDeliveryDate).format('MM')} -{' '}
                {moment(orderDetails?.approxDeliveryDate).format('YYYY')}
              </FontText>
            </View>
          ) : (
            <Button
              onPress={() => showDatepicker()}
              bgColor={'white2'}
              style={[styles.quantityBtn, {alignSelf: 'center'}]}>
              <FontText
                name={'mont-medium'}
                size={mediumFont}
                pLeft={wp(4)}
                // pRight={wp(2)}
                color={'black2'}>
                {date
                  ? `${moment(date).format('DD')} / ${moment(date).format(
                      'MM',
                    )} / ${moment(date).format('YYYY')}`
                  : 'Expected date'}
              </FontText>
              <View style={{paddingRight: wp(4)}}>
                <SvgIcons.Caledar_1
                  height={iconSize}
                  width={iconSize}
                  fill={colors.black2}
                />
              </View>
            </Button>
          )}
        </View>
      </ScrollView>

      <CartCountModule
        btnText={cartType === 'updateOrder' ? 'Update Order' : 'Place Order'}
        btnText2={'Edit Order'}
        btnText1={'Cancel Order'}
        btnColor={'orange'}
        btnColor1={'orange4'}
        btnColor2={'orange'}
        cartData={product}
        orderDetails={orderDetails}
        isShow={isOrder ? false : true}
        isShowButtons={isOrder ? orderDetails?.status === 'pending' : false}
        onPress={() => {
          setIsClick(true);
          placeOrderPress();
        }}
        onBtn2Press={onEditPress}
        onBtn1Press={() => setIsOpen(true)}
        clickDisable={isClick}
        total={
          isOrder
            ? Number(orderDetails?.totalAmount).toFixed(2)
            : totalPrice.toFixed(2)
        }
      />
      <Modal
        visible={isOpen}
        onBackPress={() => setIsOpen(false)}
        description={`Are you sure you want to Cancel\n this Order?`}
        title={' '}
        titleStyle={{fontSize: normalize(14)}}
        leftBtnText={'No, don’t cancel'}
        rightBtnText={'Yes, cancel'}
        leftBtnPress={() => setIsOpen(false)}
        rightBtnPress={() => cancelOrder()}
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
        style={{paddingHorizontal: wp(4), paddingVertical: wp(5)}}
      />
      {show && (
        <View style={styles.datePickerStyle}>
          {Platform.OS === 'ios' && (
            <View
              style={[styles.pickerHeaderStyle, commonStyle.shadowContainer]}>
              <TouchableOpacity
                onPress={() => {
                  setShow(false);
                  setDate(selectedDate);
                }}>
                <FontText
                  name={'mont-semibold'}
                  size={smallFont}
                  color={'orange'}>
                  {' '}
                  {'Done'}
                </FontText>
              </TouchableOpacity>
            </View>
          )}
          <DateTimePicker
            value={new Date(date)}
            mode="date"
            is24Hour={true}
            minimumDate={new Date()}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
            themeVariant="light"
            style={{backgroundColor: colors.white}}
          />
        </View>
      )}
      <Popup
        visible={isOpen2}
        // onBackPress={() => setIsOpen(false)}
        title={`Are you sure you want to Cancel\nthis item?`}
        titleStyle={{fontSize: normalize(14)}}
        leftBtnText={'No, don’t cancel'}
        rightBtnText={'Yes, cancel'}
        leftBtnPress={() => setIsOpen2(false)}
        rightBtnPress={() => handleRemoveItem(selectedItem)}
        onTouchPress={() => setIsOpen2(false)}
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

      <Modal
      from={'checkout'}
        visible={isOpen1}
        onBackPress={() => {
          setIsOpen1(false);
        }}
        title={' '}
        titleStyle={{}}
        children={
          <View style={{alignItems: 'center'}}>
            <SvgIcons.OrderConfirm />
            <FontText
              color="black2"
              name="mont-medium"
              size={mediumLargeFont}
              pBottom={wp(3)}
              textAlign={'center'}>
              {'Your order has been confirm'}
            </FontText>
            <FontText
              color="black"
              name="mont-semibold"
              size={mediumLarge1Font}
              pBottom={wp(3)}
              textAlign={'center'}>
              {'Thank you for your purchase !'}
            </FontText>
            <FontText
              color="black2"
              name="mont-semibold"
              size={mediumFont}
              pBottom={wp(12)}
              textAlign={'center'}>
              {`Your order ID is : ${orderId?.orderId}`}
            </FontText>
            <Button
              onPress={backActionOrderPlaced}
              bgColor={'orange'}
              style={styles.buttonContainer}>
              <FontText name={'mont-bold'} size={mediumFont} color={'white'}>
                {'Back to home'}
              </FontText>
            </Button>
          </View>
        }
      />
    </View>
  );
};

export default SecureCheckoutScreen;

const styles = StyleSheet.create({
  addressContainer: {
    borderColor: colors.line,
    borderRadius: normalize(8),
  },
  inputText: {
    color: colors.black2,
    fontSize: mediumFont,
    fontFamily: fonts['mont-medium'],
    marginTop: hp(1),
    paddingVertical: wp(2),
    borderRadius: normalize(20),
    borderWidth: 1,
    borderColor: colors.lightGray,
    // paddingHorizontal: wp(5),
    paddingLeft:wp(6)
  },
  quantityBtn: {
    width: '100%',
    justifyContent: 'space-between',
    marginTop: hp(0.5),
    borderRadius: normalize(100),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    marginVertical: hp(1),
  },
  logo: {
    width: hp(6.5),
    height: hp(6.5),
    resizeMode: 'cover',
    borderRadius: normalize(6),
  },
  editBtn: {
    alignSelf: 'flex-end',
    paddingLeft: wp(5),
    paddingRight: wp(0.5),
  },
  datePickerStyle: {
    position: 'absolute',
    justifyContent: 'flex-end',
    width: '100 %',
    height: '100 %',
    zIndex: 2,
    backgroundColor: colors.placeholder,
  },
  pickerHeaderStyle: {
    width: '100%',
    padding: hp(1.5),
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: colors.white,
    borderColor: colors.line,
    borderBottomWidth: 1,
    borderTopLeftRadius: normalize(5),
    borderTopRightRadius: normalize(5),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: hp(1.2),
    backgroundColor: colors.white,
    borderRadius: normalize(15),
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.orange,
    marginBottom: hp(1.5),
    width: '100%',
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
  buttonContainer: {
    borderRadius: normalize(100),
    width: '100%',
  },
});
