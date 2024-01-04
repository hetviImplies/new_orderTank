import {FlatList, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationBar, FontText, Loader} from '../../components';
import commonStyle, {
  mediumFont,
  mediumLargeFont,
  smallFont,
} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {ORDERTYPE} from '../../types/data';
import colors from '../../assets/colors';
import SvgIcons from '../../assets/SvgIcons';
import {useGetOrdersQuery} from '../../api/order';
import {RootScreens} from '../../types/type';
import moment from 'moment';
import AddressComponent from '../../components/AddressComponent';
import {useFocusEffect} from '@react-navigation/native';

const OrderScreen = ({navigation}: any) => {
  const [selectOrder, setSelectOrder] = React.useState<any>({
    label: 'All Order',
    value: 'all',
  });
  const [orderData, setOrderData] = React.useState([]);

  const {
    data: orderList,
    isFetching: isProcess,
    refetch,
  } = useGetOrdersQuery(
    {
      isBuyer: true,
      status: selectOrder?.value === 'all' ? '' : selectOrder?.value,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, []),
  );

  useEffect(() => {
    setOrderData(orderList?.result);
  }, [isProcess, selectOrder]);

  const onViewDetail = (item: any) => {
    navigation.navigate(RootScreens.SecureCheckout, {
      from: RootScreens.Order,
      deliveryAdd: item?.deliveryAddress,
      billingAdd: item?.billingAddress,
      orderDetails: item,
      name: 'Order Details',
    });
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <View
        style={[
          commonStyle.marginT2,
          commonStyle.shadowContainer,
          {
            backgroundColor: colors.white,
            borderRadius: normalize(10),
            paddingVertical:hp(1.5)
          },
        ]}>
        <View style={[commonStyle.rowJB, commonStyle.paddingH4]}>
          <View>
            <FontText
              color={'black2'}
              size={smallFont}
              textAlign={'left'}
              name={'lexend-regular'}>
              {item?.orderId}
            </FontText>
            <FontText
              color={'gray'}
              size={smallFont}
              textAlign={'left'}
              name={'lexend-regular'}>
              {moment(item?.orderDate).format('DD-MM-YYYY')}
            </FontText>
          </View>
          <FontText
            color={'orange'}
            size={smallFont}
            textAlign={'right'}
            name={'lexend-medium'}>
            {'$'}
            {item?.totalAmount}
          </FontText>
        </View>
        <View style={[styles.dashedLine]} />
        <View style={[{marginTop: hp(1), paddingHorizontal:wp(2)}]}>
          <AddressComponent
            item={item?.deliveryAddress}
            from={RootScreens.SecureCheckout}
          />
        </View>
        <View style={[styles.dashedLine]} />
        <View
          style={[commonStyle.rowJB, styles.paddingT1, commonStyle.paddingH4]}>
          <FontText
            color={
              item?.status === 'pending' || item?.status === 'cancelled'
                ? 'red'
                : item?.status === 'delivered'
                ? 'green'
                : item?.status === 'processing'
                ? 'yellow'
                : 'black'
            }
            size={smallFont}
            textAlign={'left'}
            name={'lexend-medium'}>
            {item?.status}
          </FontText>
          <TouchableOpacity onPress={() => onViewDetail(item)}>
            <FontText
              color={'orange'}
              size={smallFont}
              textAlign={'left'}
              style={{textDecorationLine: 'underline'}}
              name={'lexend-medium'}>
              {'View detail'}
            </FontText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={commonStyle.container}>
      {/* <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2)}}
        borderBottomWidth={0}
        left={
          <FontText
            name={'lexend-semibold'}
            size={mediumLargeFont}
            color={'black'}
            textAlign={'center'}>
            {'Order'}
          </FontText>
        }
      /> */}
      <Loader loading={isProcess} />
      <View style={commonStyle.paddingH4}>
        <FlatList
          horizontal
          data={ORDERTYPE}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{marginHorizontal: wp(-1), paddingTop:hp(1)}}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectOrder(item);
                  // getorderData(item);
                }}
                key={index}
                activeOpacity={0.7}
                style={styles.talkBubble}>
                <View
                  style={
                    selectOrder?.label === item?.label
                      ? styles.talkBubbleSquare
                      : styles.blankSquare
                  }>
                  <FontText
                    color={
                      selectOrder?.label === item?.label ? 'white' : 'black2'
                    }
                    size={mediumFont}
                    textAlign={'center'}
                    name={'lexend-regular'}>
                    {item?.label}{' '}
                    {selectOrder?.label === item?.label
                      ? orderList?.result?.length === undefined
                        ? ''
                        : `(${orderList?.result?.length})`
                      : ''}
                  </FontText>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      {orderData && orderData.length !== 0 ? (
        <FlatList
          data={orderData}
          renderItem={_renderItem}
          contentContainerStyle={{
            paddingHorizontal: wp(4),
            paddingBottom: hp(2),
          }}
        />
      ) : (
        <View style={[commonStyle.allCenter, {flex: 1}]}>
          <FontText
            color="gray"
            name="lexend-regular"
            size={mediumFont}
            textAlign={'center'}>
            {'No Data found.'}
          </FontText>
        </View>
      )}
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  talkBubble: {
    backgroundColor: 'transparent',
    marginHorizontal: wp(1.5),
  },
  talkBubbleSquare: {
    paddingHorizontal: wp(4),
    paddingVertical: wp(3.2),
    backgroundColor: colors.orange,
    borderRadius: normalize(10),
  },
  blankSquare: {
    paddingHorizontal: wp(4),
    paddingVertical: wp(3),
    borderWidth: 1,
    borderColor: colors.black2,
    borderRadius: normalize(10),
  },
  dashedLine: {
    marginTop: wp(1.5),
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'dashed',
  },
  paddingT1: {
    paddingTop: hp(1.5),
  },
});
