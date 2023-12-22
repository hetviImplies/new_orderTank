import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import SvgIcons from '../../assets/SvgIcons';
import {FontText, Button, Loader, NavigationBar, Input} from '../../components';
import {fontSize, iconSize, mediumFont, smallFont, tabIcon} from '../../styles';
import {hp, isIOS, normalize, wp} from '../../styles/responsiveScreen';
import colors from '../../assets/colors';
import {RootScreens} from '../../types/type';
import commonStyle from '../../styles';
import ImageCarousel from '../../components/ImageCarousel';
import {BASE_URL, HISTORY_LIST} from '../../types/data';
import Popup from '../../components/Popup';
import {useSelector} from 'react-redux';
import CompanyDetail from '../../components/CompanyDetail';
import utils from '../../helper/utils';
import {useCompanyRequestMutation} from '../../api/company';

const HomeScreen = ({navigation, showNotification}: any) => {
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const [sendCompanyReq, {isLoading: isProcess}] = useCompanyRequestMutation();

  // const {data: offer, isFetching: isLoading} = useGetOfferQuery(null, {
  //   refetchOnMountOrArgChange: true,
  // });
  // const {data: category, isFetching: isFetching} = useGetCategoryQuery(null, {
  //   refetchOnMountOrArgChange: true,
  // });
  // const {
  //   data: products,
  //   isFetching: isProcessing,
  //   refetch,
  // } = useGetProductQuery(
  //   {user: userInfo?._id, withWishList: true},
  //   {
  //     refetchOnMountOrArgChange: true,
  //   },
  // );
  // const [addWishlist, {isLoading: isLoad}] = useAddWishlistsMutation();
  // const [removeWishlist, {isLoading: isFetch}] = useRemoveWishlistsMutation();

  // const {
  //   data: notificationData,
  //   isFetching: isProcess,
  //   refetch: refetchNotification,
  // } = useGetNotificationQuery(null, {
  //   refetchOnMountOrArgChange: true,
  // });

  const isGuest =
    (userInfo && Object.keys(userInfo).length === 0) || userInfo === undefined;

  const [notification, setNotification] = useState<any>({});
  const [isOpenPopup, setOpenPopup] = useState<boolean>(
    userInfo?.companyCode ? false : true,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [code, setCode] = useState('');

  useEffect(() => {
    setOpenPopup(userInfo?.companyCode ? false : true);
  }, [userInfo]);

  console.log('userInfo?.companyCode', userInfo?.companyCode, userInfo);

  const offerRenderItem = ({item}: any) => {
    return (
      <Image
        source={require('../../assets/images/image.png')}
        style={styles.offerImage}
      />
    );
  };

  const _renderItem = ({item, index}: any) => {
    return (
      <TouchableOpacity
        style={[styles.itemContainer, commonStyle.shadowContainer]}>
        {item.icon}
        <FontText
          name={'lexend-medium'}
          size={smallFont}
          color={'black'}
          pTop={wp(2)}
          textAlign={'center'}>
          {item?.name}
        </FontText>
      </TouchableOpacity>
    );
  };

  const onAddCodePress = () => {
    setIsOpen(true);
  };

  const applyCodePress = async () => {
    let params = {
      companyCode: code,
    };
    const {data, error}: any = await sendCompanyReq(params);
    console.log('DATA', data, error);
    if (!error) {
      setIsOpen(false);
      setCode('');
      utils.showSuccessToast(data.message);
    } else {
      setIsOpen(false);
      setCode('');
      utils.showErrorToast(error.message);
    }
  };

  return (
    <View style={commonStyle.container}>
      {/* <Loader
        loading={
          (filterRef.current?.state?.modalVisible === undefined &&
            isFetching) ||
          isLoading ||
          isProcessing ||
          isProcess ||
          isLoad ||
          isFetch
        }
      /> */}
      <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={{marginHorizontal: wp(2.5)}}
        borderBottomWidth={0}
        left={
          <View style={commonStyle.rowAC}>
            {userInfo && userInfo?.profilePic ? (
              <Image
                source={{uri: `${BASE_URL}/${userInfo?.profilePic}`}}
                style={[styles.avatar]}
              />
            ) : (
              <View style={styles.avatar} />
            )}
          </View>
        }
        center={
          <FontText
            name={'lexend-medium'}
            size={fontSize}
            color={'black'}
            style={{width: '110%'}}
            textAlign={'center'}>
            {'Welcome to a Ordertank'}
          </FontText>
        }
        right={
          <View style={[commonStyle.row]}>
            <TouchableOpacity
              style={commonStyle.iconView}
              onPress={() => navigation.navigate(RootScreens.Notification)}>
              <SvgIcons.Bell width={tabIcon} height={tabIcon} />
              {Object.keys(notification).length !== 0 &&
                !notification?.isRead && <View style={styles.countView} />}
            </TouchableOpacity>
          </View>
        }
      />
      <Modal transparent={true} animationType={'none'} visible={isOpenPopup}>
        <CompanyDetail setOpenPopup={setOpenPopup} />
      </Modal>
      <View>
        <ImageCarousel
          data={[1, 2, 3]}
          dotsLength={[1, 2, 3]?.length}
          renderItem={offerRenderItem}
          itemWidth={wp(70)}
          autoplay={false}
          loop={false}
          inactiveDotOpacity={1}
          inactiveDotScale={0.6}
          dotContainerStyle={{width: wp(1)}}
          containerStyle={styles.paginationContainer}
          dotStyle={styles.paginationDot}
          inactiveDotStyle={styles.paginationIADot}
        />
        <FlatList
          data={HISTORY_LIST}
          renderItem={_renderItem}
          numColumns={2}
          columnWrapperStyle={{justifyContent: 'space-between'}}
          contentContainerStyle={{paddingHorizontal: wp(4), paddingTop: hp(2)}}
        />
        <Button
          bgColor={'orange'}
          style={styles.buttonContainer}
          onPress={onAddCodePress}>
          <FontText name={'lexend-semibold'} size={fontSize} color={'white'}>
            {'Add Supply Code'}
          </FontText>
        </Button>
        <Popup
          visible={isOpen}
          onOpen={() => setIsOpen(true)}
          onBackPress={() => setIsOpen(false)}
          title={'Enter Supplier Code'}
          titleStyle={{textAlign: 'left'}}
          children={
            <Input
              value={code}
              onChangeText={(text: string) => setCode(text)}
              placeholder={''}
              autoCapitalize="none"
              placeholderTextColor={'placeholder'}
              fontSize={fontSize}
              inputStyle={styles.inputText}
              style={styles.input}
              color={'black'}
              returnKeyType={'next'}
              blurOnSubmit
            />
          }
          rightBtnText={'Apply'}
          rightBtnPress={applyCodePress}
          // onTouchPress={() => setIsOpen(false)}
          rightBtnStyle={{width: '100%'}}
        />
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate(RootScreens.Cart)}
        style={styles.floatingButton}>
        <SvgIcons.Buy width={wp(8.5)} height={wp(8.5)} fill={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

// export default withInAppNotification(HomeScreen);
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white2,
  },
  avatar: {
    width: hp(6),
    height: hp(6),
    backgroundColor: colors.gray,
    borderRadius: 10,
    marginRight: wp(3),
  },
  textHeader: {},
  searchContainer: {
    marginHorizontal: wp(4),
    justifyContent: 'space-between',
    marginTop: isIOS ? wp(1.5) : 0,
  },
  inputText: {
    borderRadius: 10,
    paddingLeft: wp(3),
    color: colors.black2,
    fontSize: normalize(14),
    fontFamily: 'lexend-regular',
    backgroundColor: colors.white,
    borderStyle: 'dashed',
    borderWidth: 1,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    height: hp(6),
    marginVertical: hp(1),
  },
  itemContainer: {
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    backgroundColor: colors.white,
    borderRadius: normalize(6),
    marginBottom: hp(2),
    width: '48%',
  },
  icons: {
    width: hp(4),
    height: hp(4),
    resizeMode: 'contain',
  },
  offerImage: {
    width: wp(70),
    height: hp(15),
    borderRadius: normalize(10),
    resizeMode: 'cover',
    alignItems: 'center',
  },
  featureImg: {
    width: hp(10),
    height: hp(10),
    resizeMode: 'contain',
  },
  featureContainer: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp(2),
    marginBottom: hp(1.5),
    borderRadius: 12,
  },
  paginationContainer: {
    paddingTop: hp(1),
    paddingBottom: 0,
  },
  categoryCC: {
    paddingVertical: hp(0.5),
    paddingLeft: wp(4),
  },
  paginationDot: {
    width: hp(2.25),
    height: hp(0.7),
    borderRadius: 17,
    backgroundColor: colors.orange,
  },
  paginationIADot: {
    backgroundColor: colors.orange,
    width: hp(1.2),
    height: hp(1.2),
    borderRadius: hp(1),
  },
  listContainer: {
    backgroundColor: colors.grayOpacity,
    marginTop: hp(2),
    paddingVertical: wp(4),
  },
  product2CC: {
    paddingHorizontal: wp(4),
    paddingTop: hp(1.5),
  },
  btSheetContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  contentRowContainer: {
    marginLeft: wp(4),
    flexDirection: 'row',
    width: '68%',
    justifyContent: 'space-between',
  },
  dropdownView: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(6),
    paddingHorizontal: wp(3),
    width: '80%',
    backgroundColor: colors.white,
  },
  iconView: {
    backgroundColor: colors.white2,
    borderRadius: 12,
    width: hp(6),
    height: hp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: hp(1),
  },
  countView: {
    width: wp(2.5),
    height: wp(2.5),
    backgroundColor: colors.brown,
    borderRadius: wp(10),
    position: 'absolute',
    right: wp(3.2),
    top: wp(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    borderRadius: normalize(6),
    marginHorizontal: wp(6),
    marginTop: hp(3),
  },
  floatingButton: {
    width: hp(8),
    height: hp(8),
    borderRadius: hp(4),
    backgroundColor: colors.orange,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: wp(7),
    right: wp(5),
  },
});
