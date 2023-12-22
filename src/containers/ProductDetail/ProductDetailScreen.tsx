import {
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../assets/colors';
import {hp, isIOS, normalize, wp} from '../../styles/responsiveScreen';
import {Button, FontText, Loader, NavigationBar} from '../../components';
import {
  fontSize,
  iconSize,
  mediumFont,
  mediumLarge1Font,
  mediumLarge2Font,
  mediumLargeFont,
  smallFont,
} from '../../styles';
import SvgIcons from '../../assets/SvgIcons';
// import {AirbnbRating} from 'react-native-ratings';
import {RootScreens} from '../../types/type';
import {useGetAllProductsQuery, useGetOneProductQuery} from '../../api/product';
import ImageCarousel from '../../components/ImageCarousel';
import WatchList from '../../components/WatchList';
import ListHeader from '../../components/ListHeader';
import commonStyle from '../../styles';
// import ImageViewer from 'react-native-image-zoom-viewer';
// import {Pagination} from 'react-native-snap-carousel';
import {BASE_URL} from '../../types/data';
import {useAddCartMutation, useGetCartsQuery} from '../../api/cart';
import {useSelector} from 'react-redux';
import {
  useAddWishlistsMutation,
  useRemoveWishlistsMutation,
} from '../../api/wishlist';
import utils from '../../helper/utils';

const ProductDetailScreen = ({navigation, route}: any) => {
  const item = route.params.data;
  const userInfo = useSelector((state: any) => state.auth.userInfo);
  const {data: product, isFetching: isProcessing} = useGetOneProductQuery(
    {isBuyer: true, id: item?._id},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const {data: productList, isFetching: isProcess} = useGetAllProductsQuery(
    {isBuyer: true, companyId: item?._id},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const productDetail = product?.result;
  console.log('product', productDetail);
  // console.log('product',item)
  // const {data: carts, isFetching: isLoad} = useGetCartsQuery(null, {
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
  // const {
  //   data,
  //   isFetching: isFetch,
  //   refetch: refetchProduct,
  // } = useGetOneProductQuery(
  //   {user: userInfo?._id, id: product?._id, withWishList: true},
  //   {
  //     refetchOnMountOrArgChange: true,
  //   },
  // );
  // const [addWishlist, {isLoading: isProcess}] = useAddWishlistsMutation();
  // const [removeWishlist, {isLoading: isFetching}] =
  //   useRemoveWishlistsMutation();

  // const [productData, setProductData] = useState([]);
  // const [productDetail, setProductDetail] = useState<any>({});
  // const [modalVisible, setModalVisible] = useState(false);
  // const [addToCart, {isLoading}] = useAddCartMutation();

  // const isGuest =
  //   (userInfo && Object.keys(userInfo).length === 0) || userInfo === undefined;

  // useEffect(() => {
  //   setProductData(products?.result?.data);
  // }, [isProcessing]);

  // useEffect(() => {
  //   setProductDetail(data?.result);
  // }, [isFetch, data]);

  // const productPress = (data: any) => {
  //   navigation.navigate(RootScreens.ProductDetail, {item: data});
  // };

  // const offerRenderItem = ({item}: any) => {
  //   return (
  //     <Pressable onPress={() => setModalVisible(!modalVisible)}>
  //       <Image
  //         source={{
  //           uri: `${BASE_URL}/${item}`,
  //         }}
  //         style={styles.offerImage}
  //       />
  //     </Pressable>
  //   );
  // };

  // const Indicator = ({currentShowIndex, total}: any) => {
  //   return (
  //     <View
  //       style={{
  //         flexDirection: 'row',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         position: 'absolute',
  //         bottom: 50,
  //         width: '100%',
  //       }}>
  //       <Pagination
  //         dotsLength={total}
  //         activeDotIndex={currentShowIndex - 1}
  //         containerStyle={{width: hp(7)}}
  //         dotStyle={{
  //           width: hp(2),
  //           height: hp(1),
  //           borderRadius: hp(2),
  //           backgroundColor: colors.brown,
  //         }}
  //         inactiveDotStyle={{
  //           backgroundColor: colors.white2,
  //           width: hp(1.5),
  //           height: hp(1.5),
  //           borderRadius: hp(1),
  //         }}
  //         inactiveDotOpacity={0.4}
  //         inactiveDotScale={0.6}
  //       />
  //     </View>
  //   );
  // };

  // const addCart = async (item: any) => {
  //   const {data, error}: any = await addToCart({
  //     productId: item._id,
  //     // quantity: 1,
  //   });
  //   if (!error) {
  //     utils.showSuccessToast('Product added successfully in cart.');
  //   }
  // };

  // const toggleLike = async (item: any) => {
  //   if (item?.isWish) {
  //     const {data, error}: any = await removeWishlist({
  //       product: item._id,
  //     });
  //     data &&
  //       data?.statusCode === 200 &&
  //       utils.showSimpleToast('Removed from Wishlist');
  //     refetchProduct();
  //   } else {
  //     const {data, error}: any = await addWishlist({
  //       product: item._id,
  //     });
  //     data &&
  //       data?.statusCode === 200 &&
  //       utils.showSimpleToast('Item Added in Wishlist');
  //     refetchProduct();
  //   }
  // };

  return (
    <View style={commonStyle.container}>
      <NavigationBar
        hasLeft
        hasRight
        hasCenter
        style={commonStyle.marginH2}
        borderBottomWidth={0}
        left={
          <View style={[commonStyle.rowAC]}>
            <TouchableOpacity
              style={[commonStyle.iconView, {marginRight: wp(5)}]}
              onPress={() => navigation.goBack()}>
              <SvgIcons.BackArrow />
            </TouchableOpacity>
            <FontText
              name={'lexend-semibold'}
              size={mediumLargeFont}
              color={'black'}
              textAlign={'left'}>
              {productDetail?.name}
            </FontText>
          </View>
        }
        right={
          <View style={[commonStyle.rowJB, commonStyle.iconView]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(RootScreens.Cart);
              }}>
              <SvgIcons.Buy width={wp(7)} height={wp(7)} fill={colors.orange} />
              {/* {carts && carts.result && carts.result.totalQuantity ? (
                <View style={styles.countView}>
                  <FontText
                    color="white"
                    name="lexend-bold"
                    size={normalize(10)}
                    textAlign={'center'}>
                    {carts.result.totalQuantity}
                  </FontText>
                </View>
              ) : null} */}
            </TouchableOpacity>
          </View>
        }
      />
      <Loader loading={isProcessing || isProcess} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp(2)}}
        style={[commonStyle.paddingH4]}>
        <Image source={{uri: productDetail?.image}} style={styles.productImg} />
        <View style={commonStyle.marginT2}>
          <FontText
            color="black2"
            name="lexend-medium"
            size={mediumLargeFont}
            textAlign={'left'}>
            {productDetail?.name}
          </FontText>
          <FontText
            name={'lexend-regular'}
            size={mediumLarge2Font}
            pTop={wp(2)}
            color={'orange'}>
            {'$'}
            {productDetail?.price}
          </FontText>
        </View>
        <FontText
          color="orange"
          name="lexend-medium"
          size={mediumFont}
          pTop={hp(4)}
          textAlign={'left'}>
          {'About :-'}
        </FontText>
        <FontText
          color="black3"
          name="lexend-regular"
          size={mediumFont}
          pTop={wp(1.5)}
          pBottom={wp(6)}
          lineHeightFactor={1.3}
          textAlign={'left'}>
          {productDetail?.description}
        </FontText>
        <Button
          // onPress={() => {
          //   isGuest
          //     ? navigation.navigate(RootScreens.Login)
          //     : addCart(productDetail);
          // }}
          bgColor={'orange'}
          style={[styles.buttonContainer, {width: '95%'}]}>
          <FontText name={'lexend-semibold'} size={fontSize} color={'white'}>
            {'Add to cart'}
          </FontText>
        </Button>
        <View style={styles.line} />
        <ListHeader
          leftName={'Related Product'}
          rightPress={() => {
            navigation.navigate(RootScreens.AllProduct, {
              data: {name: 'Similar Watches'},
            });
          }}
        />
        {/* <WatchList
          data={productData && productData.slice(0, 2)}
          productPress={productPress}
          navigation={navigation}
          toggleLike={toggleLike}
        /> */}
      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  iconView: {
    width: '100%',
    paddingVertical: hp(1),
  },
  offerImage: {
    width: wp(44),
    height: wp(44),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  offerContainer: {
    backgroundColor: colors.grayO3,
    alignItems: 'center',
    width: '100%',
    height: wp(42),
    borderRadius: 30,
    position: 'absolute',
  },
  ratingView: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: hp(0.5),
    marginLeft: wp(-1),
  },
  cardContainer: {
    borderRadius: 10,
    backgroundColor: colors.grayOpacity,
    marginTop: hp(2),
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: wp(3),
  },
  columnContainer: {
    width: '30%',
    alignItems: 'center',
  },
  buttonContainer: {
    borderRadius: normalize(6),
    width: '35%',
    alignSelf: 'center',
  },
  buttons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    marginTop: hp(1.5),
  },
  line: {
    borderWidth: 2,
    borderColor: colors.grayOpacity,
    marginVertical: hp(2),
  },
  paginationContainer: {
    // top: isIOS ? wp(-4) : wp(-14),
    top: hp(-1.5),
    paddingBottom: 0,
  },
  paginationDot: {
    width: hp(2.8),
    height: hp(1),
    borderRadius: hp(2),
    backgroundColor: colors.brown,
  },
  paginationIADot: {
    backgroundColor: colors.brown,
    width: hp(1.5),
    height: hp(1.5),
    borderRadius: hp(1),
  },
  countView: {
    width: hp(2.2),
    height: hp(2.2),
    backgroundColor: colors.orange,
    borderRadius: hp(1.5),
    position: 'absolute',
    right: wp(-1),
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImg: {
    width: wp(44),
    height: wp(44),
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: normalize(6),
  },
});
