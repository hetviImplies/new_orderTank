import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import commonStyle, {
  fontSize,
  mediumFont,
  mediumLargeFont,
  smallFont,
  tabIcon,
} from '../../styles';
import {Button, FontText, Loader, NavigationBar} from '../../components';
import SvgIcons from '../../assets/SvgIcons';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import moment from 'moment';
import colors from '../../assets/colors';
// import StepIndicator from 'react-native-step-indicator';
import {BASE_URL} from '../../types/data';
import {useDeleteOrderMutation} from '../../api/order';
import utils from '../../helper/utils';
import Popup from '../../components/Popup';

const OrderDetailScreen = ({navigation, route}: any) => {
  // const item = route?.params && route?.params?.data?.item;
  // const product = route?.params && route?.params?.data?.product;

  const [cancelOrder, {isLoading: isFetching}] = useDeleteOrderMutation();

  const [currentPosition, setCurrentPosition] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   item?.shipped?.createdAt && setCurrentPosition(1);
  //   item?.outForDelivery?.createdAt && setCurrentPosition(2);
  //   item?.delivered?.createdAt && setCurrentPosition(3);
  // }, [item]);

  const cancelOrderHandler = () => {
    setIsOpen(true);
  };

  const notCancelPress = () => {
    setIsOpen(false);
  };

  const cancelPress = async () => {
    // const {data, error}: any = await cancelOrder({id: item._id});
    // if (data && data.statusCode === 200) {
    //   utils.showSuccessToast('Order cancelled Successfully.');
    //   navigation.goBack();
    // }
  };

  return (
    <View style={commonStyle.container}>
      {/* <Loader loading={isProcessing} /> */}
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
              {'Order detail'}
            </FontText>
          </View>
        }
      />
      <View style={commonStyle.paddingH4}>
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
            {'20-04-2023, 11:48 AM'}
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
            {'#12541RFG'}
          </FontText>
        </FontText>

      </View>
      {/* <Popup
        visible={isOpen}
        onOpen={() => setIsOpen(true)}
        onBackPress={() => setIsOpen(false)}
        title={'Cancel Order'}
        description={'Are you sure you want to cancel this Order?'}
        leftBtnText={'No'}
        rightBtnText={'Yes'}
        leftBtnPress={notCancelPress}
        rightBtnPress={cancelPress}
        onTouchPress={() => setIsOpen(false)}
      />
      {!item?.outForDelivery?.createdAt && !item?.delivered?.createdAt && (
        <Button
          onPress={cancelOrderHandler}
          bgColor={'brown'}
          style={[styles.buttonContainer]}>
          <FontText name={'opensans-semibold'} size={fontSize} color={'white'}>
            {'Cancel Order'}
          </FontText>
        </Button>
      )}  */}
    </View>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  featureImg: {
    width: hp(10),
    height: hp(10),
    resizeMode: 'contain',
  },
  radiusContainer: {
    backgroundColor: colors.white,
    marginHorizontal: wp(4),
    borderRadius: 12,
    height: '60%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
    marginBottom: hp(1.5),
    marginTop: hp(0.5),
  },
  contentRowContainer: {
    marginLeft: wp(4),
    flexDirection: 'row',
    width: '68%',
    justifyContent: 'space-between',
  },
  line: {
    borderColor: colors.gray,
    borderWidth: 0.5,
    margin: hp(1),
  },
  indicator: {
    paddingHorizontal: wp(4),
    flexDirection: 'row',
    height: '70%',
    width: '100%',
  },
  buttonContainer: {
    borderRadius: 12,
    width: '65%',
    alignSelf: 'center',
    marginBottom: hp(2.5),
    marginTop: hp(5),
  },
});
