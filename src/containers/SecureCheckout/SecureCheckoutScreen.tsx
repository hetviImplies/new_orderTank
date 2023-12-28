import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SvgIcons from '../../assets/SvgIcons';
import {NavigationBar, FontText, Loader, Input, Button} from '../../components';
import commonStyle, {
  fontSize,
  iconSize,
  mediumFont,
  mediumLargeFont,
  smallFont,
  tabIcon,
} from '../../styles';
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
import {useSelector} from 'react-redux';
import utils from '../../helper/utils';
import {useRemoveCartMutation} from '../../api/cart';

const SecureCheckoutScreen = ({navigation, route}: any) => {
  const [createOrder, {isLoading}] = useAddOrderMutation();
  const [cancleOrder, {isLoading: isFetching}] = useUpdateOrderStatusMutation();
  const [removeCart, {isLoading: isFetch}] = useRemoveCartMutation();
  const cartData = route.params.data;
  const companyId = route.params.companyId;
  const deliveryAdd = route.params.deliveryAdd;
  const billingAdd = route.params.billingAdd;
  const from = route.params.from;
  const orderDetails = route.params.orderDetails;
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const isOrder = from === RootScreens.Order;
  const product = isOrder ? cartData : cartData?.cart;

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const _renderItem = ({item, index}: any) => {
    console.log('item', item);
    return (
      <>
        <View style={[styles.itemContainer]}>
          <View style={[commonStyle.rowJB, commonStyle.flex]}>
            <Image
              source={{uri: item?.productData?.image}}
              style={styles.logo}
            />
            <View style={{width: '55%'}}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'gray4'}
                textAlign={'left'}>
                {item?.productData?.name}
              </FontText>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                color={'black2'}
                pTop={wp(2)}
                textAlign={'left'}>
                {'$'}
                {item?.productData?.price} ({item?.quantity} qty)
              </FontText>
            </View>
            <View style={{width: '15%'}}>
              <FontText
                name={'lexend-regular'}
                size={mediumFont}
                textAlign={'right'}
                color={'orange'}>
                {'$'}
                {item?.total ? item.total : item?.subtotal}
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
                companyId: companyId,
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
    body = cartData?.cart?.map((item: any, index: any) => {
      return {
        product: item?.productId,
        quantity: item?.quantity,
      };
    });
    ids = cartData?.cart?.map((item: any, index: any) => {
      return item?._id;
    });

    console.log('cartData', ids);
    let params = {
      orderDetails: body,
      notes: notes,
      // approxDeliveryDate: date,
      deliveryAddress: deliveryAdd,
      billingAddress: billingAdd,
      companyId: companyId,
      isBuyer: true,
    };
    console.log('params', JSON.stringify(params));
    const {data: order, error}: any = await createOrder(params);
    console.log('createOrder: ', order, error);
    if (!error && order?.statusCode === 201) {
      const {data, error: err}: any = await removeCart({ids: ids});
      console.log('removeCart: ', data, error);

      if (!err && data?.statusCode === 200) {
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
    console.log('cancelOrder: ', data, error);
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
              {isOrder ? 'Order Detail' : 'Secure Checkout'}
            </FontText>
          </View>
        }
      />
      <Loader loading={isLoading || isFetch || isFetching} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp(2)}}
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
                console.log('cdwoefdko');
                navigation.navigate(RootScreens.Cart, {companyId: companyId});
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
        {/* <View style={styles.addressContainer}>
          <IconHeader label={'Expected date:'} icon={<SvgIcons.Calender />} />
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
        </View> */}
      </ScrollView>
      <CartCountModule
        btnText={isOrder ? 'Cancel Order' : 'Place Order'}
        btnColor={isOrder ? 'red' : 'orange'}
        cartData={cartData}
        orderDetails={orderDetails}
        isShow={isOrder ? orderDetails?.status === 'pending' : true}
        onPress={isOrder ? cancelOrder : placeOrderPress}
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
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          onChange={onChange}
        />
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
});
