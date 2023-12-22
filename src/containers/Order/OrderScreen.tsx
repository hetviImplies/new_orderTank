import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {NavigationBar, FontText} from '../../components';
import commonStyle, {
  fontSize,
  iconSize,
  mediumFont,
  mediumLargeFont,
  smallFont,
} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {ORDERTYPE} from '../../types/data';
import colors from '../../assets/colors';
import SvgIcons from '../../assets/SvgIcons';

const OrderScreen = () => {
  const [selectshift, setSelectShift] = React.useState('All Order');

  return (
    <View style={commonStyle.container}>
      <NavigationBar
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
            {'Profile'}
          </FontText>
        }
      />
      <View style={commonStyle.paddingH4}>
        <FlatList
          horizontal
          data={ORDERTYPE}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{marginHorizontal: wp(-1)}}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  setSelectShift(item);
                  // getShiftData(item);
                }}
                key={index}
                activeOpacity={0.7}
                style={styles.talkBubble}>
                <View
                  style={
                    selectshift === item
                      ? styles.talkBubbleSquare
                      : styles.blankSquare
                  }>
                  <FontText
                    color={selectshift === item ? 'white' : 'black2'}
                    size={mediumFont}
                    textAlign={'center'}
                    name={'lexend-regular'}>
                    {item}
                  </FontText>
                </View>
              </TouchableOpacity>
            );
          }}
        />
        <View
          style={[
            commonStyle.marginT2,
            commonStyle.shadowContainer,
            {
              backgroundColor: colors.white,
              padding: wp(4),
              borderRadius: normalize(10),
            },
          ]}>
          <View style={[commonStyle.rowJB, styles.dashedLine]}>
            <View>
              <FontText
                color={'black2'}
                size={smallFont}
                textAlign={'left'}
                name={'lexend-regular'}>
                {'#12541RFG'}
              </FontText>
              <FontText
                color={'gray'}
                size={smallFont}
                textAlign={'left'}
                name={'lexend-regular'}>
                {'20-04-2023, 11:48 AM'}
              </FontText>
            </View>
            <FontText
              color={'orange'}
              size={smallFont}
              textAlign={'right'}
              name={'lexend-medium'}>
              {'₹900'}
            </FontText>
          </View>
          <View style={[styles.dashedLine, styles.paddingT1]}>
            <View style={commonStyle.row}>
              <SvgIcons.Employee />
              <FontText
                color={'black2'}
                size={smallFont}
                textAlign={'left'}
                pLeft={wp(3)}
                name={'lexend-regular'}>
                {'Company'}
              </FontText>
            </View>
            <FontText
              color={'gray4'}
              size={smallFont}
              textAlign={'left'}
              pTop={wp(1)}
              name={'lexend-regular'}>
              {
                'Shop No 1,28/c, Shanti Sadan, Lokhandwala Rd, Nr Sasural Restaurant, Bangalore-560016'
              }
            </FontText>
          </View>
          <View style={[commonStyle.rowJB, styles.paddingT1]}>
            <FontText
              color={'red'}
              size={smallFont}
              textAlign={'left'}
              name={'lexend-medium'}>
              {'Pending'}
            </FontText>
            <FontText
              color={'orange'}
              size={smallFont}
              textAlign={'left'}
              style={{textDecorationLine: 'underline'}}
              name={'lexend-medium'}>
              {'View detail'}
            </FontText>
          </View>
        </View>
      </View>

      {/* <View style={{flex: 1}}>
        {selectshift == 'Assigned' ? (
          <Assigned
            onRejectPress={(item) => onRejectPress(item)}
            AssignData={shiftData}
            navigation={navigation}
            refresh={refresh}
            onRefresh={() => onRefresh()}
            getQrCodeData={(val, item) => getQrCodeData(val, item)}
            onHubPress={(val) => onHubPress(val)}
            onArrivedHubPress={(date, item, isStart) => {
              onArrivedHubPress(date, item, isStart);
            }}
            from={'Assigned'}
            shiftStartData={shiftStartData}
            setShiftStartData={setShiftStartData}
          />
        ) : selectshift == 'Started' ? (
          <Started
            onCompletePress={(item) => onCompletePress(item)}
            StartedData={shiftData}
            navigation={navigation}
            refresh={refresh}
            onRefresh={() => onRefresh()}
            onHubPress={(val) => onHubPress(val)}
          />
        ) : selectshift == 'Completed' ? (
          <Completed
            onCompletePress={(item) =>
              navigation.navigate(ROUTE_NAMES.SHIFTDETAIL, {
                From: 'Completed',
                shiftData: item,
                onGoBack: () => {},
              })
            }
            setshiftData={setshiftData}
            CompletedData={shiftData}
            navigation={navigation}
            refresh={refresh}
            onRefresh={() => onRefresh()}
            onHubPress={(val) => onHubPress(val)}
          />
        ) : (
          <Paid
            onPaidPress={(item) =>
              navigation.navigate(ROUTE_NAMES.SHIFTDETAIL, {
                From: 'Paid',
                shiftData: item,
                onGoBack: () => {},
              })
            }
            paidData={shiftData}
            navigation={navigation}
            refresh={refresh}
            onRefresh={() => onRefresh()}
            onHubPress={(val) => onHubPress(val)}
          />
        )}
      </View> */}
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
    paddingVertical: wp(3),
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
    paddingBottom: hp(1.5),
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    borderStyle: 'dashed',
  },
  paddingT1: {
    paddingTop: hp(1.5),
  },
});
