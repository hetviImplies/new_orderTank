import {
  Alert,
  BackHandler,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
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
} from '../../components';
import commonStyle, {
  iconSize,
  mediumFont,
  smallFont,
  tabIcon,
} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {colors, SvgIcons, Images} from '../../assets';
import {RootScreens} from '../../types/type';
import {
  useAddOrderMutation,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
  useUpdateOrderStatusMutation,
} from '../../api/order';
import utils from '../../helper/utils';
import {
  calculateTotalPrice,
  getAddressList,
  getCartItems,
  updateAddressList,
  updateCartItems,
} from '../Cart/Carthelper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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
  const product = isOrder
    ? orderDetails?.orderDetails?.map((item: any) => {
        return {
          ...item,
          company: {...orderDetails?.company},
        };
      })
    : cartData;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={[
            // commonStyle.iconView,
            {marginLeft: wp(1)},
          ]}
          onPress={onBackPress}>
          {Platform.OS === 'android' ? (
            <SvgIcons.AndroidBack
              width={wp(6)}
              height={wp(6)}
              style={{marginLeft: wp(2)}}
            />
          ) : (
            <SvgIcons.BackArrow
              width={wp(5)}
              height={wp(5)}
              fill={colors.blue2}
              stroke={colors.blue2}
            />
          )}
        </TouchableOpacity>
      ),
    });
  }, [navigation, cartType, isOrder, nav]);

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

  const showDatepicker = () => {
    setShow(true);
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <>
        <View style={[styles.itemContainer]}>
          <View style={[commonStyle.rowJB, commonStyle.flex]}>
            {item?.product?.image ? (
              <Image source={{uri: item?.product?.image}} style={styles.logo} />
            ) : (
              <Image source={Images.productImg} style={styles.logo} />
            )}
            <View style={{width: '50%'}}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'gray4'}
                textAlign={'left'}>
                {item?.product?.productName}
              </FontText>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'black2'}
                pTop={wp(2)}
                textAlign={'left'}>
                {'₹'}
                {item?.price}
                {item?.product?.unit && `${'/'}${item?.product?.unit}`} (
                {item?.quantity} qty)
              </FontText>
            </View>
            <View style={{width: '20%'}}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                textAlign={'right'}
                color={'orange'}>
                {'₹'}
                {(item?.price * item?.quantity).toFixed(2)}
              </FontText>
            </View>
          </View>
        </View>
        {product?.length !== index + 1 ? <View style={[styles.line]} /> : null}
      </>
    );
  };

  const addressRenderItem = ({item, index}: any) => {
    let delivery = addressData?.find((d: any) => d?.deliveryAdd);
    let billing = addressData?.find((d: any) => d?.billingAdd);
    return (
      <View>
        <IconHeader
          label={index === 0 ? 'Delivery address' : 'Billing address'}
          icon={
            index === 0 ? (
              <SvgIcons.Truck width={iconSize} height={iconSize} />
            ) : (
              <SvgIcons.Billing width={iconSize} height={iconSize} />
            )
          }
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
                    item={orderDetails?.deliveryAddress}
                    from={RootScreens.SecureCheckout}
                    isEditDelete={false}
                  />
                ) : null}
              </>
            ) : (
              <>
                {orderDetails?.billingAddress?.addressLine ? (
                  <AddressComponent
                    item={orderDetails?.billingAddress}
                    from={RootScreens.SecureCheckout}
                    isEditDelete={false}
                  />
                ) : (
                  <FontText
                    name={'lexend-regular'}
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
        {index === 0 && <View style={styles.line} />}
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
        if (!error && order?.statusCode === 201) {
          await updateCartItems([]);
          let updatedCartItems = await getCartItems();
          if (updatedCartItems?.length == 0) {
            setIsClick(false);
            navigation.navigate(RootScreens.OrderPlaced, {data: order?.result});
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
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        style={[commonStyle.paddingH4]}
        contentContainerStyle={{
          paddingBottom: hp(2),
          paddingTop: isOrder ? hp(2) : 0,
        }}>
        <FontText
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
        </FontText>
        {isOrder ? (
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
        ) : null}
        <View style={[styles.addressContainer, {marginTop: hp(1)}]}>
          <FlatList
            data={[1, 2]}
            renderItem={addressRenderItem}
            keyExtractor={(item, index) => index?.toString()}
          />
        </View>
        <View style={styles.addressContainer}>
          {isOrder ? null : (
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
              <SvgIcons.Edit width={iconSize} height={iconSize} />
            </TouchableOpacity>
          )}
          <View style={{maxHeight: hp(32)}}>
            <FlatList
              data={product}
              renderItem={_renderItem}
              nestedScrollEnabled
              scrollEnabled
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item?.id?.toString()}
            />
          </View>
        </View>
        {isOrder && notes === '' ? null : (
          <View style={styles.addressContainer}>
            <IconHeader label={'Note'} icon={<SvgIcons.Note />} />
            {isOrder ? (
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'black2'}
                textAlign={'left'}>
                {' '}
                {notes}
              </FontText>
            ) : (
              <Input
                value={notes}
                onChangeText={(text: string) => setNotes(text)}
                placeholder={'Type here...'}
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
          <IconHeader
            label={'Scheduled Delivery Date:'}
            icon={<SvgIcons.Calender />}
          />
          {isOrder ? (
            <View
              style={{
                padding: wp(2),
                backgroundColor: colors.white2,
                borderRadius: normalize(5),
                width: wp(27),
                marginTop: hp(0.5),
                alignSelf: 'center',
              }}>
              <FontText
                name={'lexend-medium'}
                size={smallFont}
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
                name={'lexend-medium'}
                size={smallFont}
                pLeft={wp(0.5)}
                pRight={wp(2)}
                color={'black2'}>
                {moment(date).format('DD')} / {moment(date).format('MM')} /{' '}
                {moment(date).format('YYYY')}
              </FontText>
              <SvgIcons.DownArrow
                height={wp(2.5)}
                width={wp(2.5)}
                fill={colors.black2}
              />
            </Button>
          )}
        </View>
      </KeyboardAwareScrollView>
      <CartCountModule
        btnText={cartType === 'updateOrder' ? 'Update Order' : 'Place Order'}
        btnText1={'Edit Order'}
        btnText2={'Cancel Order'}
        btnColor={'orange'}
        btnColor1={'orange'}
        btnColor2={'red'}
        cartData={product}
        orderDetails={orderDetails}
        isShow={isOrder ? false : true}
        isShowButtons={isOrder ? orderDetails?.status === 'pending' : false}
        onPress={() => {
          setIsClick(true);
          placeOrderPress();
        }}
        onBtn1Press={onEditPress}
        onBtn2Press={() => setIsOpen(true)}
        clickDisable={isClick}
        total={
          isOrder
            ? Number(orderDetails?.totalAmount).toFixed(2)
            : totalPrice.toFixed(2)
        }
        showText={
          <View>
            {
              orderDetails ? (
                <FontText
                  name={'lexend-regular'}
                  size={mediumFont}
                  color={'orange'}
                  pTop={wp(2)}
                  pBottom={wp(2)}
                  textAlign={'center'}>
                  {'Order Status:'}
                  <FontText
                    name={'lexend-regular'}
                    size={mediumFont}
                    color={'black2'}
                    textAlign={'center'}>
                    {' '}
                    {orderDetails?.status}
                  </FontText>
                </FontText>
              ) : null
              // <FontText
              //   name={'lexend-regular'}
              //   size={mediumFont}
              //   color={'orange'}
              //   pTop={wp(2)}
              //   pBottom={wp(2)}
              //   textAlign={'center'}>
              //   {'Delivered On:'}
              //   <FontText
              //     name={'lexend-regular'}
              //     size={mediumFont}
              //     color={'black2'}
              //     textAlign={'center'}>
              //     {' '}
              //     {moment(newDate.setDate(newDate.getDate() + 5)).format(
              //       'DD-MM-YYYY',
              //     )}
              //   </FontText>
              // </FontText>
            }
          </View>
        }
      />
      <Popup
        visible={isOpen}
        // onBackPress={() => setIsOpen(false)}
        title={`Are you sure you want to Cancel\n this Order?`}
        titleStyle={{fontSize: normalize(14)}}
        leftBtnText={'No, don’t cancel'}
        rightBtnText={'Yes, cancel'}
        leftBtnPress={() => setIsOpen(false)}
        rightBtnPress={() => cancelOrder()}
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
                  name={'lexend-medium'}
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
    </View>
  );
};

export default SecureCheckoutScreen;

const styles = StyleSheet.create({
  addressContainer: {
    padding: wp(3),
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: normalize(8),
    marginBottom: hp(2),
  },
  inputText: {
    paddingLeft: wp(0),
    color: colors.black2,
    fontSize: normalize(13),
    fontFamily: 'Lexend-Regular',
    marginTop: hp(1),
    padding: 0,
  },
  quantityBtn: {
    height: hp(5),
    width: '40%',
    justifyContent: 'space-evenly',
    marginTop: hp(0.5),
    borderRadius: normalize(4),
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    marginVertical: hp(1),
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: hp(7),
    height: hp(7),
    resizeMode: 'cover',
    borderRadius: normalize(6),
  },
  editBtn: {
    alignSelf: 'flex-end',
    marginBottom: hp(-1),
    paddingTop: hp(0.5),
    paddingLeft: wp(5),
    paddingBottom: hp(0.5),
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
});
