import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {colors, Images, SvgIcons} from '../../assets';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {
  Button,
  FontText,
  Loader,
  NavigationBar,
  ProductComponent,
  ListHeader,
} from '../../components';
import commonStyle, {
  fontSize,
  largeFont,
  mediumFont,
  mediumLarge2Font,
  mediumLargeFont,
} from '../../styles';
import {RootScreens} from '../../types/type';
import {useGetAllProductsQuery, useGetOneProductQuery} from '../../api/product';
import {useAddCartMutation, useGetCartsQuery} from '../../api/cart';
import utils from '../../helper/utils';
import {useFocusEffect} from '@react-navigation/native';
import {
  addToCart,
  decrementCartItem,
  getCartItems,
  incrementCartItem,
} from '../Cart/Carthelper';

const ProductDetailScreen = ({navigation, route}: any) => {
  const item = route.params.data.item;
  const companyId = route.params.data.companyId;
  const cartType = route?.params?.cartType;
  const {data: product, isFetching: isProcessing} = useGetOneProductQuery(
    {id: item?.id},
    {
      refetchOnMountOrArgChange: true,
    },
  );
  const {data: productList, isFetching: isProcess} = useGetAllProductsQuery(
    {
      isBuyer: true,
      companyId: companyId,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );
  // const [addToCart, {isLoading}] = useAddCartMutation();

  const productDetail = product?.result;
  const [productListData, setProductListData] = useState([]);
  const [cartItems, setCartItems] = useState<any>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any>({});

  useEffect(() => {
    setProductListData(productList?.result);
  }, [isProcess]);

  // const addCart = async (item: any) => {
  //   const {data, error}: any = await addToCart({
  //     productId: item.id,
  //     companyId: companyId,
  //   });
  //   if (!error) {
  //     utils.showSuccessToast('Product added successfully in cart.');
  //   }
  // };

  // const onProductPress = (item: any) => {
  //   navigation.navigate(RootScreens.ProductDetail, {
  //     data: {item: item, companyId: companyId},
  //   });
  // };

  useFocusEffect(
    React.useCallback(() => {
      const fetchCartItems = async () => {
        setLoading(true);
        const items = await getCartItems(cartType);
        setCartItems(items);
        setLoading(false);
      };
      fetchCartItems();
    }, []),
  );

  const handleAddToCart = async (item: any) => {
    let cartData = {
      id: item.id,
      price: item.price,
      quantity: item.quantity,
      company: item.createdByCompany,
      product: {
        createdAt: item.createdAt,
        description: item.description,
        id: item.id,
        image: item.image,
        isDeleted: item.isDeleted,
        isPublished: item.isPublished,
        price: item.price,
        productName: item.productName,
        sku: item.sku,
        unit: item.unit,
        updatedAt: item.updatedAt,
        maxOrderQuantity: Number(item.maxOrderQuantity),
        minOrderQuantity: Number(item.minOrderQuantity),
      },
    };
    const data = await addToCart(cartData, cartType);
    setCartItems(data);
  };

  const handleIncrement = async (cartId: any) => {
    const data = await incrementCartItem(cartId, cartType);
    setCartItems(data);
  };

  const handleDecrement = async (cartId: any) => {
    const data = await decrementCartItem(cartId, 'Product', cartType);
    setCartItems(data);
  };

  const onProductPress = (item: any) => {
    // navigation.navigate(RootScreens.ProductDetail, {
    //   data: {item: item, companyId: id},
    // });
    if (cartItems?.length > 0) {
      let isSameCompany = cartItems?.some(
        (itm: any) => itm?.company?.id === item?.createdByCompany?.id,
      );
      if (isSameCompany) {
        handleAddToCart(item);
      } else {
        setSelected(item);
        setIsOpen(true);
      }
    } else {
      handleAddToCart(item);
    }
  };

  return (
    <View style={commonStyle.container}>
      {/* <NavigationBar
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
                navigation.navigate(RootScreens.CartList);
              }}>
              <SvgIcons.Buy width={wp(7)} height={wp(7)} fill={colors.orange} />
              {carts && carts?.result && carts?.result?.cart?.length ? (
                <View style={styles.countView}>
                  <FontText
                    color="white"
                    name="lexend-medium"
                    size={normalize(10)}
                    textAlign={'center'}>
                    {carts?.result?.cart?.length}
                  </FontText>
                </View>
              ) : null}
            </TouchableOpacity>
          </View>
        }
      /> */}
      <Loader loading={isProcessing || isProcess} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: hp(2)}}
        style={[commonStyle.paddingH4]}>
        {/* <Image source={{uri: productDetail?.image}} style={styles.productImg} /> */}
        {productDetail?.image ? (
          <Image
            source={{uri: productDetail.image}}
            style={styles.productImg}
          />
        ) : (
          <Image source={Images.productImg} style={styles.productImg} />
        )}
        <View style={commonStyle.marginT2}>
          <FontText
            color="black2"
            name="lexend-medium"
            size={mediumLargeFont}
            textAlign={'left'}>
            {productDetail?.productName}
          </FontText>
          <FontText
            name={'lexend-regular'}
            size={mediumLarge2Font}
            pTop={wp(1)}
            color={'orange'}>
            {'₹'}
            {productDetail?.price}
            {productDetail?.unit && `${'/'}${productDetail?.unit}`}
          </FontText>
          <FontText
            color="black2"
            name="lexend-medium"
            size={mediumLargeFont}
            textAlign={'left'}>
            {`Range : ${item?.minOrderQuantity} - ${item?.maxOrderQuantity}`}
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
        {cartItems?.filter(
          (itm: any) => itm.id.toString() == productDetail?.id.toString(),
        ).length > 0 ? (
          <View style={[commonStyle.rowAC, styles.countContainer]}>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                handleDecrement(productDetail?.id);
              }}>
              <SvgIcons.Remove width={wp(4)} height={wp(4)} />
            </TouchableOpacity>
            <FontText
              color="white"
              name="lexend-medium"
              size={largeFont}
              textAlign={'left'}>
              {
                cartItems?.find((itm: any) => {
                  return itm.id.toString() == productDetail?.id.toString();
                }).quantity
              }
            </FontText>
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => {
                handleIncrement(productDetail?.id);
              }}>
              <SvgIcons.Plus
                width={wp(4)}
                height={wp(4)}
                fill={colors.orange}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <Button
            // onPress={() => addCart(productDetail)}
            onPress={() => onProductPress(item)}
            bgColor={'orange'}
            style={[styles.buttonContainer]}>
            <FontText name={'lexend-semibold'} size={fontSize} color={'white'}>
              {'Add to cart'}
            </FontText>
          </Button>
        )}

        {/* <View style={styles.line} />
        <ListHeader
          leftName={'Related Product'}
          rightName={'See All'}
          rightPress={() => navigation.goBack()}
        />
        <ProductComponent
          data={productListData && productListData.slice(0, 2)}
          productPress={onProductPress}
          navigation={navigation}
        /> */}
      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: normalize(6),
    width: '100%',
    alignSelf: 'center',
  },
  line: {
    borderWidth: 2,
    borderColor: colors.grayOpacity,
    marginVertical: hp(2),
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
    width: '100%',
    height: hp(45),
    resizeMode: 'contain',
    borderRadius: normalize(6),
  },
  iconContainer: {
    width: hp(3.5),
    height: hp(3.5),
    borderRadius: normalize(3),
    backgroundColor: colors.white2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countContainer: {
    backgroundColor: colors.orange,
    borderRadius: normalize(4),
    justifyContent: 'space-between',
    width: '100%',
    padding: hp(1),
  },
});
