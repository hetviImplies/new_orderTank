import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  BackHandler,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import moment from 'moment';
import {colors, SvgIcons} from '../../assets';
import {NavigationBar, FontText, Loader} from '../../components';
import commonStyle, {iconSize, mediumFont, mediumLargeFont, smallFont} from '../../styles';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {
  useGetNotificationQuery,
  useReadNotificationMutation,
} from '../../api/notification';
import { RootScreens } from '../../types/type';

const NotificationScreen = ({navigation}: any) => {
  const {
    data: noitification,
    isFetching: isProcessing,
    refetch,
  } = useGetNotificationQuery(null, {
    refetchOnMountOrArgChange: true,
  });
  const [readNotification, isLoading] = useReadNotificationMutation();

  const [notifiedData, setNotifiedData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  React.useLayoutEffect(() => {
    // *******************************  Hetvi ********************************
    navigation.setOptions({
      headerStyle: {
        backgroundColor: colors.orange,
      },
      headerLeft: () => (
        <View
          style={[
            commonStyle.rowAC,
            {marginLeft: wp(4), flexDirection: 'row'},
          ]}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderRadius: 50,
              padding: 7,
              marginRight: wp(4),
              borderColor: colors.yellow3,
            }}
            // style={commonStyle.iconView}
            onPress={() => {
                        if (noitification?.result?.length !== 0) {
                          const data = noitification?.result?.map((item: any) => item?.id);
                          seenNotification(data);
                          navigation.goBack();
                        } else {
                          navigation.goBack();
                        }
                      }}>
            <SvgIcons.Back_Arrow width={iconSize} height={iconSize} />
          </TouchableOpacity>
          <FontText
            name={'mont-semibold'}
            size={mediumLargeFont}
            color={'white'}>
            Notifications
          </FontText>
        </View>
      )
    });
  }, [navigation]);

  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerLeft: () => (
  //       <TouchableOpacity
  //         style={[
  //           // commonStyle.iconView,
  //           {marginLeft: wp(1)},
  //         ]}
  //         onPress={() => {
  //           if (noitification?.result?.length !== 0) {
  //             const data = noitification?.result?.map((item: any) => item?.id);
  //             seenNotification(data);
  //             navigation.goBack();
  //           } else {
  //             navigation.goBack();
  //           }
  //         }}>
  //         {Platform.OS === 'android' ? (
  //           <SvgIcons.AndroidBack
  //             width={wp(6)}
  //             height={wp(6)}
  //             style={{marginLeft: wp(2)}}
  //           />
  //         ) : (
  //           <SvgIcons.BackArrow
  //             width={wp(5)}
  //             height={wp(5)}
  //             fill={colors.blue2}
  //             stroke={colors.blue2}
  //           />
  //         )}
  //       </TouchableOpacity>
  //     ),
  //   });
  // }, [navigation]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, []);

  const backAction = () => {
    if (noitification?.result?.length !== 0) {
      const data = noitification?.result?.map((item: any) => item?.id);
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
    // let params: any = {
    //   ids: idData,
    // };
    const {data, error}: any = await readNotification(null);
  };

  const _renderItem = ({item, index}: any) => {
    const originalTimestamp = item?.createdAt;
    const convertedTimestamp = moment(originalTimestamp).format(
      'DD-MM-YYYY, hh:mm A',
    );
    const notiRead = item?.isSeen ? 'rgba(200, 207, 209, 0.3)' : colors.orangeOpacity;
    const shadow = item?.isSeen && commonStyle.shadowContainer;
    return (
      // <View style={[styles.itemContainer, shadow, {backgroundColor: notiRead}]}>
      //   <View style={{width: '100%'}}>
      //     <FontText
      //       color="gray3"
      //       name="lexend-regular"
      //       size={normalize(10)}
      //       textAlign={'right'}>
      //       {convertedTimestamp}
      //     </FontText>
      //     <FontText
      //       color="black2"
      //       name="lexend-regular"
      //       pTop={hp(0.5)}
      //       size={normalize(13)}
      //       pBottom={hp(0.5)}
      //       textAlign={'left'}>
      //       {item?.title}
      //     </FontText>
      //   </View>
      // </View>
      <View
        style={[{
          marginHorizontal:wp(4),
          marginVertical:wp(1),
          backgroundColor: notiRead,
          borderWidth:1,
          padding: wp(3),
          borderColor:colors.orange,
          borderStyle:"dashed",
          borderRadius:normalize(15)
        }]}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View style={{flex: 1}}>
            <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <FontText
              name="mont-semibold"
              color={'black2'}
              style={{textTransform: 'capitalize'}}
              size={smallFont}>
              {item?.title}
            </FontText>
            <FontText
                pTop={wp(0.5)}
                color={'darkGray'}
                name="mont-medium"
                size={smallFont}
                pLeft={wp(2)}>
                {convertedTimestamp}
              </FontText>
            </View>
            <FontText
              name="mont-medium"
              color={'gray7'}
              style={{textTransform: 'capitalize'}}
              pTop={wp(1)}
              size={smallFont}>
              {item?.description}
            </FontText>
          </View>
        </View>
      </View>
    );
  };

  const onRefreshing = () => {
    setRefreshing(true);
    refetch();
    setRefreshing(false);
  };

  const _sepratorView = () => {
    return <View style={styles.itemSeprator}></View>;
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
        style={{marginVertical:wp(1)}}
          showsVerticalScrollIndicator={false}
          data={notifiedData}
          renderItem={_renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefreshing} />
          }
        />
      ) : (
        <View style={[commonStyle.allCenter, {flex: 1}]}>
          <FontText
            color="gray"
            name="mont-medium"
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
  itemSeprator: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#F5F5F5',
    alignSelf: 'center',
  },
});

