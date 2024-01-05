import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SvgIcons from '../../assets/SvgIcons';
import {FontText, Loader, Input, Button} from '../../components';
import commonStyle, {iconSize, mediumFont, smallFont} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {RootScreens} from '../../types/type';
import {
  useAddOrderMutation,
  useUpdateOrderStatusMutation,
} from '../../api/order';
import AddressComponent from '../../components/AddressComponent';
import IconHeader from '../IconHeader';
import CartCountModule from '../../components/CartCountModule';
import utils from '../../helper/utils';
import {
  calculateTotalPrice,
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
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const isOrder = from === RootScreens.Order;

  const [cartData, setCartData] = useState<any>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const product = isOrder ? orderDetails?.orderDetails : cartData;

  useEffect(() => {
    const fetchCartItems = async () => {
      const items = await getCartItems();
      setCartData(items);
      const price = await calculateTotalPrice();
      setTotalPrice(price);
    };
    fetchCartItems();
  }, []);

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
            <Image
              source={{uri: isOrder ? item?.productData?.image : item?.image}}
              style={styles.logo}
            />
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
                {'$'}
                {item?.price} ({item?.quantity} qty)
              </FontText>
            </View>
            <View style={{width: '20%'}}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                textAlign={'right'}
                color={'orange'}>
                {'$'}
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
            navigation.navigate(RootScreens.Address, {
              data: {
                from: RootScreens.SecureCheckout,
                type: index === 0 ? 'Delivery address' : 'Billing address',
                deliveryAdd: deliveryAdd,
                billingAdd: billingAdd,
                cartData: cartData,
              },
            });
          }}
        />
        <AddressComponent
          item={index === 0 ? deliveryAdd : billingAdd}
          from={RootScreens.SecureCheckout}
        />
        {index === 0 && <View style={styles.line} />}
      </View>
    );
  };

  const placeOrderPress = async () => {
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
      deliveryAddress: deliveryAdd,
      billingAddress: billingAdd,
      companyId: ids.companyId,
      isBuyer: true,
    };
    const {data: order, error}: any = await createOrder(params);
    if (!error && order?.statusCode === 201) {
      await updateCartItems([]);
      let updatedCartItems = await getCartItems();
      if (updatedCartItems?.length == 0) {
        navigation.navigate(RootScreens.OrderPlaced, {data: order?.result});
      }
    } else {
      utils.showErrorToast(error.message);
    }
  };

  const cancelOrder = async () => {
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
      utils.showErrorToast(error.message);
    }
  };

  const newDate = new Date();
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
        contentContainerStyle={{paddingBottom: hp(2), paddingTop: hp(2)}}
        nestedScrollEnabled
        style={[commonStyle.paddingH4]}>
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
          <FlatList data={[1, 2]} renderItem={addressRenderItem} />
        </View>
        <View style={styles.addressContainer}>
          {isOrder ? null : (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => {
                navigation.navigate(RootScreens.Cart);
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
            />
          </View>
        </View>
        {isOrder && notes === '' ? null : (
          <View style={styles.addressContainer}>
            <IconHeader label={'Note'} icon={<SvgIcons.Note />} />
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
              }}>
              <FontText
                name={'lexend-medium'}
                size={smallFont}
                color={'black2'}>
                {moment(date).format('DD')} - {moment(date).format('MM')} -{' '}
                {moment(date).format('YYYY')}
              </FontText>
            </View>
          ) : (
            <Button
              onPress={showDatepicker}
              bgColor={'white2'}
              style={styles.quantityBtn}>
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
        onPress={isOrder ? cancelOrder : placeOrderPress}
        total={isOrder ? orderDetails?.totalAmount : totalPrice.toFixed(2)}
        showText={
          <View>
            {orderDetails ? (
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
            ) : (
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'orange'}
                pTop={wp(2)}
                pBottom={wp(2)}
                textAlign={'center'}>
                {'Delivered On:'}
                <FontText
                  name={'lexend-regular'}
                  size={mediumFont}
                  color={'black2'}
                  textAlign={'center'}>
                  {' '}
                  {moment(newDate.setDate(newDate.getDate() + 5)).format(
                    'DD-MM-YYYY',
                  )}
                </FontText>
              </FontText>
            )}
          </View>
        }
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
