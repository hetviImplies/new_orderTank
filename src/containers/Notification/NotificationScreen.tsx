import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {colors, SvgIcons} from '../../assets';
import {NavigationBar, FontText, Loader} from '../../components';
import commonStyle, {mediumFont} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {
  useGetNotificationQuery,
  useReadNotificationMutation,
} from '../../api/notification';

const NotificationScreen = ({navigation}: any) => {
  const {data: noitification, isFetching: isProcessing} =
    useGetNotificationQuery(null, {
      refetchOnMountOrArgChange: true,
    });
  const [readNotification, {isLoading: isReadFetch}] =
    useReadNotificationMutation();

  const [notifiedData, setNotifiedData] = useState([]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={[
            // commonStyle.iconView,
            {marginLeft: wp(1)},
          ]}
          onPress={() => {
            if (noitification?.result?.length !== 0) {
              const data = noitification?.result?.map((item: any) => item?._id);
              seenNotification(data);
              navigation.goBack();
            } else {
              navigation.goBack();
            }
          }}>
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

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  const backAction = () => {
    if (noitification?.result?.length !== 0) {
      const data = noitification?.result?.map((item: any) => item?._id);
      seenNotification(data);
      navigation.goBack();
    } else {
      navigation.goBack();
    }
    return true;
  };

  useEffect(() => {
    setNotifiedData(noitification?.result);
  }, [isProcessing]);

  const seenNotification = async (idData: any) => {
    let params: any = {
      ids: idData,
    };
    const {data, error}: any = await readNotification(params);
  };

  const _renderItem = ({item, index}: any) => {
    const originalTimestamp = item?.createdAt;
    const convertedTimestamp = moment(originalTimestamp)
      .utc()
      .format('DD/MM/YYYY, hh:mm A');
    const notiRead = item?.seen ? colors.white : colors.orangeOpacity;
    const shadow = item?.seen && commonStyle.shadowContainer;
    return (
      <View style={[styles.itemContainer, shadow, {backgroundColor: notiRead}]}>
        <View style={{width: '100%'}}>
          <FontText
            color="gray3"
            name="lexend-regular"
            size={normalize(10)}
            textAlign={'right'}>
            {convertedTimestamp}
          </FontText>
          <FontText
            color="black2"
            name="lexend-regular"
            pTop={hp(0.5)}
            size={normalize(13)}
            pBottom={hp(0.5)}
            textAlign={'left'}>
            {item?.title}
          </FontText>
        </View>
      </View>
    );
  };

  return (
    <View style={commonStyle.container}>
      <Loader loading={isProcessing} />
      {/* <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2)}}
        borderBottomWidth={0}
        left={
          <View style={[commonStyle.rowAC, {paddingLeft: wp(1)}]}>
            <TouchableOpacity
              style={[commonStyle.iconView, {marginRight: wp(5)}]}
              onPress={() => navigation.goBack()}>
              <SvgIcons.BackArrow />
            </TouchableOpacity>
            <FontText
              color="black2"
              name="lexend-semibold"
              size={mediumLargeFont}
              textAlign={'center'}>
              {'Notification'}
            </FontText>
          </View>
        }
      /> */}
      {notifiedData && notifiedData.length !== 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={notifiedData}
          renderItem={_renderItem}
          contentContainerStyle={{paddingTop: wp(3)}}
          // refreshControl={
          //   <RefreshControl refreshing={refresh} onRefresh={_onRefresh} />
          // }
        />
      ) : (
        <View style={[commonStyle.allCenter, {flex: 1}]}>
          <FontText
            color="gray"
            name="lexend-regular"
            size={mediumFont}
            textAlign={'center'}>
            {'You don’t have any notifications yet.'}
          </FontText>
        </View>
      )}
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  iconView: {
    backgroundColor: colors.brownOpacity,
    borderRadius: 8,
    width: hp(5),
    height: hp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    paddingVertical: wp(3),
    paddingHorizontal: wp(4),
    marginHorizontal: wp(4),
    marginBottom: hp(2.5),
    borderRadius: normalize(10),
  },
});
