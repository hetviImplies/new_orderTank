import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../assets/colors';
import {hp, normalize, wp} from '../../styles/responsiveScreen';
import {Button, FontText, Loader, NavigationBar} from '../../components';
import {
  fontSize,
  mediumFont,
  mediumLarge2Font,
  mediumLargeFont,
} from '../../styles';
import SvgIcons from '../../assets/SvgIcons';
import {RootScreens} from '../../types/type';
import {useGetAllProductsQuery, useGetOneProductQuery} from '../../api/product';
import ListHeader from '../../components/ListHeader';
import commonStyle from '../../styles';
import {useAddCartMutation} from '../../api/cart';
import utils from '../../helper/utils';
import ProductComponent from '../../components/ProductComponent';

const ProductDetailScreen = ({navigation, route}: any) => {
  const item = route.params.data.item;
  const companyId = route.params.data.companyId;
  const {data: product, isFetching: isProcessing} = useGetOneProductQuery(
    {isBuyer: true, id: item?._id},
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
  const [addToCart, {isLoading}] = useAddCartMutation();

  const productDetail = product?.result;
  const [productListData, setProductListData] = useState([]);

  useEffect(() => {
    setProductListData(productList?.result);
  }, [isProcess]);

  const addCart = async (item: any) => {
    const {data, error}: any = await addToCart({
      productId: item._id,
      companyId: companyId,
    });
    if (!error) {
      utils.showSuccessToast('Product added successfully in cart.');
    }
  };

  const onProductPress = (item: any) => {
    navigation.navigate(RootScreens.ProductDetail, {
      data: {item: item, companyId: companyId},
    });
  };

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
                navigation.navigate(RootScreens.CartList);
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
      <Loader loading={isProcessing || isProcess || isLoading} />
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
          onPress={() => addCart(productDetail)}
          bgColor={'orange'}
          style={[styles.buttonContainer, {width: '95%'}]}>
          <FontText name={'lexend-semibold'} size={fontSize} color={'white'}>
            {'Add to cart'}
          </FontText>
        </Button>
        <View style={styles.line} />
        <ListHeader leftName={'Related Product'} />
        <ProductComponent
          data={productListData && productListData.slice(0, 2)}
          productPress={onProductPress}
          navigation={navigation}
        />
      </ScrollView>
    </View>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: normalize(6),
    width: '35%',
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
    width: wp(44),
    height: wp(44),
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRadius: normalize(6),
  },
});
