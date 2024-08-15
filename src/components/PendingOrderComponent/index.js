import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { normalize, wp, hp } from '../../styles/responsiveScreen';
import { colors, SvgIcons } from '../../assets';
import commonStyle, {iconSize, smallFont, fontSize} from '../../styles';
import { FontText } from '..';
import moment from 'moment';
import { RootScreens } from '../../types/type';
const PendingOrder = ({item,navigation}) => {

  const onViewDetail = (item: any) => {
    navigation.navigate(RootScreens.SecureCheckout, {
      from: RootScreens.Order,
      deliveryAdd: item?.deliveryAddress,
      billingAdd: item?.billingAddress,
      orderDetails: item,
      notes: item?.notes,
      name: 'Order Details',
      expectedDate: item?.approxDeliveryDate,
      nav: 'Home',
    });
  };

    return (
        <TouchableOpacity
        onPress={() => onViewDetail(item)}
          key={item?.orderId}
          >
          <View style={[
            // commonStyle.shadowContainer,
            {
              backgroundColor: colors.orange2,
              borderRadius: normalize(10),
              paddingVertical: hp(1.5),
              marginBottom: hp(1.5),
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: colors.orange,
              justifyContent: 'space-between',
            },
          ]}>
          <View style={[commonStyle.rowJB, commonStyle.paddingH4]}>
            <View>
              <FontText
                color={'black2'}
                size={smallFont}
                textAlign={'left'}
                name={'mont-semibold'}>
                {item?.orderId}
              </FontText>
              <FontText
                color={'darkGray'}
                size={smallFont}
                textAlign={'left'}
                name={'mont-medium'}>
                {item?.company?.companyName}
              </FontText>
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: wp(26),
                  justifyContent: 'space-between',
                }}>
                <SvgIcons.Caledar_1 width={iconSize} height={iconSize} />
                <FontText
                  color={'darkGray'}
                  size={smallFont}
                  textAlign={'left'}
                  name={'mont-medium'}>
                  {item?.orderDate
                    ? moment(item?.orderDate).format('DD/MM/YYYY')
                    : moment(item?.approxDeliveryDate).format('DD/MM/YYYY')}
                </FontText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: wp(26),
                  justifyContent: 'space-between',
                }}>
                <SvgIcons.Caledar_2 width={iconSize} height={iconSize} />
                <FontText
                  color={'darkGray'}
                  size={smallFont}
                  textAlign={'right'}
                  name={'mont-medium'}>
                  {moment(item?.approxDeliveryDate).format('DD/MM/YYYY')}
                </FontText>
              </View>
            </View>
          </View>
          {/* ************************** Address *************************** */}
          {/* <View style={[styles.dashedLine]} /> */}
          {/* <View style={[{marginTop: hp(1), paddingHorizontal: wp(2)}]}>
            <AddressComponent
              item={item?.deliveryAddress}
              from={RootScreens.SecureCheckout}
            />
          </View> */}
          <View style={[styles.dashedLine]} />
          <View
            style={[commonStyle.rowJB, styles.paddingT1, commonStyle.paddingH4]}>
            <FontText
              color={'orange'}
              size={fontSize}
              textAlign={'right'}
              name={'mont-bold'}>
              {'₹'}
              {Number(item?.totalAmount).toFixed(2)}
            </FontText>
            <View
              style={{
                borderWidth: 0,
                borderRadius: 5,
                height: hp(3.5),
                width: wp(20),
                backgroundColor: item?.status === 'pending'
                    ? colors.yellow1
                    : item?.status === 'cancelled'
                    ? colors.red3
                    : item?.status === 'delivered'
                    ? colors.green1
                    : item?.status === 'processing'
                    ? colors.orange3
                    : colors.gray5,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <FontText
                color={
                  item?.status === 'pending'
                    ? 'yellow2'
                    : item?.status === 'cancelled'
                    ? 'red'
                    : item?.status === 'delivered'
                    ? 'green'
                    : item?.status === 'processing'
                    ? 'orange'
                    : 'tabGray1'
                }
                size={smallFont}
                textAlign={'left'}
                name={'mont-bold'}>
                {item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1)}
              </FontText>
            </View>
            {/* ************************** View Details *************************** */}
            {/* <TouchableOpacity onPress={() => onViewDetail(item)}>
              <FontText
                color={'orange'}
                size={smallFont}
                textAlign={'left'}
                style={{textDecorationLine: 'underline'}}
                name={'lexend-medium'}>
                {'View detail'}
              </FontText>
            </TouchableOpacity> */}
          </View>
          </View>
        </TouchableOpacity>
      );
}

export default PendingOrder

const styles = StyleSheet.create({
    dashedLine: {
    marginTop: wp(1),
    borderTopWidth: 1,
    borderColor: colors.orange3,
    marginHorizontal: wp(3),
  },
  paddingT1: {
    paddingTop: hp(1),
  },
})