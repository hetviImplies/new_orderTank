import {
  Alert,
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
  useUpdateOrderStatusMutation,
} from '../../api/order';
import utils from '../../helper/utils';
import {
  calculateTotalPrice,
  getAddressList,
  getCartItems,
  updateCartItems,
} from '../Cart/Carthelper';

const SecureCheckoutScreen = ({navigation, route}: any) => {
  const [createOrder, {isLoading}] = useAddOrderMutation();
  const [cancleOrder, {isLoading: isFetching}] = useUpdateOrderStatusMutation();
  const deliveryAdd = route.params.deliveryAdd;
  const billingAdd = route.params.billingAdd;
  const from = route.params.from;
  const orderDetails = route.params.orderDetails;
  const note = route?.params?.notes;
  const expectedDate = route?.params?.expectedDate;
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
  const product = isOrder ? orderDetails?.orderDetails : cartData;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={[
            // commonStyle.iconView,
            {marginLeft: wp(1)},
          ]}
          onPress={() => navigation.goBack()}>
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
  }, [navigation]);

  // useEffect(() => {
  //   setDeliAdd(addressData?.find((d: any) => d?.deliveryAdd === true));
  //   setBillAdd(addressData?.find((d: any) => d?.billingAdd === true));
  // }, [addressData]);

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await getCartItems();
      // const companyNames = items.map(
      //   (item: any) => item.companyData[0].companyName,
      // );
      const firstCompanyName = items[0]?.companyData[0]?.companyName;
      setCompanyName(firstCompanyName);
      setCartData(items);
      const price = await calculateTotalPrice();
      setTotalPrice(price);
    };
    fetchCartItems();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchAddressItems = async () => {
        const items = await getAddressList();
        setDeliAdd(items?.find((d: any) => d?.deliveryAdd === true));
        setBillAdd(items?.find((d: any) => d?.billingAdd === true));
        setAddressData(items);
      };
      fetchAddressItems();
    }, [navigation]),
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
            {item?.image || item?.productData?.image ? (
              <Image
                source={{uri: isOrder ? item?.productData?.image : item?.image}}
                style={styles.logo}
              />
            ) : (
              <Image source={Images.productImg} style={styles.logo} />
            )}
            <View style={{width: '50%'}}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'gray4'}
                textAlign={'left'}>
                {isOrder ? item?.productData?.name : item?.name}
              </FontText>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'black2'}
                pTop={wp(2)}
                textAlign={'left'}>
                {'₹'}
                {item?.price} ({item?.quantity} qty)
              </FontText>
            </View>
            <View style={{width: '20%'}}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                textAlign={'right'}
                color={'orange'}>
                {'₹'}
                {item?.price * item?.quantity}
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
            let params = {
              from: RootScreens.SecureCheckout,
              type: index === 0 ? 'Delivery address' : 'Billing address',
              deliveryAdd: delivery,
              billingAdd: billing,
              cartData: cartData,
              notes: notes,
              expectedDate: date,
            };
            navigation.navigate(RootScreens.Address, {
              data: params,
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
      Alert.alert('Delivery Address is required.');
    } else {
      let body: any = {};
      let ids;
      body = cartData?.map((item: any, index: any) => {
        return {
          product: item?._id,
          quantity: item?.quantity,
        };
      });
      ids = cartData?.find((item: any, index: any) => item?.companyId);

      let params = {
        orderDetails: body,
        notes: notes,
        approxDeliveryDate: date,
        deliveryAddress: deliAdd,
        billingAddress: billAdd,
        companyId: ids.companyId,
        isBuyer: true,
      };
      billAdd === undefined && delete params.billingAddress;
      const {data: order, error}: any = await createOrder(params);
      if (!error && order?.statusCode === 201) {
        await updateCartItems([]);
        let updatedCartItems = await getCartItems();
        if (updatedCartItems?.length == 0) {
          navigation.navigate(RootScreens.OrderPlaced, {data: order?.result});
        }
      } else {
        utils.showErrorToast(order?.message ? order?.message : error?.message);
      }
    }
  };

  const cancelOrder = async () => {
    setIsOpen(false);
    let params = {
      data: {
        status: 'cancelled',
      },
      id: orderDetails._id,
    };
    const {data, error}: any = await cancleOrder(params);
    if (!error && data?.statusCode === 200) {
      utils.showSuccessToast('Order Cancel Successfully.');
      navigation.goBack();
    } else {
      utils.showErrorToast(data?.message ? data?.message : error?.message);
    }
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
      <Loader loading={isLoading || isFetching} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp(2),
          paddingTop: isOrder ? hp(2) : 0,
        }}
        nestedScrollEnabled
        style={[commonStyle.paddingH4]}>
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
            {orderDetails?.companyId?.companyName
              ? orderDetails?.companyId?.companyName
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
        <View style={[styles.addressContainer, commonStyle.marginT2]}>
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
                // navigation.navigate(RootScreens.Cart);
                let params = {
                  from: RootScreens.SecureCheckout,
                  deliveryAdd: deliAdd,
                  billingAdd: billAdd,
                  cartData: cartData,
                  notes: notes,
                  expectedDate: date,
                };
                navigation.goBack();
                route.params.onGoBackCart(params);
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
              showsVerticalScrollIndicator
              keyExtractor={item => item?._id?.toString()}
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
          <IconHeader label={'Expected date:'} icon={<SvgIcons.Calender />} />
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
              onPress={showDatepicker}
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
      </ScrollView>
      <CartCountModule
        btnText={isOrder ? 'Cancel Order' : 'Place Order'}
        btnColor={isOrder ? 'red' : 'orange'}
        cartData={product}
        orderDetails={orderDetails}
        isShow={isOrder ? orderDetails?.status === 'pending' : true}
        onPress={() => {
          isOrder ? setIsOpen(true) : placeOrderPress();
        }}
        total={
          isOrder ? orderDetails?.totalAmount.toFixed(2) : totalPrice.toFixed(2)
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
        leftBtnStyle={{width: '48%', borderColor: colors.blue}}
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
            value={date}
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
    marginVertical: hp(1.5),
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: hp(8.5),
    height: hp(8.5),
    resizeMode: 'cover',
    borderRadius: normalize(6),
  },
  editBtn: {
    alignSelf: 'flex-end',
    marginBottom: hp(-1),
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
