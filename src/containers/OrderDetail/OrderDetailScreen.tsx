import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import commonStyle, {
  fontSize,
  mediumFont,
  mediumLargeFont,
  smallFont,
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

const labels = ['Ordered', 'Shipped', 'Out For Delivery', 'Delivered'];
const customStyles = {
  stepIndicatorSize: 30,
  currentStepIndicatorSize: 30,
  separatorStrokeWidth: 3,
  currentStepStrokeWidth: 5,
  stepStrokeCurrentColor: colors.brown,
  separatorFinishedColor: colors.brown,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#aaaaaa',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 15,
  currentStepIndicatorLabelFontSize: 15,
  stepIndicatorLabelCurrentColor: '#000000',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: 'rgba(255,255,255,0.5)',
  labelColor: '#666666',
  labelSize: 15,
  currentStepLabelColor: '#fe7013',
};

const OrderDetailScreen = ({navigation, route}: any) => {
  const item = route?.params && route?.params?.data?.item;
  const product = route?.params && route?.params?.data?.product;

  const [cancelOrder, {isLoading: isFetching}] = useDeleteOrderMutation();

  const [currentPosition, setCurrentPosition] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    item?.shipped?.createdAt && setCurrentPosition(1);
    item?.outForDelivery?.createdAt && setCurrentPosition(2);
    item?.delivered?.createdAt && setCurrentPosition(3);
  }, [item]);

  const renderContent = (index: any) => {
    switch (index) {
      case 0:
        return moment(item?.ordered?.createdAt).format('MMM DD, YYYY hh:mm A');
      case 1:
        return item?.shipped?.createdAt
          ? moment(item?.shipped?.createdAt).format('MMM DD, YYYY hh:mm A')
          : moment(item?.shipped?.expectedDate).format('MMM DD, YYYY hh:mm A');
      case 2:
        return item?.outForDelivery?.createdAt
          ? moment(item?.outForDelivery?.createdAt).format(
              'MMM DD, YYYY hh:mm A',
            )
          : moment(item?.outForDelivery?.expectedDate).format(
              'MMM DD, YYYY hh:mm A',
            );
      case 3:
        return item?.delivered?.createdAt
          ? moment(item?.delivered?.createdAt).format('MMM DD, YYYY hh:mm A')
          : moment(item?.delivered?.expectedDate).format(
              'MMM DD, YYYY hh:mm A',
            );
      default:
        return;
    }
  };

  const _renderItem = ({position, stepStatus, label, currentPosition}: any) => {
    return (
      <View
        style={[
          commonStyle.marginH2,
          {
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
          },
        ]}>
        <FontText
          color="black2"
          name="opensans-semibold"
          size={mediumFont}
          pBottom={wp(1)}
          textAlign={'left'}>
          {label}
        </FontText>
        <FontText
          color="gray"
          name="opensans-medium"
          size={mediumFont}
          textAlign={'left'}>
          {renderContent(position)}
        </FontText>
      </View>
    );
  };

  const cancelOrderHandler = () => {
    setIsOpen(true);
  };

  const notCancelPress = () => {
    setIsOpen(false);
  };

  const cancelPress = async() => {
    const {data, error}: any = await cancelOrder({id: item._id});
    if (data && data.statusCode === 200) {
      utils.showSuccessToast('Order cancelled Successfully.');
      navigation.goBack();
    }
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
        center={
          <FontText
            color="black2"
            name="opensans-semibold"
            size={mediumLargeFont}
            textAlign={'center'}>
            {'Order Detail'}
          </FontText>
        }
        left={
          <TouchableOpacity
            style={commonStyle.iconView}
            onPress={() => navigation.goBack()}>
            <SvgIcons.BackIcon />
          </TouchableOpacity>
        }
      />
      {/* <Loader loading={isFetching} />
      <View
        style={[
          commonStyle.marginT2,
          commonStyle.shadowContainer,
          styles.radiusContainer,
        ]}>
        <View style={[styles.itemContainer]}>
          <Image
            source={{uri: `${BASE_URL}/${product?.productId?.thumbnail}`}}
            style={[styles.featureImg]}
          />
          <View style={styles.contentRowContainer}>
            <View>
              <FontText
                color="black2"
                name="opensans-semibold"
                size={mediumFont}
                pBottom={hp(1)}
                textAlign={'left'}>
                {product?.productId?.productName}
              </FontText>
              <FontText
                color="brown"
                name="opensans-bold"
                size={mediumLargeFont}
                pBottom={hp(1)}
                textAlign={'left'}>
                {'$'}
                {product?.productId?.price}
              </FontText>
              <FontText
                color="gray2"
                name="opensans-semibold"
                size={smallFont}
                textAlign={'left'}>
                {moment(item?.createdAt).format('MMM DD,YYYY hh:mm A')}
              </FontText>
            </View>
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.indicator}>
          <StepIndicator
            customStyles={customStyles}
            currentPosition={currentPosition}
            labels={labels}
            direction="vertical"
            stepCount={4}
            renderLabel={_renderItem}
            renderStepIndicator={val => {
              return (
                <View
                  style={{
                    backgroundColor:
                      val?.stepStatus === 'unfinished'
                        ? colors.gray
                        : colors.brown,
                    padding: hp(2),
                  }}>
                  {val?.stepStatus !== 'unfinished' && (
                    <SvgIcons.Check
                      fill={colors.white}
                      width={wp(3)}
                      height={wp(3)}
                    />
                  )}
                </View>
              );
            }}
          />
        </View>
      </View>
      <Popup
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
      )} */}
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
